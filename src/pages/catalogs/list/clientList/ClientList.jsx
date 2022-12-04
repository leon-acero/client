import "./clientList.css";
import axios, { BASE_URL } from '../../../../utils/axios';
// import axios from "axios";

/*******************************    React     *******************************/
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
/****************************************************************************/


/**************************    React Icons    *******************************/
import {FaTrashAlt} from "react-icons/fa";
/****************************************************************************/

/**************************    Snackbar    **********************************/
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import {FaTimes} from "react-icons/fa";
import { Alert } from '@mui/material';
/****************************************************************************/

import { DataGrid } from "@mui/x-data-grid";

/**************************    Components    ********************************/
import BasicDialog from '../../../../components/basicDialog/BasicDialog';
import SkeletonElement from '../../../../components/skeletons/SkeletonElement';
// import { useNavigatorOnLine } from '../../../../hooks/useNavigatorOnLine';
/****************************************************************************/



export default function ClientList() {

  // const isOnline = useNavigatorOnLine();
  
  /**************************    useRef    **********************************/
  // avoidRerenderFetchClient evita que se mande llamar dos veces al
  // cliente y por lo mismo que se pinte dos veces
  
  const avoidRerenderFetchClient = useRef(false);
  /**************************************************************************/


  /**************************    useState    **********************************/
  
  // mensajeSnackBar es el mensaje que se mostrara en el SnackBar, puede ser 
  // de exito o de error segun si se grabó la informacion en la BD

  // updateSuccess es boolean que indica si tuvo exito o no el grabado en la BD
  
  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // openModal lo uso para mostrar la ventana para preguntar al usuario
  // si quiere borrar un cliente

  // currentProduct tiene la informacion del cliente actualmente seleccionado

  // productList es la lista de Productos que cargue de la BD

  // isLoading es un boolean para saber si esta cargando la informacion de la BD
  // lo uso para dos cosas: que no vuelva a cargar la informacion de la BD ya que
  // en React18 lo hace dos veces, y para mostrar los dulces bailando (Skeleton)
  // si es necesario

  const [updateSuccess, setUpdateSuccess] = useState (true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentClient, setCurrentClient] = useState ({id: "", businessName: ""});
  const [clientList, setClientList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  /****************************************************************************/


  /**************************    handleDelete    ******************************/
  // aqui manejo el borrado de un Cliente
  /****************************************************************************/ 
  const handleDelete = async () => {
    setOpenModal(false);

    try {

      // const res = await axios({
      //   withCredentials: true,
      //   method: 'DELETE',
      //   url: `http://127.0.0.1:8000/api/v1/clients/${currentClient.id}`,
      //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/clients/${currentClient.id}`,
      //   })

      const res = await axios.delete (`/api/v1/clients/${currentClient.id}`);

      
      if (res.status === 204) {
        console.log ('El cliente fue borrado con éxito!');

        // Borro el cliente del Grid Y del State        
        setUpdateSuccess(true);
        setClientList(clientList.filter((item) => item._id !== currentClient.id));
        setMensajeSnackBar(`El cliente ${currentClient.businessName} fue borrado.`)
        setOpenSnackbar(true);
      } 
    }
    catch(err) {
      console.log(err);
      setUpdateSuccess(false);
      setMensajeSnackBar("Hubo un error al borrar el cliente. Revisa que estes en línea.");
      setOpenSnackbar(true);
    }
  }
  /****************************************************************************/


  /*****************************    useEffect    ******************************/
  // fetchClients carga la lista de Clientes
  /****************************************************************************/
  useEffect (() => {

    if (avoidRerenderFetchClient.current) {
      return;
    }

    if (isLoading)
      return;

    const fetchClients = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchClient.current = true;

      try {

        setIsLoading(true);
  
        console.log("cargar lista de clientes")
        // 1era OPCION PARA USAR AXIOS
        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   url: 'http://127.0.0.1:8000/api/v1/clients'
        //   // url: 'https://eljuanjo-dulces.herokuapp.com/api/v1/clients'
        // });

        const res = await axios.get (`/api/v1/clients`);

  
        setIsLoading(false);
  
        // 2da OPCION PARA USAR AXIOS
        // const res = await axios.get('http://127.0.0.1:8000/api/v1/products')
  
        // console.log(res)
        // console.log(res.data.data.data);
        setClientList(res.data.data.data)
      }
      catch(err) {
        console.log("err", err);
        setIsLoading(false);

        let mensajeSnackBar = "";

        if (err.name) 
          mensajeSnackBar += `Name: ${err.name}. `
  
        if (err.code)
          mensajeSnackBar += `Code: ${err.code}. `;
  
        if (err.statusCode) 
          mensajeSnackBar += `Status Code: ${err.statusCode}. `;
  
        if (err.status) 
          mensajeSnackBar += `Status: ${err.status}. `;
  
        if (err.message) 
          mensajeSnackBar += `Mensaje: ${err.message}. `;
  
        // console.log("mensajeSnackBar", mensajeSnackBar);
        
        console.log("err.response.data.message", err.response.data.message);
        
        if (err.response.data.message){
          setMensajeSnackBar(err.response.data.message)
        }
        else if (err.code === "ERR_NETWORK")
          setMensajeSnackBar ("Error al conectarse a la Red. Si estas usando Wi-Fi checa tu conexión. Si estas usando datos checa si tienes saldo. O bien checa si estas en un lugar con mala recepción de red y vuelve a intentar.");
        else {
          // setMensajeSnackBar(`Error: ${err}`)      
          setMensajeSnackBar (mensajeSnackBar);
        }
  
  
        setOpenSnackbar(true);
      }
    }
    fetchClients();
  }, [isLoading]);


  /*************************    openDeleteDialog    ***************************/
  // Abre la ventana que pregunta si quieres borrar el Cliente
  /****************************************************************************/
  const openDeleteDialog = (id, businessName) => {
   
    setCurrentClient ({id, businessName});
    setOpenModal(true);

  };


  /************************     handleCloseSnackbar    **********************/
  // Es el handle que se encarga cerrar el Snackbar
  /**************************************************************************/  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  
  /*****************************     action    ******************************/
  // Se encarga agregar un icono de X al SnackBar
  /**************************************************************************/  
  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <FaTimes />
      </IconButton>
    </>
  );


  /***************************     columns    *******************************/
  // Formatea las columnas y tambien las celdas
  // El llenado de informacion en la tabla se hace en
  // <DataGrid className="dataGrid"
  // rows={productList}
  /**************************************************************************/
  const columns = [
    {
      field: "action",
      headerName: "Acción",
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <>
            <Link to={"/client/" + params.row._id}>
              <button className="clientListEdit">Editar</button>
            </Link>
 
            <FaTrashAlt
              className="clientListDelete"
              onClick={() => openDeleteDialog(params.row._id, params.row.businessName)}
            />
          </>
        );
      },
    },
    { 
      field: "sku", 
      headerName: "SKU", 
      width: 30, 
      headerAlign: 'center', 
      align: 'right',
    },
    {
      field: "businessName",
      headerName: "Negocio",
      width: 280,
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <div className="clientListClient">
            {
              params?.row?.imageCover &&
              (<img className="clientListImg" 
                  // src={`http://127.0.0.1:8000/img/clients/${params.row.imageCover}`} 
                  src={`${BASE_URL}/img/clients/${params.row.imageCover}`} 
                  alt="" 
              />)
            }
            {params.row.businessName}
          </div>
        );
      },
    },
    { 
      field: "ownerName", 
      headerName: "Contacto", 
      width: 160, 
      headerAlign: 'center', 
    },
    {
      field: "cellPhone",
      headerName: "Celular",
      width: 120,
      headerAlign: 'center',
      align: 'right',
    },
    {
      field: "businessAddress",
      headerName: "Dirección",
      width: 200,
      headerAlign: 'center',
    },
    { 
      field: "_id", 
      headerName: "ID", 
      width: 30, 
      headerAlign: 'center', 
      align: 'right', 
    },
  ];

  return (
    <div className="clientList">

      <Snackbar
      open={openSnackbar}
      autoHideDuration={5000}
      onClose={handleCloseSnackbar}
      >
        <Alert 
            severity= {updateSuccess ?  "success" : "error"} 
            action={action}
            sx={{ fontSize: '1.4rem', backgroundColor:'#333', color: 'white', }}
        >{mensajeSnackBar}
        </Alert>
      </Snackbar>

      {
      /* ////////////////////////////////////////////////////////////////
      // -Dialog
      //////////////////////////////////////////////////////////////// 
      */}
      <BasicDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        message= {`¿Estas seguro que deseas borrar a ${currentClient.businessName}?`}
        onSubmit={handleDelete}
        captionAceptar={"Borrar"}
        captionCancelar={"Cancelar"}
      />

      <div className="clientTitleContainer">
        <h1 className="clientTitle">Catálogo de Clientes</h1>
        <Link to="/new-client">
          <button className="clientAddButton">Crear</button>
        </Link>
      </div>
      {
        clientList?.length > 0 &&
          <DataGrid className="dataGrid"
            initialState={{
              pagination: {
                pageSize: 8,
              },
            }}
            rows={clientList}
            disableSelectionOnClick
            columns={columns}
            rowsPerPageOptions={[8, 16, 24]}
            // pageSize={8}
            // checkboxSelection
          />
      }
      {
        isLoading && <SkeletonElement type="rectangular" />
      }
      {/* <div>
        <h1>Estas {isOnline ? 'online' : 'offline'}.</h1>;
      </div> */}

    </div>
  );
}

