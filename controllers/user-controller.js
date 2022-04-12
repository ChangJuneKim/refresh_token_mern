import User from '../models/user-model.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';

import { BadRequestError } from '../errors/index.js';
import asyncHandler from '../middleware/async-handler-middleware.js';

import sendEmail from '../utils/send-mail.js';

export const register = asyncHandler(async (req, res, next) => {
  // console.log(req.body);

  const { name, email, password } = req.body;

  // 검증
  if (!name || !email || !password) {
    throw new BadRequestError('값을 모두 입력해주세요.'); // 400
  }

  if (!validator.isEmail(email)) {
    throw new BadRequestError('유효한 이메일이 아닙니다.'); // 400
  }

  const userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    throw new BadRequestError('이미 가입된 이메일입니다.');
  }

  if (password.length < 6) {
    throw new BadRequestError('비밀번호는 최소 6자 이상이어야 합니다.');
  }

  const user = await User.create({ name, email, password });

  const activationToken = user.createToken({ userID: user._id }, process.env.ACTIVATION_TOKEN_SECRET);

  const url = `${process.env.CLIENT_URL}/user/activate/${activationToken}`;
  await sendEmail(email, url, '이메일 검증');

  res.status(StatusCodes.CREATED).json({
    msg: '회원가입 완료를 위해 가입하신 이메일을 확인해주세요.',
    user: {
      name: user.name,
      email: user.email,
    },
  });
});
