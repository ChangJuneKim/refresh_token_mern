import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';
import asyncHandler from '../middleware/async-handler-middleware.js';

const removeTmp = path => {
  fs.unlinkSync(path, err => {
    if (err) throw err;
  });
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadAvatar = asyncHandler(async (req, res) => {
  const MAX_SIZE = 1024 * 1024; // 1mb

  if (!req.files || Object.keys(req.files).length === 0) {
    throw new BadRequestError('아무 파일도 업로드 되지않았습니다.');
  }

  const avatarImage = req.files.file;
  console.log(avatarImage.tempFilePath);
  if (!avatarImage.mimetype.startsWith('image')) {
    removeTmp(avatarImage.tempFilePath);
    throw new BadRequestError('이미지 파일만 가능합니다.');
  }

  if (avatarImage.size > MAX_SIZE) {
    // 1mb
    removeTmp(avatarImage.tempFilePath);
    throw new BadRequestError('파일 사이즈가 너무 큽니다. 1mb 이하의 이미지 파일만 업로드 가능합니다.');
  }

  const result = await cloudinary.uploader.upload(avatarImage.tempFilePath, {
    use_filename: true,
    folder: 'avatar',
    width: 150,
    height: 150,
    crop: 'fill',
  });

  removeTmp(avatarImage.tempFilePath);

  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
});

export default uploadAvatar;
