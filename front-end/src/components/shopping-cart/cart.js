import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import './cart.css';


const ShoppingCart = () => {

    const cart = useContext(CartContext);
    const [tax, setTax] = useState(parseFloat((cart.getTotalCost() * 0.1).toFixed(2)));
    const [grandTotal, setGrandTotal] = useState(parseFloat(cart.getTotalCost() + tax).toFixed(2));
    console.log("Cart Page -", cart.items);

    return (
        <div className='page-content'>
            <h1>Your Cart</h1>
            <div className="cart-body">
                <table className="table table-striped cart-items">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col" >Title</th>
                        <th scope="col" >Price</th>
                        <th scope="col" >Quantity</th>
                        <th scope="col" >Total</th>
                        </tr>
                    </thead>
                    <tbody>
                    {cart.items.map((item) => (
                        <tr key={item.id}>
                            <td><Link to={`/single-movie?movieId=${item.id}`} className="link">{item.title}</Link></td>
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
                            <p><b>Sub-Total:</b>  ${cart.getTotalCost()}</p>
                            <p><b>Sales Tax:</b> ${tax}</p>
                            <p><b>Grand Total:</b> ${grandTotal}</p>
                        </div>
                        <button className='checkout-button'>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart;