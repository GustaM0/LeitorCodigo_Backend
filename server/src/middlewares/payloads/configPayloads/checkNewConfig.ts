export const checkNewConfigPayload = (req: any, res: any, next: any) => {
    const { id, desc, group, value } = req.body as { id: string, desc: string, group: number, value: string };
    const requiredFields = ['id', 'desc', 'group', 'value'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ message: `Os campos ${missingFields.join(', ')} são obrigatórios!` });
    }
    const idRegex = /^[a-zA-Z_]*$/;
    if (!idRegex.test(id)) {
        return res.status(400).json({ message: 'Id não deve conter números' });
    }
    if (desc.length < 3) {
        return res.status(400).json({ message: 'Descrição deve ter pelo menos 3 caracteres' });
    }
    if (isNaN(group) || group < 1) {
        return res.status(400).json({ message: 'Grupo deve ser um número maior que 0' });
    }

    next();
};