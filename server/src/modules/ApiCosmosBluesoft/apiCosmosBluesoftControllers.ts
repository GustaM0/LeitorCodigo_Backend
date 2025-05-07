import express from 'express'
import { getBCProduct } from './apiCosmosBluesoftServices.js';
// Auth
import { checkUserRoles } from '../../middlewares/checkuserRoles.js';
import { generalUserRoles } from '../../middlewares/generalUserRoles.js';

const router = express.Router();

router.get("/cms/product/:code", checkUserRoles([generalUserRoles.ROOT, generalUserRoles.ADMIN, generalUserRoles.NORMAL]), getBCProduct);

export default router