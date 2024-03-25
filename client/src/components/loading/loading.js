import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from  '@fortawesome/free-solid-svg-icons';

const Loading = () => {
  return (
    <div className='w-full text-center text-2xl'><FontAwesomeIcon icon={faSpinner} /> Loading...</div>
  )
}

export default Loading;