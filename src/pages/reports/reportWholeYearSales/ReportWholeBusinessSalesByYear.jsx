import "./reportWholeBusinessSalesByYear.css"
import axios from '../../../utils/axios';

import React, { useEffect, useRef, useState } from 'react'
// import axios from "axios"
import Chart from '../../../components/chart/Chart';
import { NumericFormat } from 'react-number-format';
import SkeletonElement from '../../../components/skeletons/SkeletonElement';


export default function ReportWholeBusinessSalesByYear() {

  // console.log("ReportWholeBusinessSalesByYear started")


  /************************    useRef    ********************************* 
  // Agregué este useRef porque en React18 se hace un re-render
  // doble en useEffect, debido al StrictMode y esto causaba que la llamada a axios 
  // se hiciera DOS VECES lo que causaba ir al server dos veces
  // con esto lo corregi pero al parecer tambien puedo usar Suspense,
  // state Machine, Remix, NextJS, o usar un State Manager con Store y Dispatch
  // checa:
  //        https://www.youtube.com/watch?v=HPoC-k7Rxwo&ab_channel=RealWorldReact
  ************************     useRef    *********************************/ 

  const avoidRerenderFetchVentasDelNegocio = useRef(false);


  /************************    useState    ********************************* 
  // chartData es la informacion del chart
  // granTotal es el Total de Ventas en toda la existencia de la Empresa
  ************************     useState    *********************************/ 

  const [chartData, setChartData] = useState ([]);
  const [granTotal, setGranTotal] = useState (0);
  const [isLoading, setIsLoading] = useState (false);
  /////////////////////////////////////////////////////////////////////////////


  /************************     useEffect    ********************************* 
  // fetchVentasDelNegocio carga la informacion que se mostrará en el Chart,
  // el total de Ventas del Año, el año más actual con Ventas
  **************************    useEffect    ******************************* */


  useEffect (() => {

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
      }
      
    }
    fetchVentasDelNegocio();
  },[]);
  /////////////////////////////////////////////////////////////////////////////


  // console.log("ReportWholeBusinessSalesByYear render")

  const out = (
    <div className='reportWholeBusinessSalesByYear'>  
      {
        isLoading && <SkeletonElement type="rectangular" width="auto" height="auto" />
      }
      {
        !isLoading && chartData &&
          (
            <Chart data={chartData} 
              title={
                <NumericFormat 
                  value={granTotal} 
                  decimalScale={2} 
                  thousandSeparator="," 
                  prefix={'$'} 
                  decimalSeparator="." 
                  displayType="text" 
                  renderText={(value) => <span>Venta {value}</span>}
                />
              } 
              grid 
              dataKey="Total"
              className="graph"
            />
          )
      }
    </div>
  )

  // console.log("ReportWholeBusinessSalesByYear finished")

  return out;
}
