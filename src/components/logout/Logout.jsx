import { useEffect, useRef, useContext } from 'react'
// import axios from "axios";
import axios from "../../utils/axios";

import { stateContext } from '../../context/StateProvider';
import { useHistory } from 'react-router-dom';


export default function Logout() {

  const history = useHistory();

  const { setCurrentUser } = useContext(stateContext);

  /**************************    useRef    **********************************/
  // avoidRerenderFetchLogout evita que se mande llamar dos veces al
  // cliente y por lo mismo que se pinte dos veces
  
  const avoidRerenderFetchLogout = useRef(false);
  /*****************************************************************************/

  /************************     useEffect    *******************************/
  // logout mandao cargar desde la BD el Producto que me ineteresa
  // actualizar
  /**************************************************************************/

  useEffect (() => {

    if (avoidRerenderFetchLogout.current) {
      return;
    }

    const logout = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchLogout.current = true;

      console.log("useEffect")
      try {
        // console.log("logout 1")
        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   // url: `http://127.0.0.1:8000/api/v1/users/logout`
        //   url: `https://eljuanjo-dulces.herokuapp.com/api/v1/users/logout`
        // });

        const res = await axios.get ('/api/v1/users/logout');


        console.log("Usuario desloggeado")
        // console.log("res", res);
        if (res.data.status === 'success') {
          setCurrentUser(null);
          history.replace("/");
        }
      }
      catch(err) {
        console.log(err);
      }
    }

    logout();
   
  }, [history, setCurrentUser]);

  
}
