import nodemailer from 'nodemailer';

export const emailOlvidePassword = async ( datos ) => {

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
    subject: "Restablece tu Password",
    text: "Restablece tu Password",
    html: `<p>Hola: ${ nombre }, has solicitado restablecer tu password.</p>

           <p>Sigue el siguiente elnace para generar un nuevo passowrd: <a href="${ process.env.FRONTEND_URL}/olvide-password/${ token }"> Restablecer Password </a>
           </p>
           <p>Si tu no creaste esta cuenta puede ignorar este mensaje</p>
        `
  });

  console.log("Mensaje Enviado: %s", info.messageId);
};
