const Role = require('../../domain/entities/role.entity');
const { NotFoundError, ConflictError } = require('../../domain/errors');

class RoleService {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }

    async getAllRoles() {
        return this.roleRepository.getAll();
    }

    async getRoleById(id) {
        const role = await this.roleRepository.getById(id);
        if (!role) {
            throw new NotFoundError('Role not found');
        }
        return role;
    }

    async createRole(roleData) {
        // Verificar si ya existe un rol con ese nombre
        const existingRole = await this.roleRepository.getByName(roleData.name);
        if (existingRole) {
            throw new ConflictError(`Role with name '${roleData.name}' already exists`);
        }

        const roleEntity = new Role(null, roleData.name);
        return this.roleRepository.create(roleEntity);
    }

    async updateRole(id, roleData) {
        // Verificar que el rol existe
        const existingRole = await this.roleRepository.getById(id);
        if (!existingRole) {
            throw new NotFoundError('Role not found');
        }

        // Verificar si el nuevo nombre ya está en uso por otro rol
        const roleWithSameName = await this.roleRepository.getByName(roleData.name);
        if (roleWithSameName && roleWithSameName.id !== id) {
            throw new ConflictError(`Role with name '${roleData.name}' already exists`);
        }

        const roleEntity = new Role(id, roleData.name);
        return this.roleRepository.update(id, roleEntity);
    }

    async deleteRole(id) {
        const existingRole = await this.roleRepository.getById(id);
        if (!existingRole) {
            throw new NotFoundError('Role not found');
        }
        return this.roleRepository.delete(id);
    }
}

module.exports = RoleService;
