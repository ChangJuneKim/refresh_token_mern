import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import mongoose from 'mongoose';

import User from '../models/user-model.js';

import { BadRequestError, UnAuthenticatedError, NotFoundError } from '../errors/index.js';
import asyncHandler from '../middleware/async-handler-middleware.js';

import sendEmail from '../utils/send-mail.js';
// import createToken from '../utils/generate-token.js';

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError('이메일을 다시 확인하세요.');
  }

  const resetToken = user.getResetPasswordToken();

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`;

  try {
    sendEmail({
      to: user.email,
      url: resetUrl,
      subject: '비밀번호 변경',
      txt: '비밀번호 변경',
    });

    res
      .status(StatusCodes.OK)
      .json({ msg: `비밀번호 변경 링크가 ${email}으로 전송되었습니다. 메일함을 확인해주세요.` });
  } catch (err) {
    console.log(err);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    throw new Error(err);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError('비밀번호가 다릅니다.');
  }

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // console.log(req.user, user);

  if (!user) {
    throw new BadRequestError('Invalid Token');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(StatusCodes.CREATED).json({
    msg: '패스워드가 변경되었습니다.',
  });
});

export const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json(user);
});

export const getAllUsersInfo = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.json(users);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;

  await User.findOneAndUpdate({ _id: req.user._id }, { name, avatar });

  res.status(StatusCodes.CREATED).json({ msg: '업데이트 성공' });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const id = req.params.id;

  //"Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for model \"User\"" 에러를 어떻게 처리해야 될까???
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('유효하지 않은 id 값입니다.');
  }

  const user = await User.findById(id);

  if (!role) {
    throw new BadRequestError('권한이 빈 값입니다.');
  }

  await User.findOneAndUpdate({ _id: user._id }, { role });

  res.status(StatusCodes.CREATED).json({ msg: '업데이트 성공' });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('유효하지 않은 id 값입니다.');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('계정이 존재하지 않습니다.');
  }

  if (user.role === 1) {
    throw new BadRequestError('어드민 계정은 삭제할 수 없습니다.');
  }

  await User.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ msg: `ID : ${id} 유저 삭제됨` });
});
