import posterPlaceholder from "../../img/img-placeholder.png"

const ItemCard = ({poster, title, quantity, price, total}) => {
  return (
    <div className="flex w-full mb-2">
      <div className="item-poster">
        {poster !== "N/A" 
        ? <img className='poster rounded-[10px] border border-solid' src={poster} alt="Movie Poster"></img>
        : <div className='poster flex justify-center items-center rounded-[10px] border border-solid'>
            <img className='max-w-[100px] max-h-[100px]' src={posterPlaceholder} alt="Movie Poster"></img> 
          </div>
        }
      </div>
      <div className="flex flex-col w-full">
        <p className="title">{title}</p>
        <div className="item-details flex justify-between">
          <div>
            <p><span>Quantity:</span> {quantity}x</p>
            <p><span>Price:</span> ${price}</p>
          </div>
          <div>
            <p><span>Total:</span> ${total}</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ItemCard;