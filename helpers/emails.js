import nodemailer from "nodemailer"

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const {email, nombre, token} = datos

  //enviar el email:
  await transport.sendMail({
    from: "Real-State.com",
    to: email,
    subject: "Confirma tu cuenta en Real-State.com",
    text: "Confirma tu cuenta en Real-State.com",
    html:`
    <p>Hola ${nombre}, comprueba tu cuenta en Real-Estate.com  </p>
    <p>
    Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a>
    </p>
    <p>Si tú no creaste esta cuenta, por favor ignora el mensaje</p>
    `
  })
}

export {
  emailRegistro
}



