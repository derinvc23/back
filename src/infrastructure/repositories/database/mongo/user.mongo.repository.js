const UserRepository = require('../../../../domain/repositories/user.repository.interface');
const UserModel = require('./models/user.model');
const User = require('../../../../domain/entities/user.entity');

class UserMongoRepository extends UserRepository {
    async getAll() {
        const users = await UserModel.find().populate('roles').select('-password');
        return users.map(u => new User(
            u._id.toString(),
            u.name,
            u.email,
            undefined, // No incluir password
            u.roles.map(r => ({ id: r._id.toString(), name: r.name }))
        ));
    }

    async getById(id) {
        const user = await UserModel.findById(id).populate('roles').select('-password');
        if (!user) return null;
        return new User(
            user._id.toString(),
            user.name,
            user.email,
            undefined, // No incluir password
            user.roles.map(r => ({ id: r._id.toString(), name: r.name }))
        );
    }

    async getByEmail(email) {
        const user = await UserModel.findOne({ email }).populate('roles');
        if (!user) return null;
        return new User(
            user._id.toString(),
            user.name,
            user.email,
            user.password, // SÍ incluir password para login
            user.roles.map(r => ({ id: r._id.toString(), name: r.name }))
        );
    }

    async create(userEntity) {
        const newUser = new UserModel({
            name: userEntity.name,
            email: userEntity.email,
            password: userEntity.password,
            roles: userEntity.roles
        });
        const savedUser = await newUser.save();
        const populatedUser = await UserModel.findById(savedUser._id).populate('roles').select('-password');
        return new User(
            populatedUser._id.toString(),
            populatedUser.name,
            populatedUser.email,
            undefined,
            populatedUser.roles.map(r => ({ id: r._id.toString(), name: r.name }))
        );
    }

    async update(id, userEntity) {
        const updateData = {
            name: userEntity.name,
            email: userEntity.email,
            roles: userEntity.roles
        };

        // Solo actualizar password si se proporciona
        if (userEntity.password) {
            updateData.password = userEntity.password;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('roles').select('-password');

        if (!updatedUser) return null;
        return new User(
            updatedUser._id.toString(),
            updatedUser.name,
            updatedUser.email,
            undefined,
            updatedUser.roles.map(r => ({ id: r._id.toString(), name: r.name }))
        );
    }

    async delete(id) {
        await UserModel.findByIdAndDelete(id);
    }
}

module.exports = UserMongoRepository;
