import nodemailer from 'nodemailer';

export const emailRegistro = async ( datos ) => {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Enviar el Email
  const { email, nombre, token } = datos;
  
  const info = await transporter.sendMail({
    from: "Administrador de Pacientes de Veterinaria",
    to: email,
    subject: "Comprueba tu cuenta en APV",
    text: "Comprueba tu cuenta en APV",
    html: `<p>Hola: ${ nombre }, comprueba tu cuenta en APV.</p>
           <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente     enlace: <a href="${ process.env.FRONTEND_URL}/confirmar/${ token }"> Comprobar Cuenta </a>
           </p>
           <p>Si tu no creaste esta cuenta puede ignorar este mensaje</p>
        `
  });

  console.log("Mensaje Enviado: %s", info.messageId);
};
