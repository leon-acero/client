import CalendarToday from "@mui/icons-material/CalendarToday";
// import LocationSearching from "@mui/icons-material/LocationSearching";
import MailOutline from "@mui/icons-material/MailOutline";
import PermIdentity from "@mui/icons-material/PermIdentity";
import PhoneAndroid from "@mui/icons-material/PhoneAndroid";
import Publish from "@mui/icons-material/Publish";
import { useEffect, useState } from 'react';

import { Link, useParams } from "react-router-dom";
import "./user.css";
import axios from "axios";
// import { stateContext } from '../../context/StateProvider';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function User() {

  // const { client } = useContext(stateContext);

  // imageCover
  const [file, setFile] = useState(null);
  const [mensajeSnackBar, setMensajeSnackBar] = useState("");

  const [data, setData] = useState(
    {
        ownerName: "", 
        businessName: "", 
        businessAddress: "",
        cellPhone: "", 
        fixedPhone: "",
        email: "", 
        esMayorista: false,
        // imageCover: ""
    }
)

const {userId } = useParams();
const [openSnackbar, setOpenSnackbar] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
          // console.log("imageCover", file)
          // console.log("imageCover", file.name)

          const formData = new FormData();
          
          formData.append("ownerName", data.ownerName);
          formData.append("businessName", data.businessName);
          formData.append("businessAddress", data.businessAddress);
          formData.append("cellPhone", data.cellPhone);
          formData.append("fixedPhone", data.fixedPhone);
          formData.append("email", data.email);
          formData.append("esMayorista", data.esMayorista);
          formData.append("photo", file);
          // formData.append("imageCover", file.name);

          const res = await axios({
            withCredentials: true,
            method: 'PATCH',
            url: `http://127.0.0.1:8000/api/v1/clients/${userId}`,
            data: formData
          })

          // const res = await axios.patch(`http://127.0.0.1:8000/api/v1/clients/${userId}`, formData, {
          //   headers: {
          //     "content-type": "multipart/form-data",
          //   },
          // });

          // const res = await axios({
          //   method: 'PATCH',
          //   url: `http://127.0.0.1:8000/api/v1/clients/${userId}`,
          //   data: {
          //         ownerName: data.ownerName, 
          //         businessName: data.businessName, 
          //         businessAddress: data.businessAddress,
          //         cellPhone: data.cellPhone, 
          //         fixedPhone: data.fixedPhone,
          //         email: data.email, 
          //         esMayorista: data.esMayorista,
          //         imageCover: "" ,
          //   }})

          if (res.data.status === 'success') {
            // alert ('Logged in succesfully!');
              // console.log(res.data.data.data);
              console.log ('El cliente fue actualizado con éxito!');
              setMensajeSnackBar("Cliente actualizado")
              setOpenSnackbar(true);

          } 
      }
      catch(err) {
        console.log(err);
        setMensajeSnackBar("Hubo un error al grabar el cliente")
        setOpenSnackbar(true);
      }
  }

  useEffect (() => {
    const fetchPosts = async () => {
      const res = await axios ({
        withCredentials: true,
        method: 'GET',
        url: `http://127.0.0.1:8000/api/v1/clients/${userId}`
      });
      // console.log(res.data.data.data);
      setData(res.data.data.data)
    }

    fetchPosts();
   
  }, [userId]);


  function handleChange(event) {
    // console.log(event)
    const {name, value, type, checked} = event.target
    setData(prevFormData => {
        return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }
    })
  }

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

  return (
    <div className="user">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={mensajeSnackBar}
        action={action}
      />

      <div className="userTitleContainer">
        <h1 className="userTitle">Editar Cliente</h1>
        <Link to="/newUser">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={`/img/clients/${data.imageCover}`}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{data.businessName}</span>
              <span className="userShowUserTitle">{data.ownerName}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Detalle</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{data.businessAddress}</span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">{data.esMayorista ? "Es Mayorista" : "Es Minorista"}</span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">{data.slug}</span>
            </div>           

            <span className="userShowTitle">Contacto</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">{data.cellPhone}</span>
            </div>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">{data.fixedPhone}</span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{data.email}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Editar</span>

          <form className="userUpdateForm" onSubmit={handleSubmit}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Negocio *</label>
                <input
                  type="text"
                  placeholder={data.businessName}
                  className="userUpdateInput"                  
                  onChange={handleChange}
                  name="businessName"
                  value={data.businessName || ''}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El Nombre del Negocio debe tener entre 5 y 80 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  minLength="5"
                  maxLength="80"
                />
              </div>
              <div className="userUpdateItem">
                <label>Contacto *</label>
                <input
                  type="text"
                  placeholder={data.ownerName}
                  className="userUpdateInput"
                  onChange={handleChange}
                  name="ownerName"
                  value={data.ownerName || ''}
                  required
                  onInvalid={e=> e.target.setCustomValidity('El Nombre del Contacto debe tener entre 5 y 80 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  minLength="5"
                  maxLength="80"
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="email"
                  placeholder={data.email}
                  className="userUpdateInput"
                  onChange={handleChange}
                  name="email"
                  value={data.email || ''}                  
                />
              </div>
              <div className="userUpdateItem">
                <label>Celular</label>
                <input
                  type="text"
                  placeholder={data.cellPhone}
                  className="userUpdateInput"
                  onChange={handleChange}
                  name="cellPhone"
                  value={data.cellPhone || ''}  
                  onInvalid={e=> e.target.setCustomValidity('El Número de Celular debe ser menor a 20 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  maxLength="20"                
                />
              </div>
              <div className="userUpdateItem">
                <label>Teléfono Fijo</label>
                <input
                  type="text"
                  placeholder={data.fixedPhone}
                  className="userUpdateInput"
                  onChange={handleChange}
                  name="fixedPhone"
                  value={data.fixedPhone || ''} 
                  onInvalid={e=> e.target.setCustomValidity('El Número de Teléfono debe ser menor a 20 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  maxLength="20"                                   
                />
              </div>              
              <div className="userUpdateItem">
                <label>Dirección</label>
                <input
                  type="text"
                  placeholder={data.businessAddress}
                  className="userUpdateInput"
                  onChange={handleChange}
                  name="businessAddress"
                  value={data.businessAddress || ''}   
                  onInvalid={e=> e.target.setCustomValidity('La Dirección debe tener menos de 100 caracteres')} 
                  onInput={e=> e.target.setCustomValidity('')} 
                  maxLength="100"               
                />
              </div>
              
              <div className="userUpdateItem">
                <label htmlFor="esMayorista">¿Es Mayorista?</label>
                <input 
                    type="checkbox" 
                    id="esMayorista" 
                    checked={data.esMayorista}
                    onChange={handleChange}
                    name="esMayorista"
                    value={data.esMayorista}
                />
              </div>
              {/* <div className="userUpdateItem">
                <label>Es Mayorista</label>
                <select className="newUserSelect" name="esmayorista" id="esmayorista">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div> */}

              {/* <input
                type="text"
                placeholder={data.imageCover}
                onChange={handleChange}
                name="imageCover"
                value={data.imageCover}
            /> */}
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src={`/img/clients/${data.imageCover}`}
                  alt=""
                />
                <label htmlFor="photo">
                  <Publish className="userUpdateIcon" />
                </label>
                <input  type="file" 
                        accept="image/*" 
                        id="photo" 
                        name="photo" 
                        style={{ display: "none" }} 
                        onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button className="userUpdateButton">Actualizar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
