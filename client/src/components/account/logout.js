import Axios from 'axios';
import { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';

import fetchURL from '../../config';

const handleLogout = async() => {
  // const cart = useContext(CartContext);

  Axios.post(`${fetchURL}/api/logout`)
  .then((res) => {
    if (res.status >= 200 && res.status < 300) {
      console.log("LOGIN SUCCESSUL", res.data);
      // cart.clearCart();
      window.location.href = "login";
    }
  }).catch(err => {
    console.log(err.response.data);
  })
}

export default handleLogout;