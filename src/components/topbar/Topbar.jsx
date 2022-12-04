import "./topbar.css";
import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';

import { stateContext } from '../../context/StateProvider';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import {FaHandshake, FaSignOutAlt, FaStore } from "react-icons/fa";

import { domAnimation, LazyMotion, m } from 'framer-motion';
import { BASE_URL } from '../../utils/axios';

import { useNavigatorOnLine } from '../../hooks/useNavigatorOnLine'


const logoVariants = {
  hidden: { y: -250 },
  visible: { 
    y: 0,
    transition: { delay: 0.2, type: 'spring', stiffness: 100 }
  },
}

const loginVariants = {
  hidden: { y: -250 },
  visible: { 
    y: 0,
    transition: { delay: 1.5, type: 'spring', stiffness: 120 }
  },
}

export default function Topbar() {

  const isOnline = useNavigatorOnLine();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { currentUser } = useContext(stateContext);

  return (

    <LazyMotion features={domAnimation}>

      <div className="topbar">
        <div className="topbarWrapper">
          <Link className="logoLink" to="/">
                <m.span className="logo"
                  variants={logoVariants}
                  initial="hidden"
                  animate="visible"
                >El Juanjo | Dulcería</m.span>
          </Link>
          <div className="topRight">
            {
              
              currentUser && (
              <m.div className="authStyle"
                variants={logoVariants}
                initial="hidden"
                animate="visible"
              >
                <img 
                    src={`${BASE_URL}/img/users/${currentUser.photo}`} 
                    alt="{currentUser.name}" 
                    className="topAvatar"  
                    // onClick={(e)=>setOpen(true)}
                    onClick={handleClick}
                />
                <span className={isOnline ? 'online-offline online' : 'online-offline offline'}></span>

              </m.div>)
            }
            { !currentUser && (
                <m.div className="authStyle"
                  variants={loginVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link className='loginButton' to="/login">Iniciar sesión</Link>
                </m.div>
              )
            }
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenu}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* <MenuItem>
                <Avatar /> My account
              </MenuItem> */}
              <MenuItem className="menuItem tipografia" >
                <Link className='liga__flex menuGeneralButton' to="/new-client">
                  <ListItemIcon>
                    <FaStore className="iconos__general" />
                  </ListItemIcon>
                  Crear Cliente</Link>
              </MenuItem>

              <MenuItem className="menuItem tipografia" >
                <Link className='liga__flex menuGeneralButton' to="/search-client">
                  <ListItemIcon>
                    <FaHandshake className="iconos__placeOrder" />
                  </ListItemIcon>
                  Crear Pedido</Link>
              </MenuItem>

              <MenuItem className="menuItem" >
                <Link className='liga__flex menuGeneralButton' to="/logout">
                  <ListItemIcon>
                    <FaSignOutAlt className="iconos__general" />
                  </ListItemIcon>
                  Cerrar Sesión</Link>
              </MenuItem>

              {/* <MenuItem className="tipografia">
                <ListItemIcon>
                  <FaHandshake className="iconos__placeOrder" />
                </ListItemIcon>
                Crear Pedido
              </MenuItem> */}
              {/* <MenuItem className="tipografia">
                <ListItemIcon>
                  <FaSignOutAlt className="iconos__sigOut" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem> */}
            </Menu>          
            {/* <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              open={open}
              onClose={(e)=>setOpen(false)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem className="menuItem" onClick={(e)=>setOpen(false)}>
                <Link className='crearPedidoButton' to="/search-client">Crear Pedido</Link>
              </MenuItem>
              
              <MenuItem className="menuItem" onClick={(e)=>setOpen(false)}>
                <Link className='logoutButton' to="/logout">Cerrar Sesión</Link>
              </MenuItem>
              
            </Menu> */}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
