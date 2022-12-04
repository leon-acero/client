import "./clientList.css";

// REACT
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// import { useContext} from "react";
// import { stateContext } from '../../context/StateProvider';

// MATERIAL UI
import { DataGrid } from "@mui/x-data-grid";
// import DeleteOutline from "@mui/icons-material/DeleteOutline";
import {FaTrashAlt} from "react-icons/fa";

// import { userRows } from "../../dummyData";

import BasicDialog from '../../../../components/basicDialog/BasicDialog';

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


export default function ClientList() {

  const avoidRerenderFetchClient = useRef(false);

  ////////////////////////////////////////////////////////////////
  // -Snackbar
  ////////////////////////////////////////////////////////////////
  const [openSnackbar, setOpenSnackbar] = useState(false);

  ////////////////////////////////////////////////////////////////
  // -Dialog
  ////////////////////////////////////////////////////////////////
  const [openModal, setOpenModal] = useState(false);
  const [currentClient, setCurrentClient] = useState ({id: "", businessName: ""});
  const [clientList, setClientList] = useState([])

  const [isLoading, setIsLoading] = useState(false);


  // const { setClient} = useContext(stateContext)

  const handleDelete = async () => {
    setOpenModal(false);

    try {

      const res = await axios({
        withCredentials: true,
        method: 'DELETE',
        url: `http://127.0.0.1:8000/api/v1/clients/${currentClient.id}`,
        // url: `https://eljuanjo-dulces.herokuapp.com/api/v1/clients/${currentClient.id}`,
        })
      
      if (res.status === 204) {
        console.log ('El cliente fue borrado con éxito!');

        // Borro el cliente del Grid Y del State
        setClientList(clientList.filter((item) => item._id !== currentClient.id));
        setOpenSnackbar(true);
      } 
    }
    catch(err) {
      console.log(err);
    }
  }


  useEffect (() => {

    if (avoidRerenderFetchClient.current) {
      return;
    }

    if (isLoading)
      return;

    const fetchPosts = async () => {

      // solo debe de cargar datos una vez, osea al cargar la pagina
      avoidRerenderFetchClient.current = true;

      try {

        setIsLoading(true);
  
        console.log("cargar lista de clientes")
        // 1era OPCION PARA USAR AXIOS
        const res = await axios ({
          withCredentials: true,
          method: 'GET',
          url: 'http://127.0.0.1:8000/api/v1/clients'
          // url: 'https://eljuanjo-dulces.herokuapp.com/api/v1/clients'
        });
  
        setIsLoading(false);
  
        // 2da OPCION PARA USAR AXIOS
        // const res = await axios.get('http://127.0.0.1:8000/api/v1/products')
  
        // console.log(res)
        // console.log(res.data.data.data);
        setClientList(res.data.data.data)
      }
      catch(err) {
        console.log("err", err);
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [isLoading]);


  const openDeleteDialog = (id, businessName) => {
   
    setCurrentClient ({id, businessName});
    ////////////////////////////////////////////////////////////////
    // -Dialog
    ////////////////////////////////////////////////////////////////
    setOpenModal(true);

  };

  const handleEdit = (id, slug) => {
    // setClient({id: id, slug: slug});
  }

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
  


  const columns = [
    // {
    //   field: "pedido",
    //   headerName: "",
    //   width: 80,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <Link to={"/new-order/" + params.row._id}>
    //           <button className="clientListEdit" onClick={()=>handleEdit(params.row._id, params.row.slug)}>Pedido</button>
    //         </Link>
    //       </>
    //     );
    //   },
    // },
    {
      field: "action",
      headerName: "Acción",
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <>
            <Link to={"/client/" + params.row._id}>
              <button className="clientListEdit" onClick={()=>handleEdit(params.row._id, params.row.slug)}>Editar</button>
            </Link>
            {/* <DeleteOutline
              className="clientListDelete"
              onClick={() => openDeleteDialog(params.row._id, params.row.businessName)}
            /> */}
            <FaTrashAlt
              className="clientListDelete"
              onClick={() => openDeleteDialog(params.row._id, params.row.businessName)}
            />
          </>
        );
      },
    },
    { field: "sku", headerName: "SKU", width: 30, headerAlign: 'center', align: 'right',},
    {
      field: "businessName",
      headerName: "Negocio",
      width: 280,
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <div className="clientListClient">
            <img className="clientListImg" src={`/img/clients/${params.row.imageCover}`} alt="" />
            {params.row.businessName}
          </div>
        );
      },
    },
    { field: "ownerName", headerName: "Contacto", width: 160, headerAlign: 'center', },
    // { field: "email", headerName: "Email", width: 200 },
    {
      field: "cellPhone",
      headerName: "Celular",
      width: 120,
      headerAlign: 'center',
      align: 'right',
    },
    {
      field: "businessAddress",
      headerName: "Dirección",
      width: 200,
      headerAlign: 'center',
    },
    { field: "_id", headerName: "ID", width: 30, headerAlign: 'center', align: 'right', },
    // {
    //   field: "slug",
    //   headerName: "slug",
    //   width: 0,
    // },

  ];

  return (
    <div className="clientList">

      {/* 
      ////////////////////////////////////////////////////////////////
      // -Snackbar
      //////////////////////////////////////////////////////////////// */
      }
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={`${currentClient.businessName} fue borrado.`}
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
          message= {`¿Estas seguro que deseas borrar a ${currentClient.businessName}?`}
          onSubmit={handleDelete}
          captionAceptar={"Borrar"}
          captionCancelar={"Cancelar"}
        />

      <div className="clientTitleContainer">
        <h1 className="clientTitle">Catálogo de Clientes</h1>
        <Link to="/new-client">
          <button className="clientAddButton">Crear</button>
        </Link>
      </div>
      {
        clientList?.length > 0 &&
          <DataGrid
            className="dataGrid"
            rows={clientList}
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

