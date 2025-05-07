import { Low, JSONFile } from 'lowdb'
import  { DatabaseSchema } from './interfaces.js'

// Caminho para o JSON
const adapter = new JSONFile<DatabaseSchema>('server/src/assets/db/db.json')
const db = new Low<DatabaseSchema>(adapter)

export async function connectDB() {
    await db.read()
    db.data ||= { users: [], systemConfig: [] }
    // db.data ||= {}
    // db.data.users ||= []
    // db.data.systemConfig ||= []
    return db
}
