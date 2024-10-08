import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { CartContext } from '../../contexts/CartContext';

import fetchURL from '../../config';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async() => {    
    // const cart = useContext(CartContext);

    Axios.post(`${fetchURL}/api/logout`)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        console.log("LOGIN SUCCESSUL", res.data);
        // cart.clearCart();
        navigate("/login");
      }
    }).catch(err => {
      console.log(err.response.data);
    })
  }

  return (
    <button onClick={handleLogout}>
      <div className='dropdown-thingy'>
        <FontAwesomeIcon icon={faRightFromBracket} />
      </div>
      <span>Logout</span>
    </button>
  )
}


export default LogoutButton;