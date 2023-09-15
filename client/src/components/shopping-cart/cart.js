import { useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { useAuth0 } from "@auth0/auth0-react";
import './cart.css';


const ShoppingCart = () => {

    const { isAuthenticated, loginWithRedirect } = useAuth0();

    const cart = useContext(CartContext);
    const [tax, setTax] = useState(parseFloat((cart.getTotalCost() * 0.1).toFixed(2)));
    const [grandTotal, setGrandTotal] = useState(parseFloat(cart.getTotalCost() + tax).toFixed(2));
    console.log("Cart Page -", cart.items);

    const handleCheckout = async () => {
        try {

            const response = await fetch(`https://gotcha-movies-server.vercel.app/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cart.items),
            });
            const jsonData = await response.json();
            console.log(jsonData, jsonData.url)
            localStorage.setItem('cart', JSON.stringify(cart.items));
            localStorage.setItem('tax', JSON.stringify(tax));
            localStorage.setItem('total', JSON.stringify(cart.getTotalCost()));
            window.location.href = jsonData.url;
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const pageInfo = useMemo(() => {
        if ( isAuthenticated ) {
            return <div className='page-content'>
                <h1>Your Cart</h1>
                <div className="cart-body">
                    <table className="cart-items table table-striped rounded rounded-3 overflow-hidden">
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
                                <p><b>Sub-Total:</b>  ${cart.getTotalCost().toFixed(2)}</p>
                                <p><b>Sales Tax:</b> ${tax}</p>
                                <p><b>Grand Total:</b> ${grandTotal}</p>
                            </div>
                            <button className='checkout-button' onClick={ isAuthenticated ? handleCheckout : loginWithRedirect } >Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        }
    }, [isAuthenticated])
    return (
        <div>{pageInfo}</div>
    )
}

export default ShoppingCart;