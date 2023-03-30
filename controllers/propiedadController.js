import Precio from "../models/Precio.js"
import Categoria from "../models/Categoria.js"

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
    categorias,
    precios
  })
}

export {
  crear,
  admin
}