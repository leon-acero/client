import "./userList.css";

// REACT
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { useContext} from "react";
// import { stateContext } from '../../context/StateProvider';

// MATERIAL UI
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
// import { userRows } from "../../dummyData";

import BasicDialog from '../../../../components/basicDialog/BasicDialog';

////////////////////////////////////////////////////////////////
// -Snackbar
////////////////////////////////////////////////////////////////
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// HTTP
import axios from "axios";


export default function UserList() {

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

  // const { setClient} = useContext(stateContext)

  const handleDelete = async () => {
    setOpenModal(false);

    try {
      const res = await axios({
        withCredentials: true,
        method: 'DELETE',
        url: `http://127.0.0.1:8000/api/v1/clients/${currentClient.id}`,
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
    const fetchPosts = async () => {

      // 1era OPCION PARA USAR AXIOS
      const res = await axios ({
        withCredentials: true,
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/clients'
      });

      // 2da OPCION PARA USAR AXIOS
      // const res = await axios.get('http://127.0.0.1:8000/api/v1/products')

      // console.log(res)
      // console.log(res.data.data.data);
      setClientList(res.data.data.data)
    }
    fetchPosts();
  }, []);


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
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  ////////////////////////////////////////////////////////////////
  


  const columns = [
    {
      field: "pedido",
      headerName: "",
      width: 80,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user-pedido/" + params.row._id}>
              <button className="userListEdit" onClick={()=>handleEdit(params.row._id, params.row.slug)}>Pedido</button>
            </Link>
          </>
        );
      },
    },
    { field: "_id", headerName: "ID", width: 70 },
    {
      field: "businessName",
      headerName: "Negocio",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={`/img/clients/${params.row.imageCover}`} alt="" />
            {params.row.businessName}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "cellPhone",
      headerName: "Celular",
      width: 120,
    },
    {
      field: "businessAddress",
      headerName: "Dirección",
      width: 160,
    },
    {
      field: "slug",
      headerName: "slug",
      width: 20,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row._id}>
              <button className="userListEdit" onClick={()=>handleEdit(params.row._id, params.row.slug)}>Editar</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => openDeleteDialog(params.row._id, params.row.businessName)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">

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

      <DataGrid
        rows={clientList}
        disableSelectionOnClick
        columns={columns}
        rowsPerPageOptions={[5, 8, 10]}
        pageSize={8}
        // checkboxSelection
      />
    </div>
  );
}

