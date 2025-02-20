import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Acesso negado. Token não fornecido."
        });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Verifica se o usuário é o administrador
        if (req.user.role == 'admin') {
            return res.status(403).json({
                success: false,
                message: "Acesso negado. Somente o administrador pode acessar esta rota."
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token inválido ou expirado."
        });
    }
};

export default authMiddleware;
