// Convierte el numero a Currency
export const formateaCurrency = (value) => {

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
  
  // console.log("format", formatter.format(value));

  return formatter.format(value);
}

// Convierte el numero a thousand
export const formateaThousand = (value) => {
  const formatter = new Intl.NumberFormat().format(value);
  
  // console.log("format", formatter.format(value));

  return formatter;
}

// Convierte la Fecha a Espaniol
export const formateaFechaEspaniol = (fecha) => {

  const formatter = new Intl.DateTimeFormat('es-ES', 
      { 
        dateStyle: 'full', 
        timeStyle: 'long' 
      }).format(fecha);
  
  // console.log("format", formatter.format(value));

  return formatter;
}

// Sirve para quitar estos tres caracteres: # & /
// Para poder mandar el mensaje a Whatsapp
export const formateaCaracteresEspeciales = (texto) => {
  texto = texto.replace(/#/g, 'Num. ');
  texto = texto.replace(/&/g, 'y ');
  texto = texto.replace(/\//g, '-');

  return texto;
}

// Sirve para formatear el texto que se manda a WhatsApp a Bold
export const formateaTextoWhatsAppABold = (texto) => {
  return `*${texto}*`;
}

// Sirve para quitar espacios en blanco, lo uso para quitar 
// los espacios en blanco de un número de celular para
// mandar el Ticket por WhatsApp
export const formateaQuitaEspaciosEnBlanco = (texto) => {
  return texto?.replace(/\s+/g,'');
}