import "./updateOrder.css"

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../components/offlineFallback/OfflineFallback';
/****************************************************************************/


import { SE_APLICA_DESCUENTO } from '../../../utils/seAplicaDescuento';

/****************************    React    ***********************************/
import { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom'
/****************************************************************************/

/**************************    Components    *********************************/
import ProductInput from '../../../components/productInput/ProductInput';
import ProductOrdered from '../../../components/productOrdered/ProductOrdered';
import BasicDialog from '../../../components/basicDialog/BasicDialog';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';
import SnackBarCustom from '../../../components/snackBarCustom/SnackBarCustom';
/****************************************************************************/

/**************************    Context API    *******************************/
import { stateContext } from '../../../context/StateProvider';
/****************************************************************************/

/**************************    React-Icons    *******************************/
import {FaShoppingCart, FaSearch, FaTimes} from "react-icons/fa";
/****************************************************************************/

import axios, { regresaMensajeDeError } from '../../../utils/axios';
import { formateaCurrency } from '../../../utils/formatea';

/**************************    Framer-Motion    **********************************/
import { domAnimation, LazyMotion, m } from 'framer-motion';

const containerVariants = {
  hidden: { 
    opacity: 0, 
  },
  visible: { 
    opacity: 1, 
    transition: { duration: .4, delay: 0.5 }
  },
  exit: {
    opacity: 0,
    transition: { duration: .4, ease: 'easeInOut' }
  }
};
/****************************************************************************/



export default function UpdateOrder() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /****************************    useContext    *******************************/
  // El id del usuario de la App, es decir el id del Vendedor que esta usando la App

  const { currentUser } = useContext(stateContext);
  /*****************************************************************************/  


  /****************************    useParams    *******************************/
  // history lo uso para redireccionar la página a /search-client cuando el pedido
  // haya sido borrado 
  const history = useHistory();
  /*****************************************************************************/  


  /****************************    useLocation    *****************************/
  // Estos datos del Cliente los obtengo con useLocation los cuales los mandé
  // desde NewOrUpdateClient.jsx

  const { clientId, 
          businessName, 
          cellPhone, 
          esMayorista, 
          fecha,
          usarComponenteComo,
          businessImageCover,
          client } = useLocation().state;

  /****************************************************************************/

  /**************************    useRef    **********************************/
  // avoidRerenderFetchClient evita que se mande llamar dos veces al
  // cliente y por lo mismo que se pinte dos veces
  
  const avoidRerenderFetchClient = useRef(false);
  const avoidRerenderFetchProducts = useRef(false);
  /*****************************************************************************/  


  /**************************    useState    **********************************/

  // openModal abre una ventana Modal para preguntar si desea borrar el Pedido
  
  // openModalEstatusPedido abre una ventana para preguntar si desea actualizar
  // el Estatus del Pedido antes de grabarlo

  // isSaving es un boolean para saber si esta grabando la informacion en la BD
  // lo uso para deshabilitar el boton de Grabar y que el usuario no le de click
  // mientras se esta guardando en la BD 

  // isDeleting es un boolean para saber si esta borrando la informacion en la BD
  // lo uso para deshabilitar el boton de Borrar y que el usuario no le de click
  // mientras se esta borrando en la BD  

  // mensajeSnackBar es el mensaje que se mostrara en el SnackBar, puede ser 
  // de exito o de error segun si se grabó la informacion en la BD

  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // seAplicaDescuento es boolean para ver si se aplica descuento al pedido
  // por ejemplo del 10%

  // totalBasket es la cantidad total en pesos ordenada por el cliente
  // NO incluye el descuento si es que aplica
  // para calcular la cantidad Total es: totalBasket - totalDescuento
  // pero el resultado NO se guarda en ningun lado, ni en la BD
  // SIEMPRE se hara el cálculo en memoria

  // totalDescuento es la cantidad total a ser descontada del pedido

  // theBasket es el pedido, el carrito, osea es la lista de productos (ARRAY)
  // que el cliente ordenó, incluye:
  //  la cantidad ordenada, 
  // el precio unitario (el cual varia si el cliente es Minorista o Mayorista)
  // el descuento que se hizo por cada producto (si es que aplica)
  // sku, id del producto, id del cliente
  // debe incluir id del vendedor (AUN NO ESTA)
  // nombre del negocio, nombre del producto, el costo del producto cuando
  // fue comprado por la dulceria

  // searchBarQuery es lo que el usuario captura para buscar un producto

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no el grabado en la BD
  // me sirve para mandar un mensaje de exito o error en el SnackBar

  // productCatalog contiene el catálogo de Productos

  // estatusPedido indica el estatus del Pedido: 
  //        value: 1 Por entregar y NO cobrado 
  //        value: 2 Entregado y Cobrado

  // isLoading es para poner el Skeleton en caso de que se este cargando informacion


  const [openModal, setOpenModal] = useState(false);
  const [openModalEstatusPedido, setOpenModalEstatusPedido] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // const [seAplicaDescuento, setSeAplicaDescuento] = useState(false);
  const [totalBasket, setTotalBasket] = useState (0);
  const [totalDescuento, setTotalDescuento] = useState (0);
  const [theBasket, setTheBasket] = useState(
      {
        createdAt: new Date(Date.now()),
        user: currentUser._id,
        userName: currentUser.name, 
        clientId: clientId,
        businessName: businessName,
        // estatusPedido donde 1 es Por Entregar y 2 es Entregado
        estatusPedido: 0, 
        esMayorista: esMayorista,
        seAplicaDescuento: false,
        businessImageCover: businessImageCover,
        productOrdered: []
      });
  // const [theBasket, setTheBasket] = useState({});

   // Aqui guardo lo que escribo en el input className="searchInput"
  // PREGUNTA: porque NO tengo value, id, name??
  const [searchBarQuery, setSearchBarQuery] = useState("");
  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [productCatalog, setProductCatalog] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [showFaTimes, setShowFaTimes] = useState(false);

  // const [estatusPedido, setEstatusPedido] = useState("porEntregar");

  // estatusPedido donde 1 es Por Entregar y 2 es Entregado
  // const [estatusPedido, setEstatusPedido] = useState(1);

  // Este código: estatusPedido, Funciona para REACT-SELECT
  // Que viene siendo un component llamado <Select />
  // Que es diferente a 
  // <select> que es un element de HTML
  // const [estatusPedido, setEstatusPedido] = useState(options[0].value);
  /****************************************************************************/


  /************************     useEffect - fetchOrder   ********************/
  // fetchOrder mando cargar desde la BD el Pedido que me interesa
  // actualizar
  /**************************************************************************/

  useEffect (() => {

    if (!isOnline) {
      return;
    }

    if (avoidRerenderFetchClient.current) {
      return;
    }

    const fetchOrder = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchClient.current = true;

      try {
        console.log("cargar Pedido del Server");
  
        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   url: `http://127.0.0.1:8000/api/v1/sales/update-order/client/${clientId}/fecha/${fecha}`
        //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/sales/update-order/client/${clientId}/fecha/${fecha}`
        // });
  
        const res = await axios.get (`/api/v1/sales/update-order/client/${clientId}/fecha/${fecha}`);
  
        // console.log("res", res);
        console.log("res.data.data.updateOrder", res.data.data.updateOrder);
  
        const updateOrder = res.data.data.updateOrder;
 
        setTheBasket (
          { ...theBasket,
            id:             updateOrder._id,
            // createdAt:      updateOrder.createdAt,
            // Actualizo la Fecha mas actual en que se realizó el pedido antes de grabar
            createdAt:      new Date(Date.now()),
            user:           updateOrder.user,
            userName:       updateOrder.userName, 
            clientId:       updateOrder.client,
            businessName:   updateOrder.businessName,
            estatusPedido:  updateOrder.estatusPedido,
            esMayorista:    updateOrder.esMayorista,
            seAplicaDescuento: updateOrder.seAplicaDescuento,
            businessImageCover: updateOrder.businessImageCover,
            productOrdered: updateOrder.productOrdered,
          }
        );
  
        // setSeAplicaDescuento (updateOrder.seAplicaDescuento);
      }
      catch(err) {
        console.log("err");

        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError(err));
        setOpenSnackbar(true);
      }
    }

    if (usarComponenteComo === "actualizarPedido") {
      fetchOrder();
    }
   
  }, [clientId, fecha, theBasket, usarComponenteComo, isOnline]);

  
  /**************************    theBasket    **********************************/
  // MANEJO DE LA CANASTA (theBasket)
  // addProductToBasket: Método que agrega Productos a la Canasta
  // removeProductFromBasket: Método que quita Productos de la Canasta
  // handleQuantityChange: Método que actualiza la Canasta cuando hay un cambio en
  // la cantidad ordenada de un Producto

  // handlePlaceOrder: Método que graba el pedido en la BD

  // handleAplicaDescuento: Método para actualizar el pedido si es que se
  // aplica el Descuento

  // handleEstatusPedido: Método que controla el Estatus del Pedido: 
  //      1. Por Entregar
  //      2. Entregado

  
  /********************    addProductToBasket    ****************************/

  const addProductToBasket = (id) => {
  
    // Checo si el producto que seleccioné ya esta en theBasket
    // de ser asi ya no lo agrego
    const yaExisteProducto = theBasket?.productOrdered?.some(current => current.product === id);

    if (yaExisteProducto) {
      // console.log("Producto ya existe en theBasket");

      setIconoSnackBarDeExito(false);
      setMensajeSnackBar("El producto ya fue agregado al carrito.")
      setOpenSnackbar(true);
      return;
    }
     

    // Busco el producto que seleccione en el Catalogo 
    const result = productCatalog.filter(current=> current.id === id);
 
    // clientId: clientId, 
    // productId: theBasket[].id
    // sku: theBasket[].sku
    // priceDeVenta:
    // quantity: : theBasket[].quantity
    // costo: productCatalog
    // descuento: ?
    // productName: productCatalog 
    // businessName: businessName
    // userId:
    // userName:

    console.log("result", result);

    // Y lo agrego al Array de productos ordenados (AKA theBasket)

    setTheBasket (       
      { ...theBasket,
        // user: currentUser._id,
        // clientId: clientId,
        // businessName: businessName,
        // userName: currentUser.name,
        // /*
        // // estatusPedido: "porEntregar",
        // // estatusPedido donde 1 es Por Entregar y 2 es Entregado
        // // cambie de String a Number
        // */
        // estatusPedido: 1,

        productOrdered: [...theBasket.productOrdered,
          {
            // id es el productId
            // id: result[0].id,
            product: result[0].id,
            productName: result[0].productName,
            priceDeVenta: esMayorista 
                          ? result[0].priceMayoreo 
                          : result[0].priceMenudeo,
            quantity: "",
            costo: result[0].costo,
            descuento: 0,
            sku: result[0].sku,
            imageCover: result[0].imageCover,
          },
        ],         
      }    
    );
  }
  /****************************************************************************/
    // console.log(theBasket.length);
    // console.log(theBasket[0]?.quantity);
    // console.log(theBasket);


  /********************    removeProductFromBasket    *************************/
  const removeProductFromBasket = (index) => {
    // Hago una copia de theBasket para poder hacer cambios
    const updatedBasket = {...theBasket};

    // Quito el Producto de la Canasta
    updatedBasket.productOrdered.splice(index, 1);

    // luego actualizo con setTheBasket
    setTheBasket(updatedBasket);
  }
  /****************************************************************************/


  /**************************    useEffect    **********************************/
  // Cada vez que haya un cambio en el Pedido: 
  // 1. Se agreguen Productos usando -- addProductToBasket --
  // 2. Se quiten Productos usando -- removeProductFromBasket --
  // 3. Se modifique la cantidad de un Producto usando -- handleQuantityChange --
  // 4. Se aplique o se cancele el Descuento usando -- handleAplicaDescuento --

  // Se Actualizará el Total de la Basket (setTotalBasket) 
  // y el Total del Descuento (setTotalDescuento)
  // es decir se checa cada producto para calcular el total de la basket
  // y el total de Descuento (si es que aplica)

  // Asi es como theBasket estara siempre actualizada en memoria

  useEffect(()=>{
    let sumTotalSinDescuento = 0;
    let sumDescuento = 0;

    if (theBasket?.productOrdered?.length > 0) {
      theBasket?.productOrdered?.forEach(item=> {
        sumTotalSinDescuento += item.quantity === undefined || 
        item.quantity === "" || 
        item.quantity === null 
        ? 0 
        : item.quantity  * item.priceDeVenta;
  
        // if (seAplicaDescuento) {
        if (theBasket.seAplicaDescuento) {
          sumDescuento += item.quantity === undefined || 
          item.quantity === "" || 
          item.quantity === null 
          ? 0 
          : item.descuento = (item.priceDeVenta * item.quantity) * (SE_APLICA_DESCUENTO/100);
        }
        else {
          item.descuento = 0;
        }
        // console.log(sumTotalSinDescuento);
        // setTotalBasket(sumTotalSinDescuento);
      })
      // setTotalBasket(sumTotalSinDescuento - sumDescuento);
      setTotalBasket(sumTotalSinDescuento);
      setTotalDescuento (sumDescuento)
      // console.log("sumDescuento", sumDescuento)
    }
    else
    {
      setTotalBasket(0);
      setTotalDescuento(0);
    }
    
  // }, [theBasket, seAplicaDescuento])
  }, [theBasket])

  
  /************************    handleQuantityChange    **********************/

  const handleQuantityChange = (e, index) => {

    // console.log("e.target.value", e.target.value);

    if (e.target.value < 0) {
      // console.log("es menor que cero")
      return;
    }

    if (!Number.isInteger(e.target.value * 1)) {
      // console.log("no es entero");
      return;
    }

    // // hago una copia del state original theBasket
    // console.log("destr theBasket", {...theBasket} );
    const updatedBasket = {...theBasket};

    // console.log("updatedBasket", updatedBasket)
    // // esto se lee asi updatedBasket.productOrdered[0][quantity] = "1"
    // // Modifico el Quantity en el Array de Productos Ordenados
    updatedBasket.productOrdered[e.target.dataset.index][e.target.dataset.property] = e.target.value;

    // // luego actualizo con setTheBasket
    setTheBasket(updatedBasket);
  }
  /****************************************************************************/


  /***************************    handlePlaceOrder    *************************/

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setOpenModalEstatusPedido (false);

    // console.log("theBasket entrando a handlePlaceOrder", theBasket);

    // console.log("theBasket.estatusPedido", theBasket.estatusPedido);


    // Hago unas validaciones antes de crear el Pedido
    // 1. Debe haber productos en theBasket
    // 2. Todos los productos ordenados deben tener una cantidad mayor a cero
    // 3. El pedido debe tener un estatus antes de grabar
    let continuarConElPedido = true;

    if (theBasket?.productOrdered?.length === 0) {
      continuarConElPedido = false;

      setIconoSnackBarDeExito(false);
      setMensajeSnackBar("Agrega productos para crear el pedido")
      setOpenSnackbar(true);
    }

    for (let item of theBasket?.productOrdered) {
      if (item.quantity === "" || item.quantity === "0") {
        // console.log(`Captura una cantidad para ${item.productName}`)
        continuarConElPedido = false;

        setIconoSnackBarDeExito(false);
        setMensajeSnackBar(`Captura una cantidad para ${item.productName}`)
        setOpenSnackbar(true);
        break;
      }
    }

    if (theBasket.estatusPedido === 0) {
      continuarConElPedido = false;

      setIconoSnackBarDeExito(false);
      setMensajeSnackBar("Selecciona el Estatus del pedido para poder grabarlo")
      setOpenSnackbar(true);
    }


    if (!continuarConElPedido)
      return;

    if (theBasket.estatusPedido === "" || theBasket.estatusPedido === "empty") {

      setIconoSnackBarDeExito(false);
      setMensajeSnackBar('Selecciona un Estatus para el Pedido');
      setOpenSnackbar(true);
      return;
    }

  
    // SI estoy grabando el pedido NO se puede volver a dar click al boton de Grabar
    if (isSaving)
      return;

    
    try {

        setIsSaving(true);

        let mensajeDeExito = "";
        let res;
        let orderId = "";

        if (usarComponenteComo === "nuevoPedido") {
          console.log("nuevoPedido")

          // res = await axios({
          //   withCredentials: true,
          //   method: 'POST',
          //   url: `http://127.0.0.1:8000/api/v1/sales/`,
          //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/sales/`,
          //   data: theBasket
          // })

          res = await axios.post ('/api/v1/sales/', theBasket );

        }
        else if (usarComponenteComo === "actualizarPedido") {
          console.log("actualizarPedido")

          // res = await axios({
          //   withCredentials: true,
          //   method: 'PUT',
          //   url: `http://127.0.0.1:8000/api/v1/sales/${theBasket.id}`,
          //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/sales/${theBasket.id}`,
          //   data: theBasket
          // })

          res = await axios.put (`/api/v1/sales/${theBasket.id}`, theBasket );
        }

        // el res que me regresa Axios en caso de ser un Pedido Nuevo SI tiene el _id del
        // Pedido, esto me ayuda mucho, ya que theBasket NO cuenta con _id en caso de ser Pedido Nuevo
        console.log("El Pedido fue grabado con éxito y este es el resultado",res)

        setIsSaving(false);

        // console.log("res.data.status", res.data.status);
        // console.log("res.data.data.sale", res?.data?.data?.sale);

        if (res.data.status === 'success') {

          console.log ('El pedido fue realizado con éxito!');
          // setIconoSnackBarDeExito(true);

          // estatusPedido donde 
          // 1 es Por Entregar
          // 2 es Entregado
          console.log("el estatus pedido", theBasket.estatusPedido);

          if (theBasket.estatusPedido === 1) {
            // setMensajeSnackBar("El pedido fue grabado. Por Entregar. Espera un momento...");
            mensajeDeExito="El pedido fue grabado. Estatus: Por Entregar.";
          }
          else if (theBasket.estatusPedido === 2) {
            // setMensajeSnackBar("El pedido fue grabado y Entregado. Inventario actualizado. Espera un momento...");
            mensajeDeExito="El pedido fue grabado y Entregado. Inventario actualizado."
          }
          
          // setOpenSnackbar(true);

          // Redirecciono después de 5 segundos a SearchClient osea /search-client
          // setTimeout(()=>{
          //   history.replace("/search-client");
          // }, 5000);


          // history.replace( `/ticket/${clientId}`, {
          //     clientId,
          //     theBasket,
          //     mensajeDeExito 
          // });

          // Por alguna razon es necesario hacer esto para que no marque error
          // al crear un Nuevo Pedido
          if (usarComponenteComo === "nuevoPedido") {
            orderId = res?.data?.data?.sale[0]?._id;
          }
          else if (usarComponenteComo === "actualizarPedido") {
            orderId = res?.data?.data?.sale?._id;
          }

          // Mando el _id del Pedido el cual usare para generar el Ticket de Venta
          history.replace( `/ticket-from-server/${orderId}`, {
              clientId,
              theBasket,
              mensajeDeExito 
          });
    
        } 
    }
    catch(err) {
      console.log(err);
      setIsSaving(false);

      setIconoSnackBarDeExito(false);
      setMensajeSnackBar (regresaMensajeDeError(err));      
      setOpenSnackbar(true);
    }
  }
  /****************************************************************************/


  /**************************    handleAplicaDescuento    **********************/  
  const handleAplicaDescuento = (event) =>  {

    setTheBasket (       
      { ...theBasket,
        productOrdered: [...theBasket.productOrdered ],
        seAplicaDescuento: event.target.checked
      }    
    );
  }
  /****************************************************************************/


// Este código Funciona para REACT-SELECT
// Que viene siendo un component llamado <Select />
// Que es diferente a 
// <select> que es un element de HTML
// function handleEstatusPedido({value}) {  
      // setEstatusPedido(value);
// }

  /**************************    handleEstatusPedido    ***********************/  

  function handleEstatusPedido(event) {
    // setEstatusPedido(event.target.value);

    // Actualizo el estatusPedido en theBasket
    setTheBasket (       
      { ...theBasket,
        productOrdered: [...theBasket.productOrdered ],
        estatusPedido: parseInt(event.target.value, 10)
      }    
    );
  }
  /****************************************************************************/


  /**************************    useEffect    **********************************/
  // Carga el Catálogo de Productos al cargar la Página
  useEffect (() => {
    
    if (!isOnline) {
      return;
    }

    if (avoidRerenderFetchProducts.current) {
      return;
    }

    if (isLoading)
      return;

    const fetchPosts = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchProducts.current = true;

      try {

        setIsLoading(true);
  
        // console.log("Voy a cargar la lista de productos")
        // 2da OPCION PARA USAR AXIOS
        // NO LA USO
        // const res = await axios.get('http://127.0.0.1:8000/api/v1/products')
  
        // 1era. OPCION PARA USAR AXIOS
        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   url: 'http://127.0.0.1:8000/api/v1/products'
        //   // url: 'https://eljuanjo-dulces.herokuapp.com/api/v1/products'
        // });

        const res = await axios.get (`/api/v1/products`);

  
        setIsLoading(false);  
  
        // console.log(res)
        // console.log(res.data.data.data);
        setProductCatalog(res.data.data.data)
      }
      catch (err) {
        console.log("error", err);
        setIsLoading(false);

        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError(err));      
        setOpenSnackbar(true);
      }
    }
    fetchPosts();
  }, [isLoading, isOnline]);
  /****************************************************************************/


  /************************     handleDeleteOrder    ************************/
  // Este es el método que se encarga de Borrar un Pedido
  /**************************************************************************/  
  const handleDeleteOrder = async (e) => {

    e.preventDefault();
    console.log(theBasket);

    setOpenModal(false);

    if (!theBasket.id || theBasket.id === "")
    {
      console.log("No existe un Pedido a borrar en la Base de Datos");
      return;
    }
  
    // SI estoy borrando el pedido NO se puede volver a dar click al boton de Borrar
    if (isDeleting)
      return;

    try {

        setIsDeleting(true);

        // const res = await axios({
        //   withCredentials: true,
        //   method: 'DELETE',
        //   url: `http://127.0.0.1:8000/api/v1/sales/${theBasket.id}`,
        //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/sales/${theBasket.id}`,
        // })

        const res = await axios.delete (`/api/v1/sales/${theBasket.id}`);


        console.log(res)

        setIsDeleting(false);

        if (res.status === 204) {

          console.log ('El pedido fue borrado con éxito!');

          // Inicializo theBasket
          setTheBasket(
              {
                id:             "",
                createdAt:      new Date(Date.now()),
                user:           currentUser._id,
                userName:       currentUser.name, 
                clientId:       clientId,
                businessName:   businessName,
                // estatusPedido donde 1 es Por Entregar y 2 es Entregado
                estatusPedido:  1, 
                esMayorista:    esMayorista,
                seAplicaDescuento: false,
                productOrdered: []
              }
          );

          setIconoSnackBarDeExito(true);
          setMensajeSnackBar("El pedido fue borrado. Espera un momento...");          
          setOpenSnackbar(true);

          // Redirecciono después de 5 segundos a SearchClient osea /search-client
          // setTimeout(()=>{
          //   history.replace(
          //     {
          //       pathname:"/search-client", 
          //       state: {
          //         openVentana: "CrearPedido"
          //       }
          //     }
          //   );
          // }, 5000);  
          
          history.replace( "/order-was-deleted");
        } 
    }
    catch(err) {
      console.log(err);
      setIsDeleting(false);

      // setMensajeSnackBar("Hubo un error al borrar el pedido. Intente más tarde.")
      setIconoSnackBarDeExito(false);
      setMensajeSnackBar (regresaMensajeDeError(err));      
      setOpenSnackbar(true);
    }
  }

  
  /************************     openDeleteDialog    *************************/
  // Se encarga de abrir una ventana para preguntar si desea Borrar el Pedido o Cancelar
  /**************************************************************************/  
  const openDeleteDialog = () => {
       
    setOpenModal(true);

  };

  /************************     openUpdateEstatusPedido    ******************/
  // Se encarga de abrir una ventana para preguntar si desea cambiar el Estatus del Pedido Antes
  // de Grabar
  /**************************************************************************/  
  const openUpdateEstatusPedido = () => {
    setOpenModalEstatusPedido(true); 
  }

  /***********************     calculaProductosOrdenados    ******************/
  // Se encarga de calcular cuantos Productos han sido Ordenados por el Cliente
  /**************************************************************************/  
  const calculaProductosOrdenados = () => {

    let productosOrdenados = 0;

    theBasket?.productOrdered?.forEach(product => {

      if (product.quantity !== "")
        productosOrdenados += parseInt(product.quantity, 10);
    })

    return productosOrdenados;
  }

  /************************     handleSearchTyping    *****************************/
  // Se encarga de guardar en setSearchBarQuery, la informacion de cada input
  /**************************************************************************/
  function handleSearchTyping(event) {
    // console.log(event)

    if (event.target.value.toString().toLowerCase() !== "")
      setShowFaTimes(true)
    else
      setShowFaTimes(false)

    setSearchBarQuery(event.target.value.toString().toLowerCase());
  }


  /************************     handleClearSearch    *****************************/
  // Se encarga de borrar el contenido de la busqueda de Prodductos y por consecuencia
  // el icono de FaTime cambia a FaSearch
  /**************************************************************************/
  function handleClearSearch () {
    setSearchBarQuery("");
    setShowFaTimes(false);
  }

  return (
    <>
      {
        isOnline && (
          <LazyMotion features={domAnimation} >

            <m.div className="updateOrder"
              variants={containerVariants}
              initial="hidden"
              animate="visible"      
            >
      
              <BasicDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                message= {`¿Estas seguro que deseas borrar el Pedido?`}
                onSubmit={handleDeleteOrder}
                captionAceptar={"Borrar"}
                captionCancelar={"Cancelar"}
              />
    
              <BasicDialog
                open={openModalEstatusPedido}
                onClose={() => setOpenModalEstatusPedido(false)}
                message= {`El Pedido aun tiene estatus: Por Entregar, si deseas cerrar el pedido selecciona Cancelar, cambia el estatus a Entregado y vuelve a Grabar. Si deseas que el Pedido siga abierto selecciona Aceptar para grabar.`}
                onSubmit={handlePlaceOrder}
                captionAceptar={"Aceptar"}
                captionCancelar={"Cancelar"}
              />

              <SnackBarCustom 
                  openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} mensajeSnackBar={mensajeSnackBar} 
                  iconoSnackBarDeExito={iconoSnackBarDeExito} />    
      
              <div className="businessInfo">
                <p className="businessInfo__businessName">{client.businessName}</p>
                <p className="businessInfo__clientDetails">
                      {client.ownerName}
                    </p>
                    <p className="businessInfo__clientDetails">
                      {client.businessAddress}
                    </p>
                    <p className="businessInfo__clientDetails">
                      Celular: {client.cellPhone}
                    </p>
                    <p className="businessInfo__clientDetails">
                      Teléfono Fijo: {client.fixedPhone}
                    </p>
                    <p className="businessInfo__clientDetails">
                      Email: {client.email}
                    </p>
                    <p className="businessInfo__clientDetails">
                      {client.esMayorista ? "Mayorista" : "Minorista"}
                    </p>
              </div>
      
              <div className="salesHeader">
                <div className="searchBar">
                  <table className="searchBar__table">
                    <tbody>
                      <tr>
                        <td>
                          <input 
                            disabled={isSaving || isDeleting}
                            type="text" 
                            placeholder='Buscar Producto...'
                            className="searchInput" 
                            onChange={handleSearchTyping}
                            value={searchBarQuery}
                          />
                        </td>
                        <td>
                          <button className="searchBar__button">
                          {
                            showFaTimes 
                            ? <FaTimes className="productSearch" 
                                       onClick={handleClearSearch} />
                            : <FaSearch className="productSearch" />
                          }
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
      
              </div>
      
              <div className="makeOrder">
                <div className="topPanel">
                  {
                    isLoading
                    ?
                      <SkeletonElement type="rectangular" 
                                       width="auto" height="auto" />
                    :
                      <>
                        <p className="productListTitle">Catálogo de Productos</p>
                        <div className="makeOrder__container">
                          <div className="carousel">
                            {  
                              productCatalog
                                .filter(product => product.sku.toString().includes(searchBarQuery) ||
                                                  product.productName.toLowerCase().includes(searchBarQuery))
                                .map((product, index) => 
                                  ( <ProductInput key={index}
                                            index={index} 
                                            product={product} 
                                            addProductToBasket={addProductToBasket}
                                            esMayorista={esMayorista}
                                            isSaving={isSaving}
                                            isDeleting={isDeleting}
                                    />
                                  )
                                )
                            }
                          </div>
                        </div>                       
                      </>
                  } 
                </div>
      
                <div className="bottomPanel">
      
                  <div className="newOrder__container">
                    <div className="newOrder--ordersTitle">
                      <p className="orderedProductsTitle">Productos Ordenados</p>
                      <div className="newOrderIconContainer">
                        <FaShoppingCart className="newOrderIcon" />
                        {
                          theBasket?.productOrdered?.length > 0 && 
                              <span className="newOrderIconBadge">
                                {
                                  calculaProductosOrdenados()
                                }
                              </span>
                        }
                      </div>
                    </div>
                  </div>
      
                  <div className="productOrder">
                    {
                      theBasket?.productOrdered?.map((product, index)=> {
                          return ( 
                            <ProductOrdered 
                              key={index}
                              index={index} 
                              theBasket={theBasket} 
                              product={product}
                              handleQuantityChange={handleQuantityChange} 
                              removeProductFromBasket={removeProductFromBasket} 
                              isSaving={isSaving}
                              isDeleting={isDeleting}
                              // seAplicaDescuento={seAplicaDescuento}
                            />
                          )
                        }
                      )
                    }
      
                    <div className="descuento">
                      <input 
                          disabled={isSaving || isDeleting}
                          className="descuento__checkbox"
                          type="checkbox" 
                          id="aplicarDescuento" 
                          name="aplicarDescuento"
                          checked={theBasket.seAplicaDescuento}
                          value={theBasket.seAplicaDescuento}
                          onChange={handleAplicaDescuento}
                      />
                      <label className="descuento__label" htmlFor="aplicarDescuento">
                        ¿Aplicar {SE_APLICA_DESCUENTO}% de Descuento?
                      </label>
                    </div>
      
                    <div className="totalPedido">
          
                      {/* Total Venta */}
                      <div className="totalPedido__container">
                        <span className="totalPedido__item">
                          Total Venta: 
                        </span>
                        
                        <span className="totalPedido__currency">
                          {
                            formateaCurrency(totalBasket)
                          }
                        </span>
                      </div>
      
                      {/* Total Descuento */}
                      <div className="totalPedido__container">
                        <span className="totalPedido__item">
                          Total Descuento (-): 
                        </span>
                        
                        <span className="totalPedido__currency">
                          {
                            formateaCurrency(totalDescuento)
                          }
                        </span>
                      </div>
      
                      {/* Total Pedido = Total Venta - Total Descuento */}
                      <div className="totalPedido__container">
                        <span className="totalPedido__item pedidoTotal">
                          Total Pedido: 
                        </span>
                        
                        <span className="totalPedido__currency pedidoTotal">
                          {
                            formateaCurrency(totalBasket - totalDescuento)
                          }
                        </span>         
                      </div>
                    </div>
                  </div>
                  
                </div>
      
                {/* REACT-SELECT
                <div className="container-estatusPedido">
                  <label htmlFor="estatusPedido">Estatus</label>
                  <Select
                    className="container-estatusPedido__select"
                    options={options}
                    defaultValue={ options[0] } 
                    onChange={handleEstatusPedido}
                    isSearchable={false}
                  />
                </div> */}    
                <div className="salesFooter">
                    <div className="estatusPedidoPlaceOrder">
                      {
                        usarComponenteComo === "actualizarPedido" && 
                              <button className="deleteOrderButton"
                                      disabled={isSaving || isDeleting}
                                      // onClick={handleDeleteOrder}
                                      onClick={openDeleteDialog}
                              >{isDeleting ? 'Borrando...' : 'Borrar'}
                              </button> 
                      }
          
                      <div className="container-estatusPedido">
                        <label htmlFor="estatusPedido">
                          Estatus Pedido
                        </label>
                        <select 
                            disabled={isSaving || isDeleting}
                            className="container-estatusPedido__select"
                            id="estatusPedido" 
                            // value={estatusPedido}
                            value={theBasket.estatusPedido}
                            onChange={handleEstatusPedido}
                            name="estatusPedido"
                        >
                            {/* <option value="porEntregar">Por entregar</option>
                            <option value="entregado">Entregado</option> */}
                            {/* 1 es Por Entregar y 2 es Entregado */}
                            <option value="0">Selecciona el Estatus</option>
                            <option value="1">Por entregar</option>
                            <option value="2">Entregado</option>
                        </select>          
                      </div>
          
                      <button className="placeOrderButton"
                              disabled={isSaving || isDeleting}
                              // onClick={handlePlaceOrder}
                              onClick={
                                  usarComponenteComo === "actualizarPedido" && theBasket.estatusPedido === 1 
                                  ? openUpdateEstatusPedido 
                                  : usarComponenteComo === "actualizarPedido" && theBasket.estatusPedido === 2 
                                  ? handlePlaceOrder 
                                  : usarComponenteComo === "nuevoPedido" 
                                  ? handlePlaceOrder 
                                  : handlePlaceOrder
                                  // usarComponenteComo === "nuevoPedido" ? handlePlaceOrder : openUpdateEstatusPedido
                                
                              }
                      >
                        {usarComponenteComo === "nuevoPedido" &&
                          (isSaving ? 'Creando...' : 'Crear')
                        }
                        {usarComponenteComo === "actualizarPedido" &&
                          (isSaving ? 'Grabando...' : 'Grabar')
                        }
                      </button>
                      
                    </div>      
                  
                  </div>                     
              </div> 
     
            </m.div>
          </LazyMotion>
        )
      }
      {
        !isOnline && <OfflineFallback />
      }
    </>
  )
}
