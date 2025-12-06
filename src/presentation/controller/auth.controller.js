const AuthService = require('../../application/use-cases/auth.service');
const UserMongoRepository = require('../../infrastructure/repositories/database/mongo/user.mongo.repository');
const { BadRequestError } = require('../../domain/errors');

const userRepository = new UserMongoRepository();
const authService = new AuthService(userRepository);

class AuthController {
    login = async (req, res) => {
        const { email, password } = req.body;

        // Validar que email y password estén presentes
        if (!email || !password) {
            throw new BadRequestError('Email and password are required');
        }

        const result = await authService.login(email, password);
        res.status(200).json(result);
    }
}

module.exports = new AuthController();
