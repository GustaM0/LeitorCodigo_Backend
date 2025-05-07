
import { connectDB } from '../../db/datasource.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import setenv from '../../config/setenv.js'

// Cadastrar usuário
export async function registerUser(req: any, res: any) {
    const { name, password, email, role } = req.body
    const db = await connectDB()

    const existingUser = db.data!.users.find(u => u.email === email)
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Usuário já existe.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    db.data!.users.push({ name, email, password: hashedPassword, role: role || '0' })
    await db.write()

    return res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!' })
}

// Login
export async function loginUser(req: any, res: any) {
    const {  email, password } = req.body
    const db = await connectDB()
    const user = db.data!.users.find(u => u.email === email)

    if (!user) return res.status(404).json({ success: false, message: 'Senha ou email Incorretos' })
    const match = await bcrypt.compare(password, user.password)

    if (!match) return res.status(401).json({ success: false, message: 'Senha ou email Incorretos' })

    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, setenv.SECRET_KEY_JWT as string, { expiresIn: '3h' })

    return res.status(200).json({ success: true, message: 'Login bem-sucedido!', token })
}

// Listar Usuários
export async function getAllUsers(req: any, res: any) {
    const db = await connectDB()
    return res.status(200).json(db.data!.users)
}

// Retornar informaçoes do usuário pelo TOKEN
export async function getUserByToken(req: any, res: any) {
    const { token } = req.body
    if (!token) return res.status(401).json({ success: false, message: 'Token não fornecido' })
    try {
        const decoded = jwt.verify(token, setenv.SECRET_KEY_JWT as string)
        const db = await connectDB()
        const user = db.data!.users.find(u => u.email === (decoded as any).email)
        if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado' })
        const { password, ...userWithoutPassword } = user
        return res.status(200).json({ success: true, user: userWithoutPassword })
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid' })
    }
}