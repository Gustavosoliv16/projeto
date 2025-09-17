import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Acesso negado. Nenhum token fornecido." });
    }

    const token = authHeader.split(' ')[1];
    const secret = "uma-chave-secreta-bem-forte-para-testes";

    try {
        const decoded = jwt.verify(token, secret);
        
        if (decoded.tipo_usuario !== 'administrador') {
            return res.status(403).json({ error: "Acesso proibido. Requer privilégios de administrador." });
        }

        req.user = decoded;
        next();

    } catch {
        return res.status(401).json({ error: "Token inválido ou expirado."});

    }
};