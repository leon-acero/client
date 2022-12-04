import "./reportWeeklySalesByMonth.css"
import "react-datepicker/dist/react-datepicker.css"
import axios from '../../../utils/axios';

import { FaRegCalendarAlt } from "react-icons/fa";

import React, { useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker"
import Chart from '../../../components/chart/Chart';
import { format } from 'date-fns'
import { NumericFormat } from 'react-number-format';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';


export default function ReportWeeklySalesByMonth() {

  /************************    useRef    ********************************* /
  // Agregué estos dos useRefs porque en React18 se hace un re-render
  // doble en useEffect, debido al StrictMode y esto causaba que la llamada a axios 
  // se hiciera DOS VECES lo que causaba ir al server dos veces
  // con esto lo corregi pero al parecer tambien puedo usar Suspense,
  // state Machine, Remix, NextJS, o usar un State Manager con Store y Dispatch
  // checa:
  //        https://www.youtube.com/watch?v=HPoC-k7Rxwo&ab_channel=RealWorldReact
  ************************     useRef    *********************************/ 

  const avoidRerenderFetchVentasDelNegocio = useRef(false);

  /************************    useState    *********************************/
  // chartData es la informacion del chart
  // totalAcumulado es el totalAcumulado de Ventas en todo el Año
  // dateRange es el Rango de Fechas que quiero consultar
  // startDate es la fecha de comienzo de busqueda
  // endDate es la fecha de término de búsqueda

  const [chartData, setChartData] = useState (null);
  const [totalAcumulado, setTotalAcumulado] = useState (0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState (false);
  /************************     useState    *********************************/ 


  /************************     useEffect    *********************************/
  // 
  // fetchVentasDelNegocio carga la informacion que se mostrará en el Chart,
  // el total de Ventas del Año, el año más actual con Ventas
  /**************************    useEffect    ******************************* */

  useEffect (() => {

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
        setIsLoading (false);
      }
    }
    fetchVentasDelNegocio();
  }, [startDate, endDate]);
  /////////////////////////////////////////////////////////////////////////////
  

  const handleChangeDatePicker = (update) => {
    setDateRange(update)
    avoidRerenderFetchVentasDelNegocio.current = false;
  }


  return (
    <div className="reportWeeklySalesByMonth">
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
                title={
                    <NumericFormat 
                          value={totalAcumulado} 
                          decimalScale={2} 
                          thousandSeparator="," 
                          prefix={'$'} 
                          decimalSeparator="." 
                          displayType="text" 
                          renderText={(value) => <span>Venta Acumulada {value}</span>}
                    />} 
                grid 
                dataKey="SubTotal"
            />
          )
        }
        
      </div>
    </div>
  )
}
