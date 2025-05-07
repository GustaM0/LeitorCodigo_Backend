export const checkUserAuth = (req: any, res: any, next: any) => {
    const requiredFields = ['email', 'password'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ message: `Os campos ${missingFields.join(', ')} são obrigatórios!` });
    }
    next();
}
