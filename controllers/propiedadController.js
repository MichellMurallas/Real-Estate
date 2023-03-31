import { validationResult } from "express-validator"
import { Precio, Categoria, Propiedad } from "../models/index.js"

const admin = (req, res) =>{
  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
    barra: true
  })
}

//Formulario para crear propiedad:
const crear = async(req, res) =>{
  //Consultar modelo de precio y categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {}
  })
}

const guardar = async(req, res) =>{
  //Validacion:
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    //Consultar modelo de precio y categorias
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ])

    return   res.render("propiedades/crear", {
      pagina: "Crear Propiedad",
      barra: true,
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body
    })
  }

  //Crear registro:
  const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body

  try {
    const propiedadGuardada = await Propiedad({
      titulo,
      descripcion, 
      habitaciones, 
      estacionamiento, 
      wc, 
      calle, 
      lat, 
      lng,
      precioId,
      categoriaId
    })
  } catch (error) {
    
  }


  console.log(req.body)
}

export {
  crear,
  admin,
  guardar
}