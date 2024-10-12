import { createContext, useState, useEffect } from "react";

import fetchURL from "../config";

export const CartContext = createContext({
  items: [],
  getTotalQuantity: () => {},
  getItemQuantity: () => {},
  addOne: () => {},
  removeOne: () => {},
  removeFromCart: () => {},
  getTotalCost: () => {},
  clearCart: () => {},
});

export function CartProvider ({ children }) {
  const initialCart = JSON.parse(localStorage.getItem("cart")) || [];
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart])


  // Fetches price from database for specific movie
  const fetchPrice = async (movieId) => {
    return fetch(`${fetchURL}/api/cart/price?movieId=${movieId}`,{
      credentials: "include"
    })
    .then(response => response.json())
    .then(jsonData => jsonData.price)
    .catch(error => {
      console.error('Error fetching data:', error);
      return null; // Return null or some default value in case of error
    });
  }

  // Get title of movie given id
  const getTitle = (id) => {
    const title = cart.find( item => item.id === id )?.title;

    return title;
  }

  const getTotalQuantity = () => {
    const quantity = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (quantity === undefined) {
      return 0;
    }

    return quantity;
  }

  // Return 0 if item not found, else return the quantity
  const getItemQuantity = (id) => {
    const quantity = cart.find( item => item.id === id)?.quantity;

    if ( quantity === undefined ){
      return 0;
    }

    return quantity;
  }

  // Add 1 quantity of an item to the cart
  const addOne = async (id, title, poster) => {
    const quantity = getItemQuantity(id);
    
    if ( quantity === 0 ) { // item not in cart
      const fetchedPrice = await fetchPrice(id);
      setCart(
        [
          ...cart, 
          { id: id, title: title, poster: poster, quantity: 1, price: parseFloat(fetchedPrice) }
        ])
    } else { // item is in cart
      // map over and find id, add 1 to quantity or return same object
      setCart( cart.map( 
        item => item.id === id 
        ? { ...item, quantity: item.quantity + 1}
        : item
      ))
    }
  }

  // Remove 1 quantity of an item in cart
  const removeOne = (id) => {
    const quantity = getItemQuantity(id);
    
    if ( quantity === 1 ) { // 1 item in cart
      removeFromCart(id);
    } else { 
      setCart( cart.map( 
        item => item.id === id 
        ? { ...item, quantity: item.quantity - 1}
        : item
      ))
    }
  }

  // Remove whole item from cart
  const removeFromCart = (id) => {
    setCart(
      cart => cart.filter(currentItem => { // add items into [] that have different id
        return currentItem.id !== id;
      })
    )
  }

  // Get total cost of cart
  const getTotalCost = () => {
    const totalCost = cart.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    return totalCost;
  }

  // Clear items in cart
  const clearCart = () => {
    setCart([]);
  }

  const contextValue = {
    items: cart,
    getTotalQuantity,
    getItemQuantity,
    addOne,
    removeOne,
    removeFromCart,
    getTotalCost,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;