import bcrypt from 'bcryptjs';
import { UserModel, IUser } from '../../models/users/user.model.js';
import { generateToken } from '../../config/auth.js';

interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

export class CreateUserAction {
  async execute(data: CreateUserDTO) {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await UserModel.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      permissions: []
    });

    const token = generateToken(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        permissions: user.permissions
      },
      token
    };
  }
}
