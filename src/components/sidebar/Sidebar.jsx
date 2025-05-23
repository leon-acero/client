import "./sidebar.css";

/*******************************    React     *******************************/
import { NavLink } from "react-router-dom";
/*****************************************************************************/

/*******************************    React Icons     **************************/
import {FaHome, FaDollarSign, FaStore, FaCandyCane, FaChartLine, FaHandshake} from "react-icons/fa";
/*****************************************************************************/

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink 
                        to="/dashboard" 
                        activeClassName='sideBar__link-active' 
                        className="sideBar__link">
                  <FaHome className="sidebarIcon" />
                  Home
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Transacciones</h3>
          <ul className="sidebarList">      
            <li className="sidebarListItem">
              <NavLink  activeClassName='sideBar__link-active' 
                        // to="/search-client" 
                        to={{
                          pathname: '/search-client',
                          state: {
                            openVentana: "CrearPedido"
                          }
                        }}
                        className="sideBar__link">     
                <FaHandshake className="sidebarIcon iconos__placeOrder" />
                Ventas
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <FaDollarSign className="sidebarIcon" />
              Compras
            </li>
          </ul>
        </div>        
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Catálogos</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink activeClassName='sideBar__link-active' to="/clients" className="sideBar__link">
                <FaStore className="sidebarIcon" />
                Clientes
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink activeClassName='sideBar__link-active' to="/products" className="sideBar__link">
                <FaCandyCane className="sidebarIcon" />
                Productos
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Reportes de Ventas</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink activeClassName='sideBar__link-active' to="/sales/whole-year-sales" className="sideBar__link">
                <FaChartLine className="sidebarIcon" />
                Anual
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink activeClassName='sideBar__link-active' to="/sales/monthly-sales" className="sideBar__link">
                <FaChartLine className="sidebarIcon" />
                Mensual
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink activeClassName='sideBar__link-active' to="/sales/weekly-sales" className="sideBar__link">
                <FaChartLine className="sidebarIcon" />
                Semanal
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <FaChartLine className="sidebarIcon" />
              Por Cliente
            </li>
            <li className="sidebarListItem">
              <FaChartLine className="sidebarIcon" />
              Por Producto
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
