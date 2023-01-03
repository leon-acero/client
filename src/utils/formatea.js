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

// Sirve para quitar estos tres caracteres: # & /
// Para poder mandar el mensaje a Whatsapp
export const formateaCaracteresEspeciales = (texto) => {
  texto = texto.replace(/#/g, 'Num. ');
  texto = texto.replace(/&/g, 'y ');
  texto = texto.replace(/\//g, '-');

  return texto;
}