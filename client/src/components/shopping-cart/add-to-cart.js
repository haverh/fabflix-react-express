import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";


const AddToCartBig = ({movieid, movietitle, movieposter}) => {
  const cart = useContext(CartContext);

  return (
    <button className='addToCart py-1 px-4 text-[#395B64] text-base font-bold border-0 rounded-xl bg-[#A5C9CA] m-[3px] duration-200 hover:scale-[1.02] active:scale-[0.9]' name='addToCart'
      onClick={() => cart.addOne(movieid, movietitle, movieposter)}>
      ADD TO CART
    </button>
  )
}

const AddToCartSmall = ({movieid, movietitle, movieposter}) => {
  const cart = useContext(CartContext);

  return (
    <button className='addToCart text-[#395B64] text-base font-bold border-0 rounded-[20px] bg-[#A5C9CA] m-[3px] duration-200 hover:scale-[1.05] active:scale-[0.9]' name='addToCart'
      onClick={() => cart.addOne(movieid, movietitle, movieposter)}>
      <FontAwesomeIcon icon={faCartPlus}/>
    </button>
  )
}

export { AddToCartBig, AddToCartSmall };