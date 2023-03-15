import { check, validationResult } from "express-validator"
import Usuario from "../models/Usuario.js"
import { generarId } from "../helpers/tokens.js"
import { emailRegistro } from "../helpers/emails.js"

  const formularioLogin = (req, res)=>{
    res.render('auth/login', {
      pagina: "Iniciar Sesión"
    } )
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
    pagina: "Nuevo Password"
    })
  }


  export {
    confirmar,
    registrar,
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
  }