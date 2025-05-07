import axios from "axios";
import setenv from "../../config/setenv.js";

export async function getBCProduct (req: any, res: any) {
    const { code } = req.params as { code: string }
    if (!code) return res.status(500).json({ success: false, message: "Os campos 'code' são obrigatórios!" })
    try {
        const response = await axios.get(`https://api.cosmos.bluesoft.com.br/gtins/${code}`, {
            headers: {
                'User-Agent': 'Cosmos-API-Request',
                'Content-Type': 'application/json',
                'X-Cosmos-Token': setenv.BLA_API_KEY
            }
        })
        return res.status(200).json({
            id: response.data.gtin,
            product: response.data.description,
            desc: response.data.family_name,
            link: 'https://cosmos.bluesoft.com.br/',
            pictures: [{url: response.data.thumbnail}],
            // pictures: [response.data.thumbnail],
            value1: response.data.min_price || null,
            value2: response.data.max_price || null,
            success: true, 
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Product not found", success: false })
    }
}