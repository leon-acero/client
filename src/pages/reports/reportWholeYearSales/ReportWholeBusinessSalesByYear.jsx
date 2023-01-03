import "./reportWholeBusinessSalesByYear.css"
import axios, { regresaMensajeDeError } from '../../../utils/axios';

/*************************    Offline/Online     ****************************/
import OfflineFallback from '../../../components/offlineFallback/OfflineFallback';
import { useNavigatorOnLine } from '../../../hooks/useNavigatorOnLine';
/****************************************************************************/

/*******************************    React     *******************************/
import React, { useEffect, useRef, useState } from 'react'
/****************************************************************************/

/***************************    Components     ******************************/
import Chart from '../../../components/chart/Chart';
// import { NumericFormat } from 'react-number-format';
import { formateaCurrency } from '../../../utils/formatea';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';
import SnackBarCustom from '../../../components/snackBarCustom/SnackBarCustom';
/****************************************************************************/

/**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import {FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
/****************************************************************************/


export default function ReportWholeBusinessSalesByYear() {

  // console.log("ReportWholeBusinessSalesByYear started")

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /************************    useRef    **************************************/ 
  // Agregué este useRef porque en React18 se hace un re-render
  // doble en useEffect, debido al StrictMode y esto causaba que la llamada a axios 
  // se hiciera DOS VECES lo que causaba ir al server dos veces
  // con esto lo corregi pero al parecer tambien puedo usar Suspense,
  // state Machine, Remix, NextJS, o usar un State Manager con Store y Dispatch
  // checa:
  //        https://www.youtube.com/watch?v=HPoC-k7Rxwo&ab_channel=RealWorldReact

  const avoidRerenderFetchVentasDelNegocio = useRef(false);
  /*****************************************************************************/


  /****************************    useState    *********************************/ 
  // chartData es la informacion del chart
  // granTotal es el Total de Ventas en toda la existencia de la Empresa

  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no la operacion
  // de AXIOS

  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [chartData, setChartData] = useState ([]);
  const [granTotal, setGranTotal] = useState (0);
  const [isLoading, setIsLoading] = useState (false);
  /*****************************************************************************/


  /************************     useEffect    ***********************************/
  // fetchVentasDelNegocio carga la informacion que se mostrará en el Chart,
  // el total de Ventas del Año, el año más actual con Ventas
  useEffect (() => {

    if (!isOnline) {
      return;
    }

    const fetchVentasDelNegocio = async () => {

      if (avoidRerenderFetchVentasDelNegocio.current) {
        return;
      }

      avoidRerenderFetchVentasDelNegocio.current = true;

      try {
        // console.log("axios carga de ventas del negocio");
        setIsLoading (true);
        const res = await axios.get (`/api/v1/sales/whole-business-sales-by-year`);
  
        setIsLoading (false);
        // console.log("carga ventas del negocio", res.data.data.ventasPorMes)
        setGranTotal(res.data.totalEmpresa)
        setChartData(res.data.data.ventaTotalPorAnio);
        // console.log("request finished de carga ventas del negocio")

      }
      catch (err) {
        console.log(err);
        setIsLoading (false);
        
        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError(err));      
        setOpenSnackbar(true);
      }
      
    }
    fetchVentasDelNegocio();
  },[isOnline]);
  /*****************************************************************************/

  
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

  // console.log("ReportWholeBusinessSalesByYear render")

  const out = (
    <>
      {
        isOnline && (
          <div className='reportWholeBusinessSalesByYear'>  
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
            </Snackbar>      */}
            {
              isLoading && <SkeletonElement type="rectangular" width="auto" height="auto" />
            }
            {
              !isLoading && chartData &&
                (
                  <Chart data={chartData} 
                    title={`${formateaCurrency(granTotal)}`
                      // <NumericFormat 
                      //   value={granTotal} 
                      //   decimalScale={2} 
                      //   thousandSeparator="," 
                      //   prefix={'$'} 
                      //   decimalSeparator="." 
                      //   displayType="text" 
                      //   renderText={(value) => <span>Venta {value}</span>}
                      // />
                    } 
                    grid 
                    dataKey="Total"
                    className="graph"
                  />
                )
            }
          </div>
        )
      }
      {
        !isOnline && <OfflineFallback />
      }
    </>

  )

  // console.log("ReportWholeBusinessSalesByYear finished")

  return out;
}
