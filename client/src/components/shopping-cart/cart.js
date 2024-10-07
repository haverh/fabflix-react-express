/* eslint-disable no-throw-literal */
import { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';

import fetchURL from '../../config';

import './cart.css';
import CartItem from './cart-item';


const ShoppingCart = () => {

  const cart = useContext(CartContext);
  const tax = parseFloat((cart.getTotalCost() * 0.1).toFixed(2));
  const grandTotal = parseFloat(cart.getTotalCost() + tax).toFixed(2);

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${fetchURL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(cart.items),
      });
      const jsonData = await response.json();

      if (!response.ok) {
        throw {
          ...jsonData,
          status: response.status,
        }
      }
      window.location.href = jsonData.url;
    } catch (error) {
      console.error('Error fetching data:', error);
      if ( error.name === "TokenExpiredError" || error.name === "NoTokenError" ) {
        window.location.href = "login";
      }
    }
  }

  return (
    <div className='cart-page-content'>
      <h1>Your Cart</h1>
      <div className="cart-body">
        <div className='cart-cards'>
          {cart.items.map((item) => (
            <CartItem id={item.id} title={item.title} poster={item.poster} quantity={item.quantity} price={item.price} />
          ))}
        </div>
        <div className='cart-bottom'>
          <div className='cart-checkout'>
            <div className='cart-total'>
              <p><b>Sub-Total:</b>  ${cart.getTotalCost().toFixed(2)}</p>
              <p><b>Sales Tax:</b> ${tax}</p>
              <p><b>Grand Total:</b> ${grandTotal}</p>
            </div>
            <button className='checkout-button' onClick={ handleCheckout } >Checkout</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart;