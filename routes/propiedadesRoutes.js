import  express from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controllers/propiedadController.js"

const router = express.Router()

router.get("/mis-propiedades", admin)
router.get("/propiedades/crear", crear)
router.post("/propiedades/crear", 
  body("titulo").notEmpty().withMessage("El titulo del anuncio es Obligatorio"),
  body("descripcion")
    .notEmpty().withMessage("La descripción no pede ir vacia")
    .isLength({ max: 200}).withMessage("La descripción es muy larga"),
    body("categoria").isNumeric().withMessage("Selecciona una categoria"),
    body("precio").isNumeric().withMessage("Selecciona un ranfo de precios"),
    body("habitaciones").isNumeric().withMessage("Selecciona la cantidad de habitaciones"),
    body("estacionamiento").isNumeric().withMessage("Selecciona la cantidad de estacionamientos"),
    body("wc").isNumeric().withMessage("Selecciona la cantidad de baños"),
    body("lat").isNumeric().withMessage("selecciona la ubicación en el mapa"),
  guardar
)

export default router