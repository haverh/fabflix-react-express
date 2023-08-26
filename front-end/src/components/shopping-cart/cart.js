import { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import './cart.css';


const ShoppingCart = () => {

    const cart = useContext(CartContext);
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
                    </tbody>
                </table>
                <div className='cart-bottom'>
                    <div className='cart-checkout'>
                        <div className='cart-total'>
                            <p>Sub-Total: </p>
                            <p>Sales Tax: </p>
                            <p>Grand Total: </p>
                        </div>
                        <button className='checkout-button'>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart;