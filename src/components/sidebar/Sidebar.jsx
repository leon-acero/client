import "./sidebar.css";

import {FaHome, FaDollarSign, FaStore, FaCandyCane, FaChartLine, FaHandshake} from "react-icons/fa";

import { NavLink } from "react-router-dom";

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
              <NavLink activeClassName='sideBar__link-active' to="/search-client" className="sideBar__link">     
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
          <h3 className="sidebarTitle">Reportes</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <NavLink activeClassName='sideBar__link-active' to="/sales/whole-year-sales" className="sideBar__link">
                <FaChartLine className="sidebarIcon" />
                Venta Anual
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink activeClassName='sideBar__link-active' to="/sales/monthly-sales" className="sideBar__link">
                <FaChartLine className="sidebarIcon" />
                Venta Mensual
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <NavLink activeClassName='sideBar__link-active' to="/sales/weekly-sales" className="sideBar__link">
                <FaChartLine className="sidebarIcon" />
                Venta Semanal
              </NavLink>
            </li>
            <li className="sidebarListItem">
              <FaChartLine className="sidebarIcon" />
              Venta por Cliente
            </li>
            <li className="sidebarListItem">
              <FaChartLine className="sidebarIcon" />
              Venta por Producto
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
