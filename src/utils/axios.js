import axios from "axios";
	
  // SERVIDORES DE DEVELOPMENT
  export const BASE_URL = 'http://127.0.0.1:8000';
  export const FRONT_END_URL = 'http://127.0.0.1:3000';
  
  // SERVIDORES DE PRODUCTION
  // export const BASE_URL = 'https://eljuanjo-dulces-api.onrender.com';
  // export const FRONT_END_URL = 'https://eljuanjo-dulceria.onrender.com';

  export default axios.create ({
    baseURL: BASE_URL,
    withCredentials: true,
    // timeout: 60000
  })

  export const regresaMensajeDeError = (err) => {

    let mensajeSnackBar = "";

    if (err?.name) 
      mensajeSnackBar += `Name: ${err.name}. `

    if (err?.code)
      mensajeSnackBar += `Code: ${err.code}. `;

    if (err?.statusCode) 
      mensajeSnackBar += `Status Code: ${err.statusCode}. `;

    if (err?.status) 
      mensajeSnackBar += `Status: ${err.status}. `;

    if (err?.message) 
      mensajeSnackBar += `Mensaje: ${err.message}. `;

    // console.log("mensajeSnackBar", mensajeSnackBar);
 
    // console.log("err.response.data.message", err?.response?.data?.message);
    
    if (err?.code === "ECONNABORTED") {
      mensajeSnackBar = "El tiempo establecido para cargar los datos expiró, checa si estas en un lugar con mala de recepción de red y vuelve a intentar.";
    }
    // else if (err?.code === 'ERR_BAD_REQUEST') { 
    //   mensajeSnackBar = "Has sobrepasado el número máximo de solicitudes, espera una hora y vuelve a intentar.";
    // }
    else if (err?.code === "ERR_NETWORK") {
      mensajeSnackBar = "Error al conectarse a la Red. Si estas usando Wi-Fi checa tu conexión. Si estas usando datos checa si tienes saldo. O bien checa si estas en un lugar con mala recepción de red y vuelve a intentar.";
    }
    else if (err?.response?.data?.message){
      mensajeSnackBar = err.response.data.message;
    }
    else if (mensajeSnackBar === "") {
      mensajeSnackBar = `Error: ${err}`;
    }

    //else si no fue ninguno de lo anterior regreso mensajeSnackBar tal cual
 
    return mensajeSnackBar;
  }

 