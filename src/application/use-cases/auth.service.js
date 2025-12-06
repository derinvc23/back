const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../../domain/errors');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async login(email, password) {
        // Buscar usuario por email (incluye password)
        const user = await this.userRepository.getByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Comparar password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Generar JWT
        const roleNames = user.roles.map(r => r.name);
        const token = jwt.sign(
            {
                id: user.id,
                roles: roleNames
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Retornar token y datos del usuario (sin password)
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: roleNames
            }
        };
    }
}

module.exports = AuthService;
