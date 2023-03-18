import { check, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import Usuario from "../models/Usuario.js"
import { generarId } from "../helpers/tokens.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js"

  const formularioLogin = (req, res)=>{
    res.render('auth/login', {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken()
    } )
  }

  const autenticar = async(req, res)=>{
    //validacion:
    await check("email").isEmail().withMessage("El email es obligatorio").run(req);
    await check("password").notEmpty().withMessage("El password es obligatorio").run(req);

    let resultado = validationResult(req)

    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
      //errores:
      return res.render("auth/login",{
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
      })
    }

    const { email, password} = rq.body

    //Comprobar si el usuario existe: 
    const  usuario = await Usuario.findOne({ where: {email}})
    if(!usuario){
      return res.render("auth/login",{
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken(),
        errores: [{msg: "El usuario no existe"}]
      })
    }

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
      return res.render("auth/login",{
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken(),
        errores: [{msg: "El usuario no ha sido confirmado"}]
      })
    }

    //Revisar el password:
    
  }

  const formularioRegistro = (req, res)=>{
    res.render('auth/registro', {
      pagina: "Crear Cuenta",
      csrfToken : req.csrfToken()
    } )
  }

  const registrar = async(req, res)=>{
  //Validacion:
  await check("nombre").notEmpty().withMessage("El campo nombre es hobligatorio").run(req);
  await check("email").isEmail().withMessage("Asegurate de escribir bien el correo").run(req);
  await check("password").isLength({min: 6 }).withMessage("El password debe contener minimo 6 caracteres").run(req);
  await check("repetir_password").equals(req.body.password).withMessage("Los passwords no son iguales").run(req)
  
  let resultado = validationResult(req)

  // return res.json(resultado.array())
  //Verificar que el resultado este vacio
  if(!resultado.isEmpty()){
    //errores:
    return res.render("auth/registro",{
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }

  //extraer los datos:
  const { nombre, email, password } = req.body

  //Verificar que el usuario no este duplicado:
  const existeUsuario = await Usuario.findOne({where : {email}})

  if(existeUsuario){
    return res.render("auth/registro",{
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{msg: "El usuario con este email ya esta registrado"}],
      usuario: {
      nombre: req.body.nombre,
      email: req.body.email
      }
    })
  }

  //Almacenar usuario:
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId()
  })

  //Envia email de confirmacion:
  emailRegistro({
    nombre: usuario.nombre,
    email:  usuario.email,
    token:  usuario.token
  })


  //mostrar mensaje de confirmacion:
  res.render("templates/mensaje", {
    pagina: "Cuenta creada correctamente",
    mensaje: "Se te ha enviado un e-mail de confirmación, preciona en el enlace:"
  })


  }

  //funcion que comprueba una cuenta:
  const confirmar = async(req, res)=>{
    const { token } = req.params;

    //Verificar si el token es evalido:
    const usuario = await Usuario.findOne({where: {token}})



    if(!usuario){
      return res.render("auth/confirmar-cuenta",{
        pagina: "Error al confirmar tu cuenta",
        mensaje: "hubo un error al confirmar tu cuenta, intenta de nuevo",
        error: true
      })
    }

    //confirmar la cuenta
    usuario.token = null;
    usuario.confimado = true;
    await usuario.save();

    
    res.render("auth/confirmar-cuenta",{
      pagina: "Cuenta confirmada",
      mensaje: "La cuenta se confirmo correctamente",
    })

  }

  const formularioOlvidePassword = (req, res)=>{
    res.render('auth/olvide-password', {
    pagina: "Nuevo Password",
    csrfToken: req.csrfToken(),
    })
  }


  const resetPassword =async(req, res)=>{
  //Validacion:
  await check("email").notEmpty().withMessage("El campo no parce un Email").run(req);

  let resultado = validationResult(req)

  //Verificar que el resultado este vacio
  if(!resultado.isEmpty()){
    //errores:
    return res.render("auth/olvide-password",{
        pagina: "Recupera tu acceso a Real-Estate",
        csrfToken : req.csrfToken(),
        errores: resultado.array()
    })
  }
  //Buscar usuario:
  const { email } = req.body
  const usuario = await Usuario.findOne({whre: {email}})

  if(!usuario){
      return res.render("auth/olvide-password",{
        pagina: "Recupera tu acceso a Real-Estate",
        csrfToken : req.csrfToken(),
        errores: [{msg: "El email no pertenece a ningun usuario"}]
    })
  }

  //Genera un Token y enviar el email:
  usuario.token = generarId();
  await usuario.save();

  //Enviar email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token
  })

  //Renderizar un mensaje
  res.render("templates/mensaje", {
    pagina: "Reestablece tu password",
    mensaje: "Hemos enviado un email con las instrucciones"
  })

}

const comprobarToken = async(req, res)=>{
  const { token } = req.params;
  const usuario = await Usuario.findOne({where: {token}})
  if(!usuario){
    return res.render("auth/confirmar-cuenta", {
      pagina: "restablece tu password",
      mensaje: "Hubo un error al validar tu infomacion, intenta de nuevo",
      error: true
    })
  }
  //Mostrar formulario para modificar el password
  res.render("auth/reset-password", {
    pagina: "Reestablece tu password",
    csrfToken: req.csrfToken()
  })
}

const nuevoPassword = async(req, res)=>{
  //Validar Password
  await check("password").isLength({min: 6 }).withMessage("El password debe contener minimo 6 caracteres").run(req);

  let resultado = validationResult(req)

  // return res.json(resultado.array())
  //Verificar que el resultado este vacio
  if(!resultado.isEmpty()){
    //errores:
    return res.render("auth/reset-password",{
      pagina: "Reestablece tu password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    })
  }

  const { token } = req.params
  const { password } = req.body;

  //Identificar quien hace el cambio
  const usuario = await Usuario.findOne({where: {token}})


  //Hashear nuevo password
  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash( password, salt);
  usuario.token = null;

  await usuario.save();

  res.render("auth/confirmar-cuenta",{
    pagina: "password reestablecido",
    mensaje: "El password se guardo correctamente"
  })
  
}


  export {
    confirmar,
    registrar,
    formularioLogin,
    autenticar,
    formularioRegistro,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
  }