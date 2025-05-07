import setenv from "../../config/setenv.js"
import axios from "axios"

const responseAuth = async () => {
    const response = await axios.post(`${setenv.SALES_API_URL}/auth`, {
        email: setenv.SALES_API_USER,
        senha: setenv.SALES_API_PASSWORD
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
}
export async function getAllSalesResearch(req: any, res: any) {
    const { produtos, dataInicial, dataFinal, filial } = req.query as {produtos: string, dataInicial: string, dataFinal: string, filial: string}
    const authResponse = await responseAuth()
    try {
        const response = await axios.get(`${setenv.SALES_API_URL}/products/sales/out`, {
            params: {
                produtos,
                dataInicial,
                dataFinal,
                filial
            },
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authResponse.data.token}` }
        })
        return res.status(response.status).json(response.data)
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response)return res.status(error.response.status).json(error.response.data);
        return res.status(500).json({ message: "Erro ao buscar os dados", error: String(error) });
    }
}

export async function getAllCompanys(req: any, res: any) {
    const authResponse = await responseAuth()
    try {
        const response = await axios.get(`${setenv.SALES_API_URL}/company`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authResponse.data.token}` },
        })
        const filteredData = response.data.data.map((company: any) => ({
            id: company.id,
            codigo: company.codigo,
            cnpj: company.cnpj,
            filial: company.filial
        }))

        return res.status(response.status).json(filteredData)
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) return res.status(error.response.status).json(error.response.data);
        return res.status(500).json({ message: "Erro ao buscar os dados", error: error })
    }
}