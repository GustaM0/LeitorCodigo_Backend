export const generateSearchId = () => { // função que gera uma string aleatória contendo 14 caracteres
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 14; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};