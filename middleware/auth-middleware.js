import jwt from 'jsonwebtoken';

import User from '../models/user-model.js';

import { NotFoundError, UnAuthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    next(new UnAuthenticatedError('이 경로에 액세스할 수 있는 권한이 없습니다.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(decoded);
    const user = await User.findById(decoded.id);

    if (!user) {
      next(new NotFoundError('유저를 찾을 수 없습니다.'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new Error(err));
  }
};

export default auth;
