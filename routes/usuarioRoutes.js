import express from "express"
import { registrar, formularioLogin, formularioRegistro, formularioOlvidePassword, confirmar, resetPassword } from "../controllers/usuarioController.js";


const router = express.Router();

router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/confirmar/:token', confirmar);
router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);


export default router