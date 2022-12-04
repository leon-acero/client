import "./productList.css";
import { DataGrid } from "@mui/x-data-grid";
// import DeleteOutline from "@mui/icons-material/DeleteOutline";
import {FaTrashAlt} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import BasicDialog from '../../../../components/basicDialog/BasicDialog';

import {clsx} from "clsx";

////////////////////////////////////////////////////////////////
// -Snackbar
////////////////////////////////////////////////////////////////
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import {FaTimes} from "react-icons/fa";


// HTTP
import axios from "axios";
import SkeletonElement from '../../../../components/skeletons/SkeletonElement';

export default function ProductList() {

  const avoidRerenderFetchProduct = useRef(false);


  ////////////////////////////////////////////////////////////////
  // -Snackbar
  ////////////////////////////////////////////////////////////////
  const [openSnackbar, setOpenSnackbar] = useState(false);

  ////////////////////////////////////////////////////////////////
  // -Dialog
  ////////////////////////////////////////////////////////////////
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState ({id: "", productName: ""});
  const [productList, setProductList] = useState([])

  const [isLoading, setIsLoading] = useState(false);


  const handleDelete = async () => {
    setOpenModal(false);

 
    try {
      
      const res = await axios({
        withCredentials: true,
        method: 'DELETE',
        // url: `http://127.0.0.1:8000/api/v1/products/${currentProduct.id}`,
        url: `https://eljuanjo-dulces.herokuapp.com/api/v1/products/${currentProduct.id}`,
        })

      
      if (res.status === 204) {
        console.log ('El producto fue borrado con éxito!');

        // Borro el cliente del Grid Y del State
        setProductList(productList.filter((item) => item._id !== currentProduct.id));
        setOpenSnackbar(true);
      } 
    }
    catch(err) {
      console.log(err);
    }
  }


  useEffect (() => {

    if (avoidRerenderFetchProduct.current) {
      return;
    }

    if (isLoading)
      return;


    const fetchPosts = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchProduct.current = true;

      try {
        setIsLoading(true);      
        console.log("carga de lista de productos")
        // 1era OPCION PARA USAR AXIOS
        const res = await axios ({
          withCredentials: true,
          method: 'GET',
          url: 'http://127.0.0.1:8000/api/v1/products'
          // url: 'https://eljuanjo-dulces.herokuapp.com/api/v1/products'
        });

        setIsLoading(false);


        // 2da OPCION PARA USAR AXIOS
        // const res = await axios.get('http://127.0.0.1:8000/api/v1/products')

        // console.log(res)
        // console.log(res.data.data.data);
        setProductList(res.data.data.data)
      }
      catch (err) {
        console.log("err", err);
        setIsLoading(false);
      }

    }
    fetchPosts();
  }, [isLoading]);


  const openDeleteDialog = (id, productName) => {
   
    setCurrentProduct ({id, productName});
    ////////////////////////////////////////////////////////////////
    // -Dialog
    ////////////////////////////////////////////////////////////////
    setOpenModal(true);

  };

  ////////////////////////////////////////////////////////////////
  // -Snackbar
  ////////////////////////////////////////////////////////////////
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const action = (
    <>
      {/* <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
        UNDO
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        {/* <CloseIcon fontSize="small" /> */}
        <FaTimes />
      </IconButton>
    </>
  );
  ////////////////////////////////////////////////////////////////

  const valueFormatter = (value) => {
    if (value === '')
      return '';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  }

  const columns = [
    {
      field: "action",
      headerName: "Acción",
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <>
            <Link to={"/product/" + params.row._id}>
              <button className="productListEdit">Editar</button>
            </Link>
            {/* <DeleteOutline
              className="productListDelete"
              onClick={() => openDeleteDialog(params.row._id, params.row.productName)}
            /> */}
            <FaTrashAlt
              className="productListDelete"
              onClick={() => openDeleteDialog(params.row._id, params.row.productName)}
            />
          </>
        );
      },
    },
    { field: "sku", headerName: "SKU", width: 30, headerAlign: 'center', align: 'right',},
    {
      field: "productName",
      headerName: "Producto",
      width: 200,
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={`/img/products/${params.row.imageCover}`} alt="" />{params.row.productName}
          </div>
        );
      },
    },
    { field: "inventarioActual", 
      headerName: 'Inv. Actual', 
      width: 100,
      headerAlign: 'center', 
      align: 'right',
      cellClassName: (params) => clsx (
        { inventarioActualNegativo: params.row.inventarioActual < params.row.inventarioMinimo,
        })
      ,
      // valueGetter: (params) => params.row.inventarioActual - params.row.inventarioMinimo
    },
    {
      field: "inventarioMinimo",
      headerName: "Inv. Minimo",
      width: 100,
      headerAlign: 'center',
      align: 'right',
    },
    {
      field: "priceMenudeo",
      headerName: "Precio Menudeo",
      width: 140,
      headerAlign: 'center',
      valueFormatter: ({value}) => valueFormatter(value),
      align: 'right',
    },
    {
      field: "priceMayoreo",
      headerName: "Precio Mayoreo",
      width: 140,
      headerAlign: 'center',
      valueFormatter: ({value}) => valueFormatter(value),
      align: 'right',
    },
    {
      field: "costo",
      headerName: "Costo",
      width: 90,
      headerAlign: 'center',
      valueFormatter: ({value}) => valueFormatter(value),
      align: 'right',
    },    
    { field: "_id", headerName: "ID", width: 0, headerAlign: 'center', },

  ];

  return (
    <div className="productList">

      {/* 
      ////////////////////////////////////////////////////////////////
      // -Snackbar
      //////////////////////////////////////////////////////////////// */
      }
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={`${currentProduct.productName} fue borrado.`}
        action={action}
      />

      {
      /* ////////////////////////////////////////////////////////////////
      // -Dialog
      //////////////////////////////////////////////////////////////// 
      */}
      <BasicDialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          message= {`¿Estas seguro que deseas borrar a ${currentProduct.productName}?`}
          onSubmit={handleDelete}
          captionAceptar={"Borrar"}
          captionCancelar={"Cancelar"}
      />

      <div className="productTitleContainer">
        <h1 className="productTitle">Catálogo de Productos</h1>
        <Link to="/new-product">
          <button className="productAddButton">Crear</button>
        </Link>
      </div>
      { productList?.length > 0 &&
        <DataGrid className="dataGrid"
          rows={productList}
          disableSelectionOnClick
          columns={columns}
          rowsPerPageOptions={[8, 16]}
          pageSize={8}
          // checkboxSelection
        />
      }
      {
        isLoading && <SkeletonElement type="rectangular" />
      }
    </div>
  );
}
