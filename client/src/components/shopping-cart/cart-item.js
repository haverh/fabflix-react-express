import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import posterPlaceholder  from '../../img/img-placeholder.png';


const CartItem = ({id, title, poster, quantity, price}) => {

  const cart = useContext(CartContext);

  return (
    <div className="item-container border-2 border-opacity-20 border-gray-400">
      <div className="item-poster">
        {poster !== "N/A" 
        ? <img className='poster max-h-[200px] max-w-[150px] rounded-[10px] border border-solid border-black' src={poster} alt="Movie Poster"></img>
        : <div className='poster flex justify-center items-center h-[200px] w-[150px] rounded-[10px] border border-solid border-black'>
            <img className='w-[100px] h-[100px]' src={posterPlaceholder} alt="Movie Poster"></img> 
          </div>
        }
      </div>

      <div className="item-details">

        <div className="title flex items-center">
          <p className="font-bold">{title}</p>
        </div>

        <div className="quant-price">
          <div className='quantity flex justify-center items-center'>
            <button className='size-[20px] rounded-md border hover:bg-red-700 text-lg flex justify-center items-center'
              onClick={() => cart.removeOne(id, title)}
            >
              <FontAwesomeIcon icon={faMinus} size='2xs' />
            </button>
            <span className='m-2 w-[20px] text-center'>{quantity}</span>
            <button className='size-[20px] rounded-md border hover:bg-green-700 text-lg flex justify-center items-center'
              onClick={() => cart.addOne(id, title)}
            >
              <FontAwesomeIcon icon={faPlus} size='2xs' />
            </button>
          </div>

          <div className="total flex justify-center items-center">
            ${(parseFloat(price) * parseInt(quantity)).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

