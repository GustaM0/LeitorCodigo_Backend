import express from 'express';
import { checkUserRoles } from '../../middlewares/checkuserRoles.js';
import { generalUserRoles } from '../../middlewares/generalUserRoles.js';
import { addNewSystemConfig } from './configServices.js';
import { checkNewConfigPayload } from '../../middlewares/payloads/configPayloads/checkNewConfig.js';

const router = express.Router();

// Adiciona uma nova configuração de sistema
router.post("/addnewsystem/description", checkUserRoles([generalUserRoles.ROOT]), checkNewConfigPayload, addNewSystemConfig )

export default router;