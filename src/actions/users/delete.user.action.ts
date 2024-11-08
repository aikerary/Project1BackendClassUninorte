import { UserModel } from '../../models/users/user.model.js';

export class DeleteUserAction {
  async execute(userId: string) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isActive: false } },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return true;
  }
}
