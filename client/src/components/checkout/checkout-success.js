import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import Loading from '../loading/loading';
import fetchURL from '../../config';

import ItemCard from './item-card';

import './checkout-success.css';

const CheckoutSuccess = () => {

  const mycart = useContext(CartContext);
  
  const [cart, setCart] = useState(mycart.items);
  const [tax, setTax] = useState(parseFloat((mycart.getTotalCost() * 0.1).toFixed(2)));
  const [total, setTotal] = useState(parseFloat(mycart.getTotalCost().toFixed(2)));
  const [grandTotal, setGrandTotal] = useState(parseFloat(mycart.getTotalCost() + tax).toFixed(2));
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [orderId, setOrderId] = useState(null);
  const [email, setEmail] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const session_id = queryParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  


  const getEmail = async () => {
    const response = await fetch(`${fetchURL}/api/authorization`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    });

    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData.user.email;
    }
  }


  const documentOrder = async (session_id) => {
    try {
      const response = await fetch(`${fetchURL}/api/sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({cart, session_id, tax, total, grandTotal, email, date}),
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  useEffect(() => {

    if (session_id) {
      const verifyPayment = async () => {
        try {
          const response = await fetch(`${fetchURL}/api/payment-verify?session_id=${session_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
          });
          const data = await response.json();

          if (data.success) {
            const email = await getEmail();
            setEmail(email);

            setPaymentStatus('success');

          } else {
            setPaymentStatus('failed');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setPaymentStatus('failed');
        }
      }
      verifyPayment();
    }
  }, [session_id])

  useEffect(() => {
    const callDocumentOrder = async () => {
      try {
        if (email && paymentStatus === "success") {
          const cartData = await documentOrder(session_id);


          setCart(cartData.cart);
          setOrderId(cartData.saleId);
          setTax(cartData.tax);
          setTotal(cartData.total);
          setGrandTotal(cartData.grandTotal);
          setDate(cartData.date);

          mycart.clearCart();
        }
      } catch (error) {
        console.error('Error inserting sale:', error);
      } finally {
        setLoading(false);
      }
      
    }

    callDocumentOrder()
  }, [email, paymentStatus])

  if (loading) {
    return <Loading />
  } else {
    return (
      <div className='checkout-success-content'>
        <div className='cart-container'>
          <h3 className='gratitude'>Thank you for your order</h3>
          <div className='saleInfo'>
            <>Order #: {orderId}</>
            <hr></hr>

            <div className='customerDetais'>
              <h4>Customer Details</h4>
              <><b>Email:</b> {email}</>
            </div>

            <hr></hr>

            <div className='orderDetails'>
              <h4>Order Details</h4>
              <div className='order'>
                {cart && cart.map((item) => (
                  <ItemCard 
                    poster={item.poster} 
                    title={item.title} 
                    quantity={item.quantity}
                    price={item.price}
                    total={(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)} />
                ))}
              </div>

              <hr></hr>
              
              <div className='paymentDetails'>
                <h4>Payment Details</h4>
                <div className='paymentRow'>
                  <div className='payment-type'><b>Sub-Total:</b></div>
                  <div className='payment-amount'>${total}</div>
                </div>
                <div className='paymentRow'>
                  <div className='payment-type'><b>Sales Tax:</b></div>
                  <div className='payment-amount'>${tax}</div>
                </div>
                <div className='paymentRow'>
                  <div className='payment-type'><b>Grand Total:</b></div>
                  <div className='payment-amount'>${grandTotal}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CheckoutSuccess;