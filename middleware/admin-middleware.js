import User from '../models/user-model.js';
import { ForbiddenError } from '../errors/index.js';

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (user.role !== 1) {
      next(new ForbiddenError('웹페이지를 볼 수 있는 권한이 없습니다.'));
    }
    next();
  } catch (error) {
    next(new Error(err));
  }
};

export default authAdmin;
