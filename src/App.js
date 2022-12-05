import "./App.css";

/***************************   Components   *****************************/
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import Logout from './components/logout/Logout';
/***********************************************************************/


/***************************   React   *****************************/
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useContext } from 'react';
/***********************************************************************/


/***************************   Provider   ******************************/
import { stateContext } from './context/StateProvider';
/***********************************************************************/


/***************************   Pages   *****************************/
import Login from './pages/login/Login';
import Home from "./pages/home/Home";

import Client from "./pages/catalogs/edit/client/Client";
import Product from "./pages/catalogs/edit/product/Product";

import NewClient from "./pages/catalogs/create/newClient/NewClient";
import NewProduct from "./pages/catalogs/create/newProduct/NewProduct";

import ClientList from "./pages/catalogs/list/clientList/ClientList";
import ProductList from "./pages/catalogs/list/productList/ProductList";

import SearchClient from './pages/placeOrder/searchClient/SearchClient';
// import NewOrder from './pages/placeOrder/newOrder/NewOrder';
import NewOrUpdateOrder from './pages/placeOrder/newOrUpdateOrder/NewOrUpdateOrder';
import UpdateOrder from './pages/placeOrder/updateOrder/UpdateOrder';

import ReportWeeklySalesByMonth from './pages/reports/reportWeeklySalesByMonth/ReportWeeklySalesByMonth';
import ReportMonthlySalesByYear from './pages/reports/reportMonthlySalesByYear/ReportMonthlySalesByYear';
import ReportWholeBusinessSalesByYear from './pages/reports/reportWholeYearSales/ReportWholeBusinessSalesByYear';

/***********************************************************************/

import { useMatchMedia } from "./hooks/useMatchMedia";
import SplashScreen from './components/splashScreen/SplashScreen';


function App() {

  const { currentUser } = useContext(stateContext);

  const isDesktopResolution = useMatchMedia("(min-width:53.75em)", true);

  return (
    <div>Hola Sexy Abdel</div>
 
  );
}

export default App;
