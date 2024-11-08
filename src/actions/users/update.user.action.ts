import { UserModel } from '../../models/users/user.model.js';

export class UpdateUserAction {
  async execute(userId: string, updates: Partial<any>) {
    delete updates.password;
    
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
