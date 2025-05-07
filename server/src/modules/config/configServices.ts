import axios from "axios";
import { connectDB } from "../../db/datasource.js";
import { generateSearchId } from "../../utils/generateRandom.js";

export async function addNewSystemConfig(req: any, res: any) {
    const { id, desc, group, value } = req.body as { id: string, desc: string, group: number, value: string };
    const idUpper = (id.normalize("NFD").replace(/[^a-zA-Z]/g, "_")).toUpperCase()
    try {
        const db = await connectDB()
        const existConfig = db.data!.systemConfig.find(u => u.id === idUpper)
        if (existConfig) {
            return res.status(400).json({ message: `Configuração já existe: ${id}`, success: false })
        }
        let searchId: string;
        do {
            searchId = generateSearchId();
        } while (db.data!.systemConfig.some( u => u.id.startsWith(searchId.substring(0, 6)) ));
        const newConfig = {
            // search_id: 'aba',
            search_id: searchId,
            id: idUpper,
            desc: desc,
            group: group,
            value: value
        }
        db.data!.systemConfig.push(newConfig)
        await db.write()

        return res.status(200).json({ message: "Configuração criada com sucesso", success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro ao criar configuração", success: false, err: error })
    }
}

// ==================== Functions ==================== //
export async function putSystemValueConfig(id: string, newValue: string) {
    try {
        const db = await connectDB()
        const config = db.data!.systemConfig.find(u => u.id === id);
        if (!config) {
            return { message: "Configuração não encontrada", success: false };
        }
        config.value = newValue;
        await db.write();
        return { message: "Configuração atualizada com sucesso", success: true };
    } catch (error) {
        return { error: error, message: "Erro ao atualizar configuração", success: false };
    }
}