import "./reportMonthlySalesByYear.css"
import axios, { regresaMensajeDeError } from '../../../utils/axios';

import OfflineFallback from '../../../components/offlineFallback/OfflineFallback';
import { useNavigatorOnLine } from '../../../hooks/useNavigatorOnLine';

/*******************************    React     *******************************/
import React, { useEffect, useRef, useState } from 'react'
/****************************************************************************/

/***************************    Components     ******************************/
import Chart from '../../../components/chart/Chart';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';
/****************************************************************************/

/*******************************    Format     ******************************/
import { NumericFormat } from 'react-number-format';
/****************************************************************************/

/*******************************    Material UI     *************************/
import { Skeleton } from '@mui/material';
/****************************************************************************/

/**************************    Snackbar    **********************************/
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import {FaTimes} from "react-icons/fa";
import { Alert } from '@mui/material';
/****************************************************************************/


export default function ReportMonthlySalesByYear() {
  // console.log("ReportMonthlySalesByYear started")

  /***********************     useNavigatorOnLine    ***************************/
  // isOnline es para saber si el usuario esta Online
  const isOnline = useNavigatorOnLine();
  /*****************************************************************************/


  /************************    useRef    ********************************* 
  // Agregué estos dos useRefs porque en React18 se hace un re-render
  // doble en useEffect, debido al StrictMode y esto causaba que la llamada a axios 
  // se hiciera DOS VECES lo que causaba ir al server dos veces
  // con esto lo corregi pero al parecer tambien puedo usar Suspense,
  // state Machine, Remix, NextJS, o usar un State Manager con Store y Dispatch
  // checa:
  //        https://www.youtube.com/watch?v=HPoC-k7Rxwo&ab_channel=RealWorldReact
  ************************     useRef    *********************************/ 

  const avoidRerenderFetchYearsSales = useRef(false);
  const avoidRerenderFetchVentasDelNegocio = useRef(false);


  /************************    useState    ********************************* 
  // chartData es la informacion del chart
  // Total es el Total de Ventas en todo el Año
  // anios son los años que se ponen en el select
  // year es el año seleccionado en el select
  ************************     useState    *********************************/ 

  const [mensajeSnackBar, setMensajeSnackBar] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const [chartData, setChartData] = useState ([]);
  // lo puse null para usar MUI Skeleton
  const [chartData, setChartData] = useState (null);
  const [Total, setTotal] = useState (0);

  // const [anios, setAnios] = useState ([])
  // lo puse null para usar MUI Skeleton
  const [anios, setAnios] = useState (null)

  // const [year, setYear] = useState(new Date().getFullYear());
  const [year, setYear] = useState(undefined);


  /************************     useEffect    ********************************* 
  // fetchYearsSales carga la Lista de Años que se mostraran en el select
  // 
  // fetchVentasDelNegocio carga la informacion que se mostrará en el Chart,
  // el total de Ventas del Año, el año más actual con Ventas
  **************************    useEffect    ******************************* */

  useEffect (() => {

    if (!isOnline) {
      return;
    }

    if (avoidRerenderFetchYearsSales.current) {
      return;
    }

    const fetchYearsSales = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchYearsSales.current = true;

      try {
        // console.log("axios carga de años");
  
        // const res = await axios ({
        //   withCredentials: true,
        //   method: 'GET',
        //   url: 'http://127.0.0.1:8000/api/v1/sales/list-of-years-sales'
        //   // url: 'https://eljuanjo-dulces.herokuapp.com/api/v1/sales/list-of-years-sales'
        // });
  
        const res = await axios.get ('/api/v1/sales/list-of-years-sales');
  
     
        // console.log("resultado carga de años",res)
        // console.log("res: ",res.data.data.listOfYearsSales);
     
        // console.log("carga años de ventas", res)
        // setAnios(aniosNew)
        setAnios(res.data.data.listOfYearsSales);
        setYear(res.data.currentYear);
        // console.log("aniosNew", aniosNew)
        // console.log("request finished de carga años de ventas")

      }
      catch (err) {
        console.log(err);
        setMensajeSnackBar (regresaMensajeDeError(err));      
        setOpenSnackbar(true);
      }      
    }
    
    fetchYearsSales();
    
  }, [isOnline]);


  /*****************************    useEffect    ******************************/
  // fetchVentasDelNegocio carga las Ventas Mensuales de la Dulceria de un Año
  // en particular
  /****************************************************************************/
  useEffect (() => {

    if (!isOnline) {
      return;
    }

    const fetchVentasDelNegocio = async () => {

      if (avoidRerenderFetchVentasDelNegocio.current) {
        return;
      }

      // con este if me aseguro que se mande llamar axios SOLO si 
      // year tiene valor, ya que al cargar la pagina empieza con undefined
      // y es solo hasta que cargo los años con fetchYearsSales que
      // puede year tener un valor válido
      // Deberia haber una mejor manera de validar esto
      if (year !== undefined) {

        avoidRerenderFetchVentasDelNegocio.current = true;
        setChartData(null);
        console.log("axios carga de ventas del negocio");

        try {

          // const res = await axios ({
          //   withCredentials: true,
          //   method: 'GET',
          //   url: `http://127.0.0.1:8000/api/v1/sales/monthly-sales/${year}`
          //   // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/sales/monthly-sales/${year}`
          // });

          const res = await axios.get (`/api/v1/sales/monthly-sales/${year}`);
  
          // console.log("res",res)
          // console.log(res.data.data);
          
          console.log("carga ventas del negocio", res.data.data.ventasPorMes)
          setTotal(res.data.totalAnual)
          setChartData(res.data.data.ventasPorMes);
          // console.log("request finished de carga ventas del negocio")
        }
        catch (err)
        {
          console.log("Error", err)
          setMensajeSnackBar (regresaMensajeDeError(err));      
          setOpenSnackbar(true);
        }

      }
    }
    fetchVentasDelNegocio();
  }, [year, isOnline]);


  /*****************************    getAnios    ******************************/
  // Llena el select con la lista de Años con ventas
  /****************************************************************************/  const getAnios = () => {
    return anios.map((current) => {
      return <option key={current.anio} value={current.anio}>{current.anio} 
              </option>;
    });
  }


  /*****************************    handleChange    ***************************/
  // Actualiza el cambio del año del select
  /****************************************************************************/ 
  const handleChange = (e) => {
    setYear( e.target.value );
    avoidRerenderFetchVentasDelNegocio.current = false;
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

  // console.log("ReportMonthlySalesByYear render")


  const out = (
    <>
      {
        isOnline && (
          <div className="reportMonthlySalesByYear">

            <Snackbar
              open={openSnackbar}
              autoHideDuration={5000}
              onClose={handleCloseSnackbar}
            >
              <Alert 
                  severity= {"success"} 
                  action={action}
                  sx={{ fontSize: '1.4rem', backgroundColor:'#333', color: 'white', }}
              >{mensajeSnackBar}
              </Alert>
            </Snackbar>     
            {
              anios && (
                      <select className="yearsList"
                        onChange={(e)=>handleChange(e)}
                        value={year}
                      >
                        {getAnios()}
                      </select>
              )
            }
            {
              // !anios && <div className="yearsList">Loading...</div>
              !anios && <Skeleton className="yearsList" animation="wave" variant="rounded" width={110} height={30}  />
            }
            {
              chartData && (
                <Chart 
                      data={chartData} 
                      // title={`Venta Anual ${year} de $${Total}`} 
            
                      title={<NumericFormat value={Total} decimalScale={2} thousandSeparator="," prefix={'$'} decimalSeparator="." displayType="text" renderText={(value) => <span>Venta Anual {year} de {value}</span>}
                      />} 
                      grid dataKey="SubTotal"
                />
              )
            }
            {
              !chartData && <SkeletonElement type="rectangular" />
              // !chartData && <Skeleton animation="wave" variant="rounded" width={980} height={320}  />
            }
          </div>
        )
      }
      {
        !isOnline && <OfflineFallback />
      }
    </>

  )

  // console.log("ReportMonthlySalesByYear finished")

  return out;
}
