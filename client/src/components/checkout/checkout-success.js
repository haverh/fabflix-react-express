import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import Loading from '../loading/loading';
import fetchURL from '../../config';

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
  

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${fetchURL}/api/authorization`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      if (response.status === 200) {
        const jsonData = await response.json();
        setEmail(jsonData.user.email);
      }
    }
    getUser();
  },[])


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
            setPaymentStatus('success');
            const data = await documentOrder(session_id);
            
            mycart.clearCart();

            setCart(data.cart);
            setOrderId(data.saleId);
            setTax(data.tax);
            setTotal(data.total);
            setGrandTotal(data.grandTotal);
            setDate(data.date);

          } else {
            setPaymentStatus('failed');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setPaymentStatus('failed');
        } finally {
          setLoading(false);
        }
      }
      verifyPayment();
    }
  }, [session_id])

  if (loading) {
    return <Loading />
  }

  if (paymentStatus === "success") {

    return (
      <div className='outerContainer'>
        <h3 className='gratitude'>Thank you for your order</h3>
        <div className='saleInfo'>
          <>Order #: {orderId}</>
          <br></br>
          <div className='customerDetais'>
            <h4>Customer Details</h4>
            <><b>Email:</b> {email}</>
          </div>
          <br></br>
          <div className='orderDetails'>
            <h4>Order Details</h4>
            <div className='order'>
              <div className='orderRow'>
                <div className='product'><b>Product</b></div>
                <div className='quantity'><b>Quantity</b></div>
                <div className='price'><b>Price</b></div>
                <div className='total'><b>Total</b></div>
              </div>
              {cart && cart.map((item) => (
                <div className='orderRow' key={item.id}>
                  <div className='product'>{item.title}</div>
                  <div className='quantity'>{item.quantity}</div>
                  <div className='price'>${item.price}</div>
                  <div className='total'>${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <br></br>
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
    )
  }
}

export default CheckoutSuccess;