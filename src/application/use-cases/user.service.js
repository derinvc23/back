const User = require('../../domain/entities/user.entity');
const { NotFoundError, ConflictError, BadRequestError } = require('../../domain/errors');
const bcrypt = require('bcryptjs');

class UserService {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    async getAllUsers() {
        return this.userRepository.getAll();
    }

    async getUserById(id) {
        const user = await this.userRepository.getById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    async createUser(userData) {
        // Verificar si el email ya existe
        const existingUser = await this.userRepository.getByEmail(userData.email);
        if (existingUser) {
            throw new ConflictError(`User with email '${userData.email}' already exists`);
        }

        // Validar y obtener IDs de roles
        const roleIds = await this.getRoleIds(userData.roles || []);

        // Hashear password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const userEntity = new User(
            null,
            userData.name,
            userData.email,
            hashedPassword,
            roleIds
        );

        return this.userRepository.create(userEntity);
    }

    async updateUser(id, userData) {
        // Verificar que el usuario existe
        const existingUser = await this.userRepository.getById(id);
        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        // Si se actualiza el email, verificar que no esté en uso
        if (userData.email) {
            const userWithSameEmail = await this.userRepository.getByEmail(userData.email);
            if (userWithSameEmail && userWithSameEmail.id !== id) {
                throw new ConflictError(`User with email '${userData.email}' already exists`);
            }
        }

        // Validar y obtener IDs de roles si se proporcionan
        const roleIds = userData.roles ? await this.getRoleIds(userData.roles) : existingUser.roles.map(r => r.id);

        // Hashear password si se proporciona
        let hashedPassword = undefined;
        if (userData.password) {
            hashedPassword = await bcrypt.hash(userData.password, 10);
        }

        const userEntity = new User(
            id,
            userData.name || existingUser.name,
            userData.email || existingUser.email,
            hashedPassword,
            roleIds
        );

        return this.userRepository.update(id, userEntity);
    }

    async deleteUser(id) {
        const existingUser = await this.userRepository.getById(id);
        if (!existingUser) {
            throw new NotFoundError('User not found');
        }
        return this.userRepository.delete(id);
    }

    // Método auxiliar para convertir nombres de roles a IDs
    async getRoleIds(roleNames) {
        if (!Array.isArray(roleNames) || roleNames.length === 0) {
            throw new BadRequestError('At least one role is required');
        }

        const roleIds = [];
        for (const roleName of roleNames) {
            const role = await this.roleRepository.getByName(roleName);
            if (!role) {
                throw new NotFoundError(`Role '${roleName}' not found`);
            }
            roleIds.push(role.id);
        }
        return roleIds;
    }
}

module.exports = UserService;
