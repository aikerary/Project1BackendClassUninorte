import bcrypt from 'bcryptjs';
import { UserModel } from '../../models/users/user.model.js';
import { generateToken } from '../../config/auth.js';

interface LoginDTO {
  email: string;
  password: string;
}

export class ReadUserAction {
  async login(data: LoginDTO) {
    const user = await UserModel.findOne({ email: data.email, isActive: true });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

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

  async getUserById(userId: string) {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
