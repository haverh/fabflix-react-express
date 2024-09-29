import Axios from 'axios';

import fetchURL from '../../config';

const handleLogout = async() => {
  Axios.post(`${fetchURL}/api/logout`)
  .then((res) => {
    if (res.status >= 200 && res.status < 300) {
      console.log("LOGIN SUCCESSUL", res.data);
      window.location.href = "login";
    }
  }).catch(err => {
    console.log(err.response.data);
  })
}

export default handleLogout;