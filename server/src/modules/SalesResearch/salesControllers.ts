import express from "express";
import { getAllCompanys, getAllSalesResearch } from "./salesServices.js";

// Middlewares
import { checkUserRoles } from "../../middlewares/checkuserRoles.js";
import { generalUserRoles } from "../../middlewares/generalUserRoles.js";

const router = express.Router();

// GET nos produtos
router.get("/products", checkUserRoles([generalUserRoles.ROOT, generalUserRoles.NORMAL]), getAllSalesResearch);

// GET nas filiais
router.get("/company", checkUserRoles([generalUserRoles.ROOT, generalUserRoles.NORMAL]), getAllCompanys);

export default router;