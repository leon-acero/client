import "./sidebar.css";
// import LineStyle from "@mui/icons-material/LineStyle";
// import AttachMoney from "@mui/icons-material/AttachMoney";
// import Storefront from "@mui/icons-material/Storefront";
// import TrendingUp from "@mui/icons-material/TrendingUp";

import {FaHome, FaDollarSign, FaStore, FaCandyCane, FaChartLine, FaHandshake} from "react-icons/fa";

// import Timeline from "@mui/icons-material/Timeline";
// import PermIdentity from "@mui/icons-material/PermIdentity";
// import BarChart from "@mui/icons-material/BarChart";
// import MailOutline from "@mui/icons-material/MailOutline";
// import DynamicFeed from "@mui/icons-material/DynamicFeed";
// import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
// import WorkOutline from "@mui/icons-material/WorkOutline";
// import Report from "@mui/icons-material/Report";

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
            <li className="sidebarListItem active">
              <FaHome className="sidebarIcon" />
              Home
            </li>
            </Link>
            {/* <li className="sidebarListItem">
              <Timeline className="sidebarIcon" />
              Analytics
            </li>
            <li className="sidebarListItem">
              <FaChartLine className="sidebarIcon" />
              Sales
            </li> */}
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Transacciones</h3>
          <ul className="sidebarList">      
            <Link to="/search-client" className="link">     
              <li className="sidebarListItem">
                <FaHandshake className="sidebarIcon iconos__placeOrder" />
                Ventas
              </li>
            </Link>
            <li className="sidebarListItem">
              <FaDollarSign className="sidebarIcon" />
              Compras
            </li>
            {/* <li className="sidebarListItem">
              <Report className="sidebarIcon" />
              Reports
            </li> */}
          </ul>
        </div>        
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Catálogos</h3>
          <ul className="sidebarList">
            <Link to="/clients" className="link">
              <li className="sidebarListItem">
                <FaStore className="sidebarIcon" />
                Clientes
              </li>
            </Link>
            <Link to="/products" className="link">
              <li className="sidebarListItem">
                <FaCandyCane className="sidebarIcon" />
                Productos
              </li>
            </Link>
            {/* <li className="sidebarListItem">
              <FaDollarSign className="sidebarIcon" />
              Transactions
            </li> */}
            {/* <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
              Reportes
            </li> */}
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Reportes</h3>
          <ul className="sidebarList">
            <Link to="/sales/whole-year-sales" className="link">
              <li className="sidebarListItem">
                <FaChartLine className="sidebarIcon" />
                Ventas Anuales
              </li>
            </Link>
            <Link to="/sales/monthly-sales" className="link">
              <li className="sidebarListItem">
                <FaChartLine className="sidebarIcon" />
                Venta Mensual Por Año
              </li>
            </Link>
            <Link to="/sales/weekly-sales" className="link">
              <li className="sidebarListItem">
                <FaChartLine className="sidebarIcon" />
                Venta Semanal Por Mes
              </li>
            </Link>
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
