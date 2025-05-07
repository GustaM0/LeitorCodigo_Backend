import "reflect-metadata"
import cors from "cors";
import express from "express";
import setenv from "./src/config/setenv.js";

// Schedules / Rotinas
import schedule from 'node-schedule';
import { refreshTokenML } from "./src/modules/ApiMercadoLivre/apiMercadoLivreServices.js";

// Importando conexão com o banco 
// import { AppDataSource } from "./modules/datasource";

// Controllers
import configRoutes from "./src/modules/config/configControllers.js";
import usersRoutes from "./src/modules/User/userControllers.js";
import salesRoutes from "./src/modules/SalesResearch/salesControllers.js";
import mlRouter from "./src/modules/ApiMercadoLivre/apiMercadoLivreControllers.js";
import bcRouter from "./src/modules/ApiCosmosBluesoft/apiCosmosBluesoftControllers.js";

const app = express();
app.use(express.json());
const port = setenv.SERVER_PORT;

app.use(cors({
    origin: setenv.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type,Authorization']
}));

// ============== Routes ===============
app.use("/api/", configRoutes)
app.use ("/api/", usersRoutes);
app.use ("/api/", salesRoutes);
app.use ("/api/", mlRouter);
app.use ("/api/", bcRouter);
// =====================================
// ============== Rotinas ==============
// console.log(await refreshTokenML().then(({ message, success }) => ({ message, success })));
// schedule.scheduleJob('0 */5 * * *', () => {
//     refreshTokenML();
//     console.log('Auto (5h) realizado com sucesso!');
// });
// =====================================

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// =========== Connection DB ===========
// AppDataSource.initialize()
//     .then(() => {
        
//         console.log("Successfully connected to the database");
//     })
//     .catch((error) => {
//         console.log("Error connecting to the database: ", error);
//     });

// =====================================

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});