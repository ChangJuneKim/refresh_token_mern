import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '이름을 입력해주세요.'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, '이메일을 입력해주세요.'],
      validate: {
        validator: validator.isEmail,
        message: '유효한 이메일이 아닙니다',
      },
      unique: true,
    },

    password: {
      type: String,
      required: [true, '비밀번호를 입력해주세요.'],
      minlength: 6,
      select: false,
    },

    role: {
      type: Number,
      default: 0, // 0 유저, 1 어드민
    },

    avatar: {
      type: String,
      default: 'https://res.cloudinary.com/windows6-cloud/image/upload/v1649666473/avatar/default_avatar_ethcfy.jpg',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    // user를 생성하거나 수정시 password가 변하지 않았다면 비밀번호 해시 안함
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.isValidId = function (_id) {
  console.log(1);
  if (!mongoose.Types.ObjectId.isValid(this._id)) {
    return false;
  }
  return true;
};

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  // 공개키
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto // 토큰 해쉬 (private key), DB에 저장
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // 10분

  return resetToken;
};

export default mongoose.model('User', UserSchema);
