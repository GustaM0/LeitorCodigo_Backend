import express from "express";
import { getAllUsers, getUserByToken, loginUser, registerUser } from "./userServices.js";
// Payloads
import { checkUserAuth } from "../../middlewares/payloads/UserPayloads/checkUserAuth.js";
import { checkNewUserPayload } from "../../middlewares/payloads/UserPayloads/checkUserRegister.js";
// Middlewares
import { checkUserRoles } from "../../middlewares/checkuserRoles.js";
import { generalUserRoles } from "../../middlewares/generalUserRoles.js";

const router = express.Router();

// Retornar informaçoes do usuário pelo TOKEN
router.post("/finduser", getUserByToken);

// Novo usuário
router.post("/users/new", checkUserRoles([generalUserRoles.ROOT]), checkNewUserPayload, registerUser);

// Request todo os usuários
router.get("/users/all", checkUserRoles([generalUserRoles.ROOT]), getAllUsers);

// Login
router.post("/users/auth", checkUserAuth, loginUser);

export default router