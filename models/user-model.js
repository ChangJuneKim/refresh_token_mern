import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
      default: 'https://res.cloudinary.com/windows6-cloud/image/upload/v1649666473/default_avatar_ethcfy.jpg',
    },
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

UserSchema.methods.createToken = function (payload, secret) {
  //openssl rand -hex 64
  switch (secret) {
    case process.env.ACTIVATION_TOKEN_SECRET: {
      return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: process.env.ACTIVATION_TOKEN_LIFETIME,
      });
    }

    case process.env.ACCESS_TOKEN_SECRET: {
      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
      });
    }

    case process.env.REFRESH_TOKEN_SECRET: {
      return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
      });
    }

    default:
      throw new Error();
  }
};

UserSchema.methods.createAccessToken = function () {
  return jwt.sign({ userID: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.createRefreshToken = function () {
  return jwt.sign({ userID: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export default mongoose.model('User', UserSchema);
