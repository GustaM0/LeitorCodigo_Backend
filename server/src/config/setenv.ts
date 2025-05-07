import dotenv from 'dotenv';

dotenv.config();

export default {
    SERVER_PORT: process.env.SERVER_PORT || 3000,
    SECRET_KEY_JWT: process.env.SECRET_KEY_JWT,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    // Conexão com API Sales
    SALES_API_URL: '',
    SALES_API_USER: '',
    SALES_API_PASSWORD: '',

    // Mercado Livre Aplication
    ML_APP_ID: process.env.ML_APP_ID,
    ML_APP_SECRET: process.env.ML_APP_SECRET,
    ML_APP_REDIRECT_URI: process.env.ML_APP_REDIRECT_URI,

    // Bluesoft Cosmos API
    BLA_API_KEY: process.env.BLUESOFT_COSMOS_APIKEY,

    // Access Mercado Livre TESTE
    ML_ACCESS_KEY: process.env.ML_ACCESS_KEY,
}