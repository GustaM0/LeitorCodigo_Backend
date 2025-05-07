import jwt from 'jsonwebtoken'
import { connectDB } from '../db/datasource.js'

export const checkUserRoles = (roles: string[]) => async ( req: any, res: any, next: any ) => {
    const authorization = req.headers['authorization'] as string
    if (!authorization) {
        return res.status(401).json({ message: 'Auth required' })
    }
    const token = authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Auth required' })
    // Decode do token recebido
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT as string) as { name: string, email: string, role: string }
        if (!decoded) return res.status(401).json({ message: 'Auth required' })
        // Verificar se o usurário possui acesso pelo banco
        const db = await connectDB()
        const userdb = db.data!.users.find((u) => u.email === decoded.email)
        if (!userdb) return res.status(401).json({ message: 'User not found.' })
        req.user = userdb
        const hasRole = roles.some(role => req.user!.role.includes(role) && userdb!.role.includes(role))
        if (!hasRole) return res.status(403).json({ message: 'Acesso negado' })
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid' })
    }
}