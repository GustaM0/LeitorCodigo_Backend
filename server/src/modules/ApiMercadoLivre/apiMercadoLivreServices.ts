import axios from "axios";
import setenv from "../../config/setenv.js";
import { connectDB } from "../../db/datasource.js";

export async function getMLProductId(req: any, res: any) {
    const { product_id } = req.query as { product_id: number }
    try {
        const db = await connectDB()
        const mlAccessKey = db.data!.systemConfig.find((u) => u.id === "ACCESS_TOKEN_APP_ML")?.value
        const reponseId = await axios.get(`https://api.mercadolibre.com/products/search`, {
            params: {
                status: "active",
                site_id: "MLB",
                product_identifier: product_id
            },
            headers: { 'Authorization': `Bearer ${mlAccessKey}` }
        })
        const idMercadoLivre = reponseId.data.results.length > 0 ? reponseId.data.results[0].id : null;
        if (!idMercadoLivre) {
            return res.status(200).json({ message: "Nenhum produto encontrado", success: false })
        }
        const response = await axios.get(`https://api.mercadolibre.com/products/${idMercadoLivre}`, {
            params: {
                attributes: "all"
            },
            headers: { 'Authorization': `Bearer ${mlAccessKey}` }
        })
        return res.status(200).json({ 
            id: response.data.id,
            product: response.data.name,
            desc: response.data.family_name,
            link: response.data.permalink,
            pictures: response.data.pictures?.map((picture: any) => ({
                url: picture.url,
                max_width: picture.max_width,
                max_height: picture.max_height,
            })) || [],
            value1: response.data.buy_box_winner?.price || null,
            value2: response.data.buy_box_winner?.original_price || null,
            success: true,
        })
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) return res.status(401).json({ message: "ML não autorizado", status: 401, success: false })
        return res.status(500).json({ error: "Erro ao buscar o produto", success: false, err: error })
    }
}

export async function testAuthMl(req: any, res: any) {
    try {
        const response = await testAuthMLWorker()
        if (response.success === false) {
            return res.status(200).json({ message: response.message, success: false })
        }
        const userInfo = {
            nickname: response.data.nickname,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            email: response.data.email,
        }
        return res.status(200).json({ data: userInfo, message: response.message, success: true })
    } catch (error) {
        return res.status(500).json({ message: "Auth required - Error", success: false})
    }
}

// REFRESH TOKEN MERCADO LIVRE
export async function authUserML(req: any, res: any) {
    const { code } = req.query as { code: string, code_verifier: string }
    try {
        const db = await connectDB()
        const response = await axios.post(`https://api.mercadolibre.com/oauth/token`, null, {
            params: {
                client_id: setenv.ML_APP_ID,
                client_secret: setenv.ML_APP_SECRET,
                grant_type: "authorization_code",
                redirect_uri: setenv.ML_APP_REDIRECT_URI,
                code
            }
        })
        const { access_token, refresh_token } = response.data
        db.data!.systemConfig.find((u) => u.id === "ML_ACCESS_KEY")!.value = access_token
        db.data!.systemConfig.find((u) => u.id === "ML_REFRESH_KEY")!.value = refresh_token
        await db.write()
        return res.status(200).json({ message: "Auth success", success: true, data: response.data })
    } catch (error) {
        return res.status(500).json({ message: "Auth failed", success: false, err: error })
    }
}

export async function getMlAplicationId(req: any, res: any) {
    try {
        const db = await connectDB()
        const redirectUri = db.data!.systemConfig.find((u) => u.id === "REDIRECT_URI_APP_ML")!.value
        const urlAuth = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${setenv.ML_APP_ID}&redirect_uri=${redirectUri}`
        return res.status(200).json({ success: true, url: urlAuth })
    } catch (error) {
        return res.status(500).json({ message: "Url unavailable", success: false })
    }
}

// NEW TOKEN MERCADO LIVRE
export async function postNewTokenMl(req: any, res: any) {
    const { code } = req.body
    if (!code) return res.status(500).json({ success: false, message: "Os campos 'code' são obrigatórios!" })
    try {
        const db = await connectDB()
        const redirectUri = db.data!.systemConfig.find((u) => u.id === "REDIRECT_URI_APP_ML")!.value
        const response = await axios.post(`https://api.mercadolibre.com/oauth/token`, null, {
            params: {
                grant_type: "authorization_code",
                client_id: setenv.ML_APP_ID,
                client_secret: setenv.ML_APP_SECRET,
                code,
                redirect_uri: redirectUri
            }
        })
        const { access_token, refresh_token } = response.data
        db.data!.systemConfig.find((u) => u.id === "ACCESS_TOKEN_APP_ML")!.value = access_token
        db.data!.systemConfig.find((u) => u.id === "CHAVE_USUARIO_APP_ML")!.value = refresh_token
        await db.write()
        return res.status(200).json({ message: "Auth success", success: true })
    } catch (error: unknown) {
        console.log(error)
        return res.status(500).json({ message: "Auth failed", success: false })
    }
}

// ====================== Functions ======================
async function testAuthMLWorker() {

    try {
        const db = await connectDB()
        const mlAccessKey = db.data!.systemConfig.find((u) => u.id === "ACCESS_TOKEN_APP_ML")?.value
        const response = await axios.get(`https://api.mercadolibre.com/users/me`, {
            headers: { 'Authorization': `Bearer ${mlAccessKey}` }
        })
        return { data: response.data, status: 200,message: "Verified", success: true }
    } catch (error) {
        return { error: error, status: 200, message: "Auth required", success: false }
    }
}

export async function refreshTokenML() {
    try {
        const db = await connectDB()
        const mlUserCode = db.data!.systemConfig.find((u) => u.id === "CHAVE_USUARIO_APP_ML")?.value
        const response = await axios.post(`https://api.mercadolibre.com/oauth/token`, {
            grant_type: "refresh_token",
            client_id: setenv.ML_APP_ID,
            client_secret: setenv.ML_APP_SECRET,
            refresh_token: mlUserCode
        })
        const { access_token } = response.data
        db.data!.systemConfig.find((u) => u.id === "ACCESS_TOKEN_APP_ML")!.value = access_token
        await db.write()
        return { message: "Token refreshed", success: true, data: response.data }
    } catch (error) {
        return { err: error,  message: "Error refreshing token", success: false }
    }
}