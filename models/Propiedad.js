import { DataTypes } from "sequelize"
import db from "../config/db.js" 

const Propiedad = db.define("propiedades", {
  id: {
    type:DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allNull: false,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(100),
    allNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allNull: false
  },
  habitaciones: {
    type: DataTypes.INTEGER,
    allNull: false
  },
  estacionamiento: {
    type: DataTypes.INTEGER,
    allNull: false
  },
  wc: {
    type: DataTypes.INTEGER,
    allNull: false
  },
  calle: {
    type: DataTypes.STRING(60),
    allNull: false
  },
  lat: {
    type: DataTypes.STRING,
    allNull: false
  },
  lng: {
    type: DataTypes.STRING,
    allNull: false
  },
  imagen: {
    type: DataTypes.STRING,
    allNull: false
  },
  publicado: {
    type: DataTypes.BOOLEAN,
    allNull: false,
    defaultValue: false
  }
})

export default Propiedad