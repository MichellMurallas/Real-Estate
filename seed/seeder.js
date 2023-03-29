import categorias from "./categorias.js";
import { exit } from "node:process"
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";
import db from "../config/db.js";
import precios from "./precios.js";

const importarDatos = async()=>{
  try {
    //Autenticar
    await db.authenticate()

    //Generar las columnas:
    await db.sync()

    //Insertar datos:
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios)
    ])



    console.log("Datos importados correctamente")
    exit()


  } catch (error) {
    console.log(error)
    exit(1)
  }
}

if(process.argv[2] === "-i"){
  importarDatos()
}
