import './pagination.css';

const Pagination = ({currentPage, totalResult, perPage, prevButtonEvent, nextButtonEvent}) => {

  return (
    <div className='paginationButtons flex justify-center items-center gap-[10%]'>
      <button
        className={currentPage === 1 ? 'disabled-btn' : 'enabled-btn'}
        onClick={prevButtonEvent} 
        disabled={currentPage === 1}
        >&lt;Prev
      </button>
      <span className='bg-[#f0f0f0] text-black w-fit h-fit py-[2px] px-[5px] border border-solid rounded-[5px] text-center font-bold'>{currentPage}</span>
      <button 
        className={Math.ceil(totalResult/perPage - 1) + 1 === currentPage ? 'disabled-btn' : 'enabled-btn'}
        onClick={nextButtonEvent} 
        disabled={Math.ceil(totalResult/perPage - 1) + 1 === currentPage}
        >Next&gt;
      </button>
    </div>
  )
}

export default Pagination;
