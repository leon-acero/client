import "./product.css";
// import axios from "axios";
import axios, { BASE_URL } from '../../../../utils/axios';

/**************************    React    **********************************/
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from "react-router-dom";
/****************************************************************************/

/************************    React Icons    *********************************/
import {FaDollyFlatbed, FaDollarSign, FaCloudUploadAlt, FaChrome } from "react-icons/fa";
/****************************************************************************/

/**************************    Snackbar    **********************************/
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import {FaTimes} from "react-icons/fa";
import { Alert } from '@mui/material';
/****************************************************************************/



export default function Product() {

  /**************************    useRef    **********************************/
  // avoidRerenderFetchProduct evita que se mande llamar dos veces al
  // producto y por lo mismo que se pinte dos veces
  
  const avoidRerenderFetchProduct = useRef(false);
  /**************************************************************************/

  /**************************    useState    **********************************/
  // fileBlob es la imagen del Producto que muestro en pantalla cuando recien
  // escojo una foto y antes de que actualice en la base de datos. Esto es con
  // el fin de que el usuario vea la imagen que escogió

  // mensajeSnackBar es el mensaje que se mostrara en el SnackBar, puede ser 
  // de exito o de error segun si se grabó la informacion en la BD

  // updateSuccess es boolean que indica si tuvo exito o no el grabado en la BD
  
  // productData es un Object con toda la informacion a grabar en la BD

  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // isSaving es un boolean para saber si esta grabando la informacion en la BD
  // lo uso para deshabilitar el boton de Grabar y que el usuario no le de click
  // mientras se esta guardando en la BD

  const [fileBlob, setFileBlob] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState (true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  
  // imageCover sirve un DOBLE proposito, como String y como Archivo
  // es decir al cargar el Component o Pagina es un String: "camera.webp"
  // el cual muestra una imagen default antes de que se cargue la foto SI es que
  // existe una foto en el File System para el Producto

  // El segundo propósito es como File, es decir, el usuario al seleccionar
  // una imagen, ahora imageCover contiene toda la informacion de la imagen
  // no solo el nombre de la imagen, ahora cuando se actualice la informacion
  // imageCover sera usado para separar el nombre de la imagen que se guardara
  // en MongoDB, y el archivo fisico que se guardara en el Web Server (File System)
  const [productData, setProductData] = useState(
    {
      _id: 0,
      productName: "",
      inventarioActual: 0,
      inventarioMinimo: 0,
      priceMenudeo: 0,
      priceMayoreo: 0,
      costo: 0,
      sku: 0,
      imageCover: "camera.webp"
    }
  )
  /*****************************************************************************/


  /**************************    useParams    **********************************/
  // productId es la clave de producto que viene en el URL, me sirve para
  // saber que producto se actualizara en la BD

  const {productId } = useParams();
  /****************************************************************************/


  /************************     handleSubmit    *******************************/
  // Aqui guardo la informacion en la BD, puede ser exitoso o haber error
  /****************************************************************************/

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(productData.priceMayoreo)

    if (isSaving)
      return;

    try {
        setIsSaving(true);

        const formData = new FormData();
        
        formData.append("_id", productData._id);
        formData.append("sku", productData.sku);
        formData.append("productName", productData.productName);
        formData.append("inventarioActual", productData.inventarioActual);
        formData.append("inventarioMinimo", productData.inventarioMinimo);
        formData.append("priceMenudeo", productData.priceMenudeo);
        formData.append("priceMayoreo", productData.priceMayoreo === null || productData.priceMayoreo === "" || productData.priceMayoreo === undefined ? 0 : productData.priceMayoreo);
        formData.append("costo", productData.costo);
        // formData.append("photo", fileBlob);
        // console.log("productData.imageCover", productData.imageCover);

        // Aqui como mencione al inicio imageCover tiene toda la informacion
        // de la foto, y para actualizar la foto, en el productController
        // primero subo la foto en memoria en el Web Server, luego le cambio
        // el formato a webp y le hago un resize, y ajusta la calidad de la foto
        // y ahora si la guardo en el Web Server, por ultimo le asigno un nombre
        // a la imageCOver y la guardo en la BD
        // es por esto que aqui guardo la imageCover en "photo" porque NO es
        // el field final, se tiene que hacer todo el proceso anterior
        formData.append("photo", productData.imageCover);

        // const res = await axios({
        //   withCredentials: true,
        //   method: 'PATCH',
        //   url: `http://127.0.0.1:8000/api/v1/products/${productId}`,
        //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/products/${productId}`,
        //   data: formData
        // })

        const res = await axios.patch (`/api/v1/products/${productId}`, formData );

        setIsSaving(false);
        // console.log("res", res);

        if (res.data.status === 'success') {
          // console.log(res.data.data.data);
          console.log ('El producto fue actualizado con éxito!');
          setUpdateSuccess(true);
          setMensajeSnackBar("Producto actualizado")
          setOpenSnackbar(true);
        } 
    }
    catch(err) {
      setIsSaving(false);
      setUpdateSuccess(false);
      // setMensajeSnackBar("Hubo un error al grabar el producto. Revisa que estes en línea.");

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
      
      // Error de MongoDB dato duplicado
      /*if (err.response?.data?.error?.code === 11000 || 
          err.response.data.message.includes('E11000')) {
            mensajeSnackBar = 'El Sku ya existe, elije otro Sku.';
      
            setMensajeSnackBar(mensajeSnackBar);
      }
      else */
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
      console.log(err);
    }
  }

  /************************     useEffect    *******************************/
  // fetchProduct mando cargar desde la BD el Producto que me interesa
  // actualizar
  /**************************************************************************/

  useEffect (() => {

    if (avoidRerenderFetchProduct.current) {
      return;
    }

    const fetchProduct = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchProduct.current = true;

      // console.log("carga de producto")

      // const res = await axios ({
      //   withCredentials: true,
      //   method: 'GET',
      //   url: `http://127.0.0.1:8000/api/v1/products/${productId}`
      //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/products/${productId}`
      // });

      const res = await axios.get (`/api/v1/products/${productId}`);

      // console.log(res.data.data.data);
      setProductData(res.data.data.data);

    }

    fetchProduct();
   
  }, [productId]);


  /************************     handleImageCoverChange    ********************/
  // Se encarga de manejar la actualizacion de la foto del Producto y 
  // que se muestre en pantalla
  /**************************************************************************/
  function handleImageCoverChange (e) {

    setFileBlob(URL.createObjectURL(e.target.files[0]));

    // console.log("fileImageCover", URL.createObjectURL(e.target.files[0]))
    // Actualizo el imageCover
    setProductData(prevFormData => {
        return {
            ...prevFormData,
            imageCover: e.target.files[0]
        }
    })
  }


  /************************     handleChange    *****************************/
  // Se encarga de guardar en setProductData, la informacion de cada input, excepto
  // del imageCover
  /**************************************************************************/

  function handleChange(event) {
    // console.log(event)
    const {name, value, type, checked} = event.target
    setProductData(prevFormData => {
        return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }
    })
  }

  /************************     handleNumbers    ****************************/
  // Se encarga de solo aceptar números en la captura de datos
  /**************************************************************************/
  function handleNumbers (e) {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }

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

 
  return (
    <div className="product">
      
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

      <div className="productTitleContainer">
        <h1 className="productTitle">Editar Producto</h1>
        <Link to="/new-product">
          <button className="productAddButton">Crear</button>
        </Link>
      </div>
      <div className="productContainer">
        <div className="productShow">
          <div className="productShowTop">
            <img
              className="productShowImg"
              src= {
                      // fileBlob ? fileBlob : `http://127.0.0.1:8000/img/products/${productData.imageCover}`
                      fileBlob ? fileBlob : `${BASE_URL}/img/products/${productData.imageCover}`
                    }
              alt=""
            />            

            <div className="productShowTopTitle">
              <span className="productShowProductname">{productData.productName}</span>
              <span className="productShowProductTitle">SKU: {productData.sku}</span>
            </div>
          </div>
          <div className="productShowBottom">
            <span className="productShowTitle">Detalle</span>
            <div className="productShowInfo">
              <FaDollyFlatbed className="productShowIcon" />
              <span className="productShowInfoTitle">Inventario Actual: {productData.inventarioActual}</span>
            </div>
            <div className="productShowInfo">
              <FaDollyFlatbed className="productShowIcon" />
              <span className="productShowInfoTitle">Inventario Mínimo: {productData.inventarioMinimo}</span>
            </div>
            <div className="productShowInfo">
              <FaDollarSign className="productShowIcon" />
              <span className="productShowInfoTitle">Precio Menudeo: ${productData.priceMenudeo}</span>
            </div>           
            <div className="productShowInfo">
              <FaDollarSign className="productShowIcon" />
              <span className="productShowInfoTitle">Precio Mayoreo: ${productData.priceMayoreo}</span>
            </div> 
            <div className="productShowInfo">
              <FaDollarSign className="productShowIcon" />
              <span className="productShowInfoTitle">Costo: ${productData.costo}</span>
            </div>             
            <div className="productShowInfo">
              <FaChrome className="productShowIcon" />
              <span className="productShowInfoTitle">{productData.slug}</span>
            </div>              
          </div>
        </div>
        <div className="productUpdate">
          <span className="productUpdateTitle">Editar</span>

          <form className="productUpdateForm" onSubmit={handleSubmit}>
            <div className="productUpdateLeft">
              <div className="productUpdateItem">
                <label>SKU *</label>
                <input
                  type="text"
                  placeholder={productData.sku}
                  className="productUpdateInput"                  
                  onChange={handleChange}
                  name="sku"
                  value={productData.sku || ''}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El SKU debe tener por lo menos 1 caracter')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  minLength="1"
                  maxLength="5"
                  autocomplete="off"
                />
              </div>              
              <div className="productUpdateItem">
                <label>Producto *</label>
                <input
                  type="text"
                  placeholder={productData.productName}
                  className="productUpdateInput"                  
                  onChange={handleChange}
                  name="productName"
                  value={productData.productName || ''}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El Nombre del Producto debe tener entre 5 y 40 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  minLength="5"
                  maxLength="40"
                  autocomplete="off"
                />
              </div>
              <div className="productUpdateItem">
                <label>Inventario Actual *</label>
                <input
                  type="number" 
                  pattern="/[^0-9]|(?<=\..*)\./g" 
                  step="1" 
                  min="1"
                  max="999999"
                  placeholder={productData.inventarioActual}
                  className="productUpdateInput"
                  onChange={handleChange}
                  onKeyPress={(e)=>handleNumbers(e)}
                  name="inventarioActual"
                  value={productData.inventarioActual || ''}
                  required
                  onInvalid={e=> e.target.setCustomValidity('Escribe el Inventario Actual')} 
                  onInput={e=> e.target.setCustomValidity('')}
                  autocomplete="off" 
                />
              </div>
              <div className="productUpdateItem">
                <label>Inventario Minimo *</label>
                <input
                  type="number" 
                  pattern="/[^0-9]|(?<=\..*)\./g" 
                  step="1" 
                  min="1"
                  max="999999"
                  placeholder={productData.inventarioMinimo}
                  className="productUpdateInput"
                  onChange={handleChange}
                  onKeyPress={(e)=>handleNumbers(e)}
                  name="inventarioMinimo"
                  value={productData.inventarioMinimo || ''}  
                  required         
                  onInvalid={e=> e.target.setCustomValidity('Escribe el Inventario Mínimo')} 
                  onInput={e=> e.target.setCustomValidity('')}
                  autocomplete="off"                 
                />
              </div>
              <div className="productUpdateItem">
                <label>Precio Menudeo *</label>
                <input
                  type="number" 
                  pattern="/[^0-9.]|(?<=\..*)\./g" 
                  step="0.01" 
                  min="1"
                  max="999999"
                  placeholder={productData.priceMenudeo}
                  className="productUpdateInput"
                  onChange={handleChange}
                  onKeyPress={(e)=>handleNumbers(e)}
                  name="priceMenudeo"
                  value={productData.priceMenudeo || ''}
                  required 
                  onInvalid={e=> e.target.setCustomValidity('Escribe el Precio al Menudeo')} 
                  onInput={e=> e.target.setCustomValidity('')}
                  autocomplete="off"                
                />
              </div>
              <div className="productUpdateItem">
                <label>Precio Mayoreo</label>
                <input
                  type="number" 
                  pattern="/[^0-9.]|(?<=\..*)\./g" 
                  step="0.01" 
                  min="1"
                  max="999999"
                  placeholder={productData.priceMayoreo}
                  className="productUpdateInput"
                  onChange={handleChange}
                  onKeyPress={(e)=>handleNumbers(e)}
                  name="priceMayoreo"
                  value={productData.priceMayoreo || ''}
                  autocomplete="off"                  
                />
              </div>              
              <div className="productUpdateItem">
                <label>Costo *</label>
                <input
                  type="number" 
                  pattern="/[^0-9.]|(?<=\..*)\./g" 
                  step="0.01" 
                  min="1"
                  max="999999"
                  placeholder={productData.costo}
                  className="productUpdateInput"
                  onChange={handleChange}
                  onKeyPress={(e)=>handleNumbers(e)}
                  name="costo"
                  value={productData.costo || ''}
                  required 
                  onInvalid={e=> e.target.setCustomValidity('Escribe el Costo del Producto')} 
                  onInput={e=> e.target.setCustomValidity('')}
                  autocomplete="off"                 
                />
              </div>
            </div>

            <div className="productUpdateRight">
              <div className="productUpdateUpload">
                <img
                  className="productUpdateImg"
                  src= {
                          // fileBlob ? fileBlob : `http://127.0.0.1:8000/img/products/${productData.imageCover}`
                          fileBlob ? fileBlob : `${BASE_URL}/img/products/${productData.imageCover}`
                       }
                  alt=""
                />                
                <label htmlFor="photo">
                  <FaCloudUploadAlt style={{"fontSize": "3rem", "cursor": "pointer", "color": "#343a40"}} />
                </label>
                <input  type="file" 
                        accept="image/*" 
                        id="photo" 
                        name="photo" 
                        style={{ display: "none" }} 
                        onChange={(e)=>handleImageCoverChange(e)}
                />
              </div>
              <button className="productUpdateButton" disabled={isSaving}>{isSaving ? 'Actualizando...' : 'Actualizar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
