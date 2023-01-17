import "./product.css";
import defaultCameraImage from "../../../../camera.webp"

import axios, { regresaMensajeDeError } from '../../../../utils/axios';
import {clsx} from "clsx";

/*************************    Offline/Online     ****************************/
import { useNavigatorOnLine } from '../../../../hooks/useNavigatorOnLine';
import OfflineFallback from '../../../../components/offlineFallback/OfflineFallback';
/****************************************************************************/

/**************************    React    **********************************/
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from "react-router-dom";
/****************************************************************************/

/************************    React Icons    *********************************/
import {FaDollyFlatbed, FaDollarSign, FaCloudUploadAlt, FaChrome } from "react-icons/fa";
/****************************************************************************/

/**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import {FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
/****************************************************************************/

/**************************    Components    ********************************/
import ItemShowInfo from '../../../../components/itemShowInfo/ItemShowInfo';
import SnackBarCustom from '../../../../components/snackBarCustom/SnackBarCustom';
import { formateaCurrency, formateaThousand } from '../../../../utils/formatea';
/****************************************************************************/

import { Skeleton } from '@mui/material';


export default function Product() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/

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

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no el grabado en la BD
  
  // productData es un Object con toda la informacion a grabar en la BD

  // openSnackbar es boolean que manda abrir y cerrar el Snackbar

  // isSaving es un boolean para saber si esta grabando la informacion en la BD
  // lo uso para deshabilitar el boton de Grabar y que el usuario no le de click
  // mientras se esta guardando en la BD

  const [fileBlob, setFileBlob] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);

  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
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
      imageCover: ""
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

        // console.log("fileBlob", fileBlob)
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
          setIconoSnackBarDeExito(true);
          setMensajeSnackBar("Producto actualizado")
          setOpenSnackbar(true);
        } 
    }
    catch(err) {
      console.log("err", err);
      setIsSaving(false);

      setIconoSnackBarDeExito(false);
      setMensajeSnackBar (regresaMensajeDeError(err));
      setOpenSnackbar(true);
    }
  }

  /************************     useEffect    *******************************/
  // fetchProduct mando cargar desde la BD el Producto que me interesa
  // actualizar
  /**************************************************************************/

  useEffect (() => {

    if (!isOnline) {
      return;
    }

    if (avoidRerenderFetchProduct.current) {
      return;
    }

    const fetchProduct = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchProduct.current = true;

      try {
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
      catch (err) {
        console.log(err);    

        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError(err));
        setOpenSnackbar(true);
      }

    }

    fetchProduct();
   
  }, [productId, isOnline]);


  /************************     handleImageCoverChange    ********************/
  // Se encarga de manejar la actualizacion de la foto del Producto y 
  // que se muestre en pantalla
  /**************************************************************************/
  function handleImageCoverChange (e) {

    if (!e.target.files[0])
      return;

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

  // console.log("productData.inventarioActual", productData.inventarioActual)
  // console.log("productData.inventarioMinimo", productData.inventarioMinimo)
  // console.log(parseInt(productData.inventarioActual,10) < parseInt(productData.inventarioMinimo, 10))
 
  return (

    <>
      {
        isOnline && (
          <div className="product">
      
            <SnackBarCustom 
                openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} mensajeSnackBar={mensajeSnackBar} 
                iconoSnackBarDeExito={iconoSnackBarDeExito} />
      
            <div className="productTitleContainer">
              <h1 className="productTitle">Editar Producto</h1>
              <Link to="/new-product">
                <button className="productAddButton">Crear</button>
              </Link>
            </div>

            <div className="productContainer">
              <div className="productShow">
                {
                  productData.productName !== "" 
                  ?
                    <>
                      <div className="productShowTop">
                        <img
                          className="productShowImg"
                          src= {
                                  fileBlob ? fileBlob : productData.imageCover ?
                                  `${productData.imageCover}` : defaultCameraImage
                                }
                          alt={productData.productName}
                        />            
            
                        <div className="productShowTopTitle">
                          <span className="productShowProductname">{productData.productName}</span>
                          <span className="productShowProductTitle">SKU: {productData.sku}</span>
                        </div>
                      </div>
                      
                      <div className="productShowBottom">
                        <span className="productShowTitle">Detalle</span>
                        <ItemShowInfo CustomIcon={FaDollyFlatbed} 
                            labelData= {"Inventario Actual:"} 
                            itemData={formateaThousand(productData.inventarioActual)} 
                            alinearSpaceBetween={true} />

                        <ItemShowInfo CustomIcon={FaDollyFlatbed} 
                            labelData= {"Inventario Mínimo:"} 
                            itemData={formateaThousand(productData.inventarioMinimo)} 
                            alinearSpaceBetween={true} />
      
                        <ItemShowInfo CustomIcon={FaDollarSign} 
                            labelData= {"Precio Menudeo:"} 
                            itemData={formateaCurrency(productData.priceMenudeo)} 
                            alinearSpaceBetween={true} />

                        <ItemShowInfo CustomIcon={FaDollarSign} 
                            labelData= {"Precio Mayoreo:"} 
                            itemData={formateaCurrency(productData.priceMayoreo)} 
                            alinearSpaceBetween={true} />
      
                        <ItemShowInfo CustomIcon={FaDollarSign} 
                            labelData= {"Costo:"} 
                            itemData={formateaCurrency(productData.costo)} 
                            alinearSpaceBetween={true} />
        
                        <ItemShowInfo CustomIcon={FaChrome} 
                            labelData={""} itemData={productData.slug} 
                            alinearSpaceBetween={false} />

                      </div>
                    </>
                  :
                    <>
                      <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="circular" width="4rem" height="4rem" 
                      />  
                      <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="rounded" width="25rem" height="2rem" 
                      />     
                      <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="rounded" width="25rem" height="2rem" 
                      />  
                      <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="rounded" width="21rem" height="2rem" 
                      />  
                      <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="rounded" width="17rem" height="2rem" 
                      />                 
                    </>
                }

              </div>
              <div className="productUpdate">
                <span className="productUpdateTitle">Editar</span>
      
                <form className="productUpdateForm" onSubmit={handleSubmit}>
                  <div className="productUpdateLeft">

                  {
                      productData.sku !== 0 
                      ? 
                        <>
                          <div className="productUpdateItem">
                            <label>SKU *</label>
                            <input
                              // type="text"
                              placeholder={productData.sku}
                              className="productUpdateInput"                  
                              onChange={handleChange}
                              name="sku"
                              value={productData.sku || ''}
                              required
                              onInvalid={e=> e.target.setCustomValidity('El SKU debe tener por lo menos 1 caracter. El valor mínimo es 1 y el máximo es 999,999')} 
                              onInput={e=> e.target.setCustomValidity('')} 
                              // minLength="1"
                              // maxLength="5"
                              autoComplete="off"

                              type="number" 
                              pattern="/[^0-9]|(?<=\..*)\./g" 
                              step="1" 
                              min="1"
                              max="999999"
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
                              autoComplete="off"
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
                              className={clsx (
                                { 
                                  inventarioActualNegativo: parseInt(productData.inventarioActual, 10) < parseInt(productData.inventarioMinimo, 10), 
                                  productUpdateInput: true,
                                })}
                              onChange={handleChange}
                              onKeyPress={(e)=>handleNumbers(e)}
                              name="inventarioActual"
                              value={productData.inventarioActual || ''}
                              required
                              onInvalid={e=> e.target.setCustomValidity('Escribe el Inventario Actual. El valor más alto que puedes capturar es 999,999')} 
                              onInput={e=> e.target.setCustomValidity('')}
                              autoComplete="off" 
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
                              onInvalid={e=> e.target.setCustomValidity('Escribe el Inventario Mínimo. El valor más alto que puedes capturar es 999,999')} 
                              onInput={e=> e.target.setCustomValidity('')}
                              autoComplete="off"                 
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
                              onInvalid={e=> e.target.setCustomValidity('Escribe el Precio al Menudeo. El valor máximo es $999,999')} 
                              onInput={e=> e.target.setCustomValidity('')}
                              autoComplete="off"                
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
                              autoComplete="off"                  
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
                              onInvalid={e=> e.target.setCustomValidity('Escribe el Costo del Producto. El valor máximo es $999,999')} 
                              onInput={e=> e.target.setCustomValidity('')}
                              autoComplete="off"                 
                            />
                          </div>
                        </>
                      :
                        <>
                          <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="rounded" width="25rem" height="2rem" 
                          />   

                          <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="rounded" width="25rem" height="2rem" 
                          />    

                          <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="rounded" width="21rem" height="2rem" 
                          />       
                          
                          <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="rounded" width="17rem" height="2rem" 
                          />
                
                      </>
                  }


                  </div>
      
                  <div className="productUpdateRight">

                    {
                      productData.productName !== ""
                      ?
                        <>   
                          <div className="productUpdateUpload">
                            <img
                              className="productUpdateImg"
                              src= {
                                      // fileBlob ? fileBlob : `http://127.0.0.1:8000/img/products/${productData.imageCover}`
                                      // fileBlob ? fileBlob : `${BASE_URL}/img/products/${productData.imageCover}`
                                      fileBlob ? fileBlob : productData.imageCover ?
                                      `${productData.imageCover}` : defaultCameraImage
                                  }
                              alt={productData.productName}
                            />                
                            <label  htmlFor="photo"
                                    className="productUpdateUpload__label">
                              <FaCloudUploadAlt 
                                    className="productUpdateIcon__upload" 
                              />
                            </label>
                            <input  type="file" 
                                    accept="image/*" 
                                    id="photo" 
                                    name="photo" 
                                    style={{ display: "none" }} 
                                    onChange={(e)=>handleImageCoverChange(e)}
                            />

                            <button className="productUpdateButton" 
                                    disabled={isSaving}
                            >
                                    {isSaving ? 'Actualizando...' : 'Actualizar'}
                            </button>  

                          </div>
                        
                        </>
                      :
                        <Skeleton className="catalog_businessInfo__skeleton" animation="wave" variant="rounded" width="20rem" height="20rem" 
                        />
                    }                 

                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
      {
        !isOnline && <OfflineFallback /> 
      }
    </>

  );
}
