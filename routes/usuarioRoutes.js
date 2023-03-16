import express from "express"
import { registrar, formularioLogin, formularioRegistro, formularioOlvidePassword, confirmar, resetPassword, comprobarToken, nuevoPassword } from "../controllers/usuarioController.js";


const router = express.Router();

router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/confirmar/:token', confirmar);
router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);

//Almacenar el nuevo password:
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);


export default router