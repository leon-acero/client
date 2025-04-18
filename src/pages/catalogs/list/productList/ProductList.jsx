import "./productList.css";
import defaultCameraImage from "../../../../camera.webp"

import axios, { regresaMensajeDeError } from '../../../../utils/axios';

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../../components/offlineFallback/OfflineFallback';
/****************************************************************************/


/*******************************    React     *******************************/
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
/****************************************************************************/

/**************************    React Icons    *******************************/
import {FaTrashAlt} from "react-icons/fa";
/****************************************************************************/

/**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import {FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
/****************************************************************************/

import {clsx} from "clsx";
import { DataGrid } from "@mui/x-data-grid";
import { formateaThousand, formateaCurrency } from '../../../../utils/formatea';

/**************************    Components    ********************************/
import BasicDialog from '../../../../components/basicDialog/BasicDialog';
import SkeletonElement from '../../../../components/skeletons/SkeletonElement';
import SnackBarCustom from '../../../../components/snackBarCustom/SnackBarCustom';
/****************************************************************************/



export default function ProductList() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/

  /**************************    useRef    **********************************/
  // avoidRerenderFetchProduct evita que se mande llamar dos veces al
  // producto y por lo mismo que se pinte dos veces
  
  const avoidRerenderFetchProduct = useRef(false);
  /***************************************************************************/


  /**************************    useState    **********************************/
  
  // mensajeSnackBar es el mensaje que se mostrara en el SnackBar, puede ser 
  // de exito o de error segun si se grabó la informacion en la BD

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no el grabado en la BD
  
  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // openModal lo uso para mostrar la ventana para preguntar al usuario
  // si quiere borrar un producto

  // currentProduct tiene la informacion del producto actualmente seleccionado

  // productList es la lista de Productos que cargue de la BD

  // isLoading es un boolean para saber si esta cargando la informacion de la BD
  // lo uso para dos cosas: que no vuelva a cargar la informacion de la BD ya que
  // en React18 lo hace dos veces, y para mostrar los dulces bailando (Skeleton)
  // si es necesario
  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState ({id: "", productName: ""});
  const [productList, setProductList] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  /****************************************************************************/


  /**************************    handleDelete    ******************************/
  // aqui manejo el borrado de un Producto
  /****************************************************************************/ 
  const handleDelete = async () => {
    setOpenModal(false);

    try {
      
      // const res = await axios({
      //   withCredentials: true,
      //   method: 'DELETE',
      //   url: `http://127.0.0.1:8000/api/v1/products/${currentProduct.id}`,
      //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/products/${currentProduct.id}`,
      //   })

      const res = await axios.delete (`/api/v1/products/${currentProduct.id}`);

      
      if (res.status === 204) {
        console.log ('El producto fue borrado con éxito!');

        // Borro el Producto del Grid Y del State
        setProductList(productList.filter((item) => item._id !== currentProduct.id));

        setIconoSnackBarDeExito(true);
        setMensajeSnackBar(`El producto ${currentProduct.productName} fue borrado.`)
        setOpenSnackbar(true);
      } 
    }
    catch(err) {
      console.log(err);
      // setMensajeSnackBar("Hubo un error al borrar el producto. Revisa que estes en línea.");

      setIconoSnackBarDeExito(false);
      setMensajeSnackBar (regresaMensajeDeError (err));
      setOpenSnackbar(true);
    }
  }
  /****************************************************************************/


  /*****************************    useEffect    ******************************/
  // fetchProducts carga la lista de Productos
  /****************************************************************************/
  useEffect (() => {

    if (!isOnline) {
      return;
    }

    // 1er Validacion: Que useEffect NO repinte dos veces    
    if (avoidRerenderFetchProduct.current) {
      return;
    }

    // 2da Validacion: Cuando este cargando los datos que muestre el Skeleton
    if (isLoading)
      return;


    const fetchProducts = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchProduct.current = true;

      try {
        setIsLoading(true);      
        // console.log("Carga de lista de productos")
        // 1era OPCION PARA USAR AXIOS
        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   url: 'http://127.0.0.1:8000/api/v1/products'
        //   // url: 'https://eljuanjo-dulces.herokuapp.com/api/v1/products'
        // });

        const res = await axios.get (`/api/v1/products`);

        setIsLoading(false);


        // 2da OPCION PARA USAR AXIOS
        // const res = await axios.get('http://127.0.0.1:8000/api/v1/products')

        // console.log(res)
        // console.log(res.data.data.data);
        setProductList(res.data.data.data)
      }
      catch (err) {
        console.log("err", err);
        setIsLoading(false);

        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError (err));
        setOpenSnackbar(true);
      }

    }
    fetchProducts();
  }, [isLoading, isOnline]);


  /*************************    openDeleteDialog    ***************************/
  // Abre la ventana que pregunta si quieres borrar el Producto
  /****************************************************************************/
  const openDeleteDialog = (id, productName) => {
   
    setCurrentProduct ({id, productName});
    setOpenModal(true);

  };

  
  /************************     handleCloseSnackbar    **********************/
  // Es el handle que se encarga cerrar el Snackbar
  /**************************************************************************/  
  // const handleCloseSnackbar = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   setOpenSnackbar(false);
  // };


  /*****************************     action    ******************************/
  // Se encarga agregar un icono de X al SnackBar
  /**************************************************************************/  
  // const action = (
  //   <>
  //     <IconButton
  //       size="small"
  //       aria-label="close"
  //       color="inherit"
  //       onClick={handleCloseSnackbar}
  //     >
  //       <FaTimes />
  //     </IconButton>
  //   </>
  // );

  /***************************     valueFormatter    ************************/
  // Formatea la celda en Moneda, osea con signo de $
  /**************************************************************************/
  // const valueFormatter = (value) => {
  //   if (value === '')
  //     return '';

  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //     maximumFractionDigits: 2,
  //   }).format(value);
  // }

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
            <Link to={"/product/" + params.row._id}>
              <button className="productListEdit">Editar</button>
            </Link>

            <FaTrashAlt
              className="productListDelete"
              onClick={() => openDeleteDialog(params.row._id, params.row.productName)}
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
      field: "productName",
      headerName: "Producto",
      width: 200,
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {             
              params?.row?.imageCover 
              ?
              (
                <img className="productListImg" 
                  src={`${params.row.imageCover}` } 
                  alt="Imagen del Producto o Imagen Default" />
              )
              : 
              (
                <img className="productListImg" src={defaultCameraImage} alt =""/>
              )
            }
            {params.row.productName}
          </div>
        );
      },
    },
    { 
      field: "inventarioActual", 
      headerName: 'Inv. Actual', 
      width: 100,
      headerAlign: 'center', 
      align: 'right',
      valueFormatter: ({value}) => formateaThousand(value),
      cellClassName: (params) => clsx (
        { 
          inventarioActualNegativo: parseInt(params.row.inventarioActual, 10) < parseInt(params.row.inventarioMinimo, 10),
        })
      ,
      // valueGetter: (params) => params.row.inventarioActual - params.row.inventarioMinimo
    },
    {
      field: "inventarioMinimo",
      headerName: "Inv. Minimo",
      width: 100,
      headerAlign: 'center',
      valueFormatter: ({value}) => formateaThousand(value),
      align: 'right',
    },
    {
      field: "priceMenudeo",
      headerName: "Precio Menudeo",
      width: 140,
      headerAlign: 'center',
      valueFormatter: ({value}) => formateaCurrency(value),
      align: 'right',
    },
    {
      field: "priceMayoreo",
      headerName: "Precio Mayoreo",
      width: 140,
      headerAlign: 'center',
      valueFormatter: ({value}) => formateaCurrency(value),
      align: 'right',
    },
    {
      field: "costo",
      headerName: "Costo",
      width: 90,
      headerAlign: 'center',
      valueFormatter: ({value}) => formateaCurrency(value),
      align: 'right',
    },    
    { 
      field: "_id", 
      headerName: "ID", 
      width: 0, 
      headerAlign: 'center', 
    },
  ];

  return (
    <>
      {
        isOnline && (
          <div className="productList">
            <SnackBarCustom 
                openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} mensajeSnackBar={mensajeSnackBar} 
                iconoSnackBarDeExito={iconoSnackBarDeExito} />  
            {/* <Snackbar
              open={openSnackbar}
              autoHideDuration={5000}
              onClose={handleCloseSnackbar}
            >
              <Alert 
                  severity= {iconoSnackBarDeExito ?  "success" : "error"} 
                  action={action}
                  sx={{ fontSize: '1.4rem', backgroundColor:'#333', color: 'white', }}
              >{mensajeSnackBar}
              </Alert>
            </Snackbar> */}
      
            {
            /* ////////////////////////////////////////////////////////////////
            // -Dialog
            //////////////////////////////////////////////////////////////// 
            */}
            <BasicDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                message= {`¿Estas seguro que deseas borrar a ${currentProduct.productName}?`}
                onSubmit={handleDelete}
                captionAceptar={"Borrar"}
                captionCancelar={"Cancelar"}
            />
      
            <div className="productTitleContainer">
              <h1 className="productTitle">Catálogo de Productos</h1>
              <Link to="/new-product">
                <button className="productAddButton">Crear</button>
              </Link>
            </div>
            { 
              productList?.length > 0 &&
              <DataGrid className="dataGrid"
                initialState={{
                  pagination: {
                    pageSize: 8,
                  },
                }}
                // pageSize={8}
                rows={productList}
                disableSelectionOnClick
                columns={columns}
                rowsPerPageOptions={[8, 16, 24]}
                // checkboxSelection
              />
            }
            {
              isLoading && <SkeletonElement type="rectangular" />
            }
          </div>
        )
      }
      {
        !isOnline && <OfflineFallback />       
      }
    </>

  );
}
