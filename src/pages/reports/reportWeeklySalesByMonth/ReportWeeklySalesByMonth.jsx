import "./reportWeeklySalesByMonth.css"
import axios, { regresaMensajeDeError } from '../../../utils/axios';

/*************************    Offline/Online     ****************************/
import OfflineFallback from '../../../components/offlineFallback/OfflineFallback';
import { useNavigatorOnLine } from '../../../hooks/useNavigatorOnLine';
/****************************************************************************/

/*******************************    React     *******************************/
import React, { useEffect, useRef, useState } from 'react'
/****************************************************************************/

/**************************    Date Picker     ******************************/
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker"
/****************************************************************************/

/*****************************    React Icons     ***************************/
import { FaRegCalendarAlt } from "react-icons/fa";
/****************************************************************************/

/***************************    Components     ******************************/
import Chart from '../../../components/chart/Chart';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';
import SnackBarCustom from '../../../components/snackBarCustom/SnackBarCustom';
/****************************************************************************/

/*******************************    Format     ******************************/
import { format } from 'date-fns'
// import { NumericFormat } from 'react-number-format';
import { formateaCurrency } from '../../../utils/formatea';
/****************************************************************************/

/**************************    Snackbar    **********************************/
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import {FaTimes} from "react-icons/fa";
// import { Alert } from '@mui/material';
/****************************************************************************/

/**************************    Framer-Motion    *****************************/
import { domAnimation, LazyMotion, m } from 'framer-motion';

const svgVariants = {
  hidden: { 
    opacity: 0, 
  },
  visible: { 
    opacity: 1, 
    transition: { delay: .5, duration: 2 }
  }
};
/****************************************************************************/


export default function ReportWeeklySalesByMonth() {

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /************************    useRef    ***************************************/
  // Agregué estos dos useRefs porque en React18 se hace un re-render
  // doble en useEffect, debido al StrictMode y esto causaba que la llamada a axios 
  // se hiciera DOS VECES lo que causaba ir al server dos veces
  // con esto lo corregi pero al parecer tambien puedo usar Suspense,
  // state Machine, Remix, NextJS, o usar un State Manager con Store y Dispatch
  // checa:
  //        https://www.youtube.com/watch?v=HPoC-k7Rxwo&ab_channel=RealWorldReact

  const avoidRerenderFetchVentasDelNegocio = useRef(false);
  /*****************************************************************************/


  /************************    useState    *********************************/
  // chartData es la informacion del chart
  // totalAcumulado es el totalAcumulado de Ventas en todo el Año
  // dateRange es el Rango de Fechas que quiero consultar
  // startDate es la fecha de comienzo de busqueda
  // endDate es la fecha de término de búsqueda
  // iconoSnackBarDeExito es boolean que indica si tuvo exito o no la operacion
  // de AXIOS

  const [iconoSnackBarDeExito, setIconoSnackBarDeExito] = useState (true);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [chartData, setChartData] = useState (null);
  const [totalAcumulado, setTotalAcumulado] = useState (0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState (false);
  /*****************************************************************************/


  /************************     useEffect    ***********************************/ 
  // fetchVentasDelNegocio carga la informacion que se mostrará en el Chart,
  // El cliente selecciona un Rango de Fechas, generalmente semanal
  // y asi se calcula la Venta
  useEffect (() => {

    if (!isOnline) {
      return;
    }

    const fetchVentasDelNegocio = async () => {

      // console.log("useEffect")

      if (avoidRerenderFetchVentasDelNegocio.current) {
        return;
      }

      // con este if me aseguro que se mande llamar axios SOLO si 
      // year tiene valor, ya que al cargar la pagina empieza con undefined
      // y es solo hasta que cargo los años con fetchYearsSales que
      // puede year tener un valor válido
      // Deberia haber una mejor manera de validar esto
      try {
        if (startDate !== null && endDate !== null) {
  
          avoidRerenderFetchVentasDelNegocio.current = true;
  
          // console.log("axios carga de ventas del negocio");
  
          setChartData(null);

          setIsLoading (true);
          const res = await axios.get (`/api/v1/sales//weekly-range-sales/${format(startDate, "yyyy-MM-dd")}/${format(endDate, "yyyy-MM-dd")}`);
  
          setIsLoading (false);
          // console.log(res)
          // console.log(res.data.data.ventasPorSemana);
  
          // console.log("carga ventas del negocio", res.data.data.ventasPorMes)
          setTotalAcumulado(res.data.totalAcumulado)
          setChartData(res.data.data.ventasPorSemana);
          // console.log("request finished de carga ventas del negocio")
  
        }

      }
      catch (err) {
        console.log("Error", err);
        setIsLoading (false);
        
        setIconoSnackBarDeExito(false);
        setMensajeSnackBar (regresaMensajeDeError(err));      
        setOpenSnackbar(true);
      }
    }
    fetchVentasDelNegocio();
  }, [startDate, endDate, isOnline]);
  /*****************************************************************************/


  /***********************    handleChangeDatePicker    ***********************/
  // Actualiza el cambio del Fechas del Calendario
  /****************************************************************************/ 
  const handleChangeDatePicker = (update) => {
    setDateRange(update)
    avoidRerenderFetchVentasDelNegocio.current = false;
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

  return (
    <>
      {
        isOnline && (
          <LazyMotion features={domAnimation} >
            <m.div  className="reportWeeklySalesByMonth"
                    variants={svgVariants}
                    initial="hidden"
                    animate="visible"
            >
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
              </Snackbar>   */}
                    
              <div className="reportWeeklySalesByMonth__container">
                <div className='reportWeeklySalesByMonth__selectorDeFecha'>
                  <p 
                    className="reportWeeklySalesByMonth__title">Selecciona un Rango de Fechas:
                  </p>
                  <DatePicker 
                    className="datePicker"
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => handleChangeDatePicker(update)}
                    dateFormat="yyyy-MMM-dd" 
                  />
                  <FaRegCalendarAlt className="calendario" />
                </div>
                {
                  isLoading && <SkeletonElement type="rectangular" width="auto" height="auto" />
                }
                {
                  chartData && (
                    <Chart 
                        className="reportWeeklySalesByMonth__chart"
                        data={chartData} 
                        title={`Venta Acumulada ${formateaCurrency(totalAcumulado)}`
                            // <NumericFormat 
                            //       value={totalAcumulado} 
                            //       decimalScale={2} 
                            //       thousandSeparator="," 
                            //       prefix={'$'} 
                            //       decimalSeparator="." 
                            //       displayType="text" 
                            //       renderText={(value) => <span>Venta Acumulada {value}</span>}
                            // />
                          } 
                        grid 
                        dataKey="SubTotal"
                    />
                  )
                }
                
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
