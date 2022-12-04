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
    <Router>

      {/* Si no estas loggeado solo puedes ver el Topbar y el Login */}
      <Topbar />
      
      
      {/* Muestro la SplashScreen si no hay usuario loggeado */}
      {
        !currentUser && (
            <Switch>
              <Route exact path="/">
                <SplashScreen />
              </Route>

              <Route exact path="/login">
                <Login />
              </Route>
            </Switch>
        ) 
      }

      {/* Si estas loggeado y tienes rol de Vendedor solo puedes ver esto */}
      {
        currentUser?.role === "vendedor" && (
          <div className="container">
            <Switch>

              <Route exact path="/">
                <SplashScreen />
              </Route>

              {/* HomePage */}
              <Route exact path="/dashboard">
                <Home />
              </Route>

              {/***********************************************************/}
              {/* Hacer un Nuevo Pedido */}
              <Route path="/search-client">
                <SearchClient />
              </Route>

              {/* <Route path="/new-order/:clientId" component={NewOrder} /> */}

              {/***********************************************************/}
              {/* Authentication */}
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/logout">
                <Logout />
              </Route>

            </Switch>
          </div>
        )
      }

      {/* Si estas loggeado y tienes rol de admin puedes ver esto */}
      {
        currentUser?.role === "admin" && (
          <div className="container">

            {/* {
              isDesktopResolution && <Sidebar />
            } */}
            <Sidebar />

              <Switch>

                <Route exact path="/">
                  <SplashScreen />
                </Route>
                
                {/* HomePage */}
                <Route exact path="/dashboard">
                  <Home />
                </Route>

                {/***********************************************************/}
                {/* Catálogo de Clientes */}
                <Route path="/clients">
                  <ClientList />
                </Route>

                <Route path="/client/:clientId">
                  <Client />
                </Route>  

                <Route path="/new-client">
                  <NewClient />
                </Route>


                {/***********************************************************/}
                {/* Catàlogo de Productos */}
                <Route path="/products">
                  <ProductList />
                </Route>

                <Route path="/product/:productId">
                  <Product />
                </Route>

                <Route path="/new-product">
                  <NewProduct />
                </Route>


                {/***********************************************************/}
                {/* Hacer un Nuevo Pedido */}

                <Route path="/search-client">
                  <SearchClient />
                </Route>  

                {/* Component Props ESTO SI me sirve si quiero pasar
                    los Props de Route y mis Custom Props
                */}
                {/* <Route path="/new-order/:clientId" component={NewOrder} /> */}
                <Route path="/new-or-update-order/:clientId" component={NewOrUpdateOrder} />
                <Route path="/update-order/:clientId" component={UpdateOrder} />



                {/* Render Props ESTO SI me sirve si quiero pasar
                    los Props de Route y mis Custom Props
                */}
                {/* <Route 
                    exact 
                    path="/new-order/:clientId" 
                    render={
                        ({match, location, history}) => (
                          <NewOrder match={match} location={location}/>
                        ) }
                /> */}

                {/* <Route 
                    exact 
                    path="/new-order/:clientId" 
                    render={
                        (props) => (
                          <NewOrder props={props}/>
                        )}
                /> */}

                {/* 
                    Children Props ESTO NO me sirve si quiero pasar 
                    los Props de Route y mis Custom Props
                */}
                {/* <Route path="/new-order/:clientId" >
                  <NewOrder />
                </Route> */}

                {/***********************************************************/}
                {/* Reportes */}
                <Route path="/sales/whole-year-sales">
                  <ReportWholeBusinessSalesByYear />
                </Route>

                <Route path="/sales/monthly-sales">
                  <ReportMonthlySalesByYear />
                </Route> 

                <Route path="/sales/weekly-sales">
                  <ReportWeeklySalesByMonth />
                </Route>    

                {/***********************************************************/}
                {/* Authentication */}
                <Route path="/login">
                  <Login />
                </Route>

                <Route path="/logout">
                  <Logout />
                </Route>

              </Switch>

          </div>
        )
      }
    </Router>
  );
}

export default App;
