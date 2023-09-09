import { useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import './checkout-success.css';

const CheckoutSuccess = () => {

    const { isAuthenticated, loginWithRedirect, user } = useAuth0();

    const cart = JSON.parse(localStorage.getItem('cart'));
    const tax = JSON.parse(localStorage.getItem('tax'));
    const total = JSON.parse(localStorage.getItem('total'));
    const grandTotal = parseFloat(total + tax).toFixed(2);
    console.log(user);

    return (
        <div className='saleInfo'>
            <>Order #: {}</>
            <h3>Thank you for your order</h3>
            <div className='orderDetails'>
                <h4>Order Details</h4>
                <div className='order'>
                    <div className='orderRow'>
                        <div className='product'><b>Product</b></div>
                        <div className='quantity'><b>Quantity</b></div>
                        <div className='price'><b>Price</b></div>
                        <div className='total'><b>Total</b></div>
                    </div>
                    {cart.map((item) => (
                        <div className='orderRow' key={item.id}>
                            <div className='product'>{item.title}</div>
                            <div className='quantity'>{item.quantity}</div>
                            <div className='price'>${item.price}</div>
                            <div className='total'>${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</div>
                        </div>
                    ))}
                </div>
                <br></br>
                <div className='payment'>
                    <div className='paymentRow'>
                        <div className='payment-type'><b>Sub-Total</b></div>
                        <div className='payment-amount'>${total.toFixed(2)}</div>
                    </div>
                    <div className='paymentRow'>
                        <div className='payment-type'><b>Sales Tax</b></div>
                        <div className='payment-amount'>${tax}</div>
                    </div>
                    <div className='paymentRow'>
                        <div className='payment-type'><b>Grand Total</b></div>
                        <div className='payment-amount'>${grandTotal}</div>
                    </div>
                </div>
                    {/* <table className="cart-items table">
                        <thead className="thead-light">
                            <tr>
                            <th scope="col" >Title</th>
                            <th scope="col" >Price</th>
                            <th scope="col" >Quantity</th>
                            <th scope="col" >Total</th>
                            </tr>
                        </thead>
                        <tbody>
                        {cart.map((item) => (
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>${item.price}</td>
                                <td>{item.quantity}</td>
                                <td>${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className='cart-bottom'>
                    <div className='cart-checkout'>
                        <div className='cart-total'>
                            <p><b>Sub-Total:</b>  ${total.toFixed(2)}</p>
                            <p><b>Sales Tax:</b> ${tax}</p>
                            <p><b>Grand Total:</b> ${grandTotal}</p>
                        </div>
                    </div> */}
                
            </div>
        </div>
    )
}

export default CheckoutSuccess;