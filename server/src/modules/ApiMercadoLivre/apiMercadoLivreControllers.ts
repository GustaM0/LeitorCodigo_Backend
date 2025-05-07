import express from 'express';

// Middlewares
import { checkUserRoles } from "../../middlewares/checkuserRoles.js";
import { generalUserRoles } from "../../middlewares/generalUserRoles.js";
import { getMlAplicationId, getMLProductId, postNewTokenMl, testAuthMl } from './apiMercadoLivreServices.js';

const router = express.Router();

// Buscar produto no MercadoLivre
router.get("/products/ml", checkUserRoles([generalUserRoles.ROOT, generalUserRoles.ADMIN]), getMLProductId);

// Verificar conta MercadoLivre, Retorna info da conta
router.get("/ml/verify", checkUserRoles([generalUserRoles.ROOT, generalUserRoles.ADMIN]), testAuthMl);

// Retorna url de autenticação (Aplicação MercadoLivre)
router.get("/ml/getaplication", checkUserRoles([generalUserRoles.ROOT, generalUserRoles.ADMIN]), getMlAplicationId);

// Recebe o CODE para nova autenticação
router.post("/ml/auth/authorize", checkUserRoles([generalUserRoles.ROOT, generalUserRoles.ADMIN]), postNewTokenMl);

export default router;