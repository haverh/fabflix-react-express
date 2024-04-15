import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from  '@fortawesome/free-solid-svg-icons';

const Loading = () => {
  return (
    <div className='w-full flex flex-row justify-center text-center text-2xl'><FontAwesomeIcon icon={faSpinner} size="2x" className="mr-2"/> <h1>Loading...</h1></div>
  )
}

export default Loading;