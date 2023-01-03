import "./inputTypeText.css"

function InputTypeText(
  {
    label,
    placeholder,
    setItemData, 
    name, 
    value, 
    mensajeDeError, 
    title,
    pattern,
    minLength="0", 
    maxLength="20",
    isRequired=false
  }
){
  
  /************************     handleChange    *****************************/
  // Se encarga de guardar en setItemData, la informacion de cada input
  /**************************************************************************/

  function handleChange(event) {
    // console.log(event)
    const {name, value, type, checked} = event.target
    setItemData(prevFormData => {
        return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }
    })
  }

  return (
    <>
    {
      isRequired && (
        <>
          <label>{label}</label>
          <input 
            required
            className="inputTypeText"                  
            type="text"
            placeholder={placeholder}
            onChange={handleChange}
            name={name}
            value={value || ''}
            title={mensajeDeError}
            pattern={pattern}
            onInvalid={e=> e.target.setCustomValidity(mensajeDeError)} 
            onInput={e=> e.target.setCustomValidity('')} 
            minLength={minLength}
            maxLength={maxLength}
            autoComplete="off"
          />
        </>
      )
    }
    {
      !isRequired && (
        <>
          <label>{label}</label>
          <input
            className="inputTypeText"                  
            type="text"
            placeholder={placeholder}
            onChange={handleChange}
            name={name}
            value={value || ''}
            title={mensajeDeError}
            pattern={pattern}
            onInvalid={e=> e.target.setCustomValidity(mensajeDeError)} 
            onInput={e=> e.target.setCustomValidity('')} 
            minLength={minLength}
            maxLength={maxLength}
            autoComplete="off"
          />
        </>
      )
    }
    </>
  )
}

export default InputTypeText