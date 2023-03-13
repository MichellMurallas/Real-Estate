import { check, validationResult } from "express-validator"
import Usuario from "../models/Usuario.js"

const formularioLogin = (req, res)=>{
  res.render('auth/login', {
    pagina: "Iniciar Sesión"
  } )
}

const formularioRegistro = (req, res)=>{
  res.render('auth/registro', {
    pagina: "Crear Cuenta"
  } )
}

const registrar = async(req, res)=>{
  //Validacion:
  await check("nombre").notEmpty().withMessage("El campo nombre es hobligatorio").run(req);
  await check("email").isEmail().withMessage("Asegurate de escribir bien el correo").run(req);
  await check("password").isLength({min: 6 }).withMessage("debe contener minimo 6 caracteres").run(req);
  await check("repetir_password").equals("password").withMessage("Los passwords no son iguales").run(req)
  
  let resultado = validationResult(req)

  // return res.json(resultado.array())
  //Verificar que el resultado este vacio
  if(!resultado.isEmpty()){
    //errores:
    return res.render("auth/registro",{
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }


  const usuario = await Usuario.create(req.body)

  res.json(usuario)
}

const formularioOlvidePassword = (req, res)=>{
  res.render('auth/olvide-password', {
    pagina: "Nuevo Password"
  } )
}

export {
  registrar,
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword
}