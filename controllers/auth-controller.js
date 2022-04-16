import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';

import User from '../models/user-model.js';

import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import asyncHandler from '../middleware/async-handler-middleware.js';

import sendEmail from '../utils/send-mail.js';
import createToken from '../utils/generate-token.js';

// 이메일 보내는거 까지만
export const register = asyncHandler(async (req, res) => {
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

  const newUser = {
    name,
    email,
    password,
  };

  const activationToken = createToken(newUser, process.env.ACTIVATION_TOKEN_SECRET);

  const url = `${process.env.CLIENT_URL}/auth/activate/${activationToken}`;

  sendEmail({
    to: email,
    url,
    subject: '가입 인증 이메일',
    txt: '회원가입',
  });

  res.status(StatusCodes.CREATED).json({
    msg: '회원가입 완료를 위해 가입하신 이메일을 확인해주세요.',
  });
});

// 실질적인 유저 DB 저장(가입완료)
export const activateEmail = asyncHandler(async (req, res) => {
  const { activationToken } = req.body;
  const { name, email, password } = jwt.verify(activationToken, process.env.ACTIVATION_TOKEN_SECRET);

  const user = await User.findOne({ email });

  if (user) {
    throw new BadRequestError('가입된 이메일이 존재합니다.');
  }

  const newUser = await User.create({ name, email, password });

  res.status(StatusCodes.CREATED).json({
    msg: '계정이 인증되었습니다. 로그인을 해주세요.',
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('이메일과 비밀번호를 입력해주세요.');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new UnAuthenticatedError('이메일 또는 비밀번호를 다시 확인하세요.');
  }

  // 사용자 확인
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnAuthenticatedError('이메일 또는 비밀번호를 다시 확인하세요.');
  }

  //확인 됐으면 refresh 토큰 발급 -> 쿠키에 저장
  const refreshToken = createToken({ id: user._id }, process.env.REFRESH_TOKEN_SECRET);

  res.cookie('rftoken', refreshToken, {
    httpOnly: true,
    path: '/user/refresh_token',
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14일
  });

  res.json({ msg: 'login' });
});

export const getAccessToken = (req, res) => {
  const refreshToken = req.cookies.rftoken;

  if (!refreshToken) {
    // 쿠키에 refresh 토큰이 없으면 로그인 해서 다시 생성해야함
    throw new UnAuthenticatedError('로그인 해주세요.');
  }

  // refresh 토큰이 있으면 callback으로 access 토큰을 생성
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) throw new UnAuthenticatedError('로그인 해주세요.');

    const accessToken = createToken({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);
    console.log(accessToken, '액');

    res.json({ accessToken });
  });
};

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('rftoken', { path: '/user/refresh_token' });

  res.status(StatusCodes.OK).json({ msg: '로그아웃됨' });
});
