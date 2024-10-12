import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const AddToCartBig = ({movieid, movietitle, movieposter}) => {
  const cart = useContext(CartContext);

  return (
    <button className='addToCart w-[200px] h-[30px] text-[#395B64] text-base font-bold border-0 rounded-[20px] bg-[#A5C9CA] m-[3px] duration-200 hover:scale-[1.05] active:scale-[0.9]' name='addToCart'
      onClick={() => cart.addOne(movieid, movietitle, movieposter)}>
      ADD TO CART
    </button>
  )
}

export { AddToCartBig };