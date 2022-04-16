import jwt from 'jsonwebtoken';

const createToken = (payload, secret) => {
  //openssl rand -hex 64

  switch (secret) {
    // activate 토큰 생성 (이메일 검증)
    case process.env.ACTIVATION_TOKEN_SECRET: {
      return jwt.sign(payload, secret, {
        expiresIn: process.env.ACTIVATION_TOKEN_LIFETIME,
      });
    }
    // access 토큰 생성
    case process.env.ACCESS_TOKEN_SECRET: {
      console.log('access 토큰 생성');
      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
      });
    }

    // refresh 토큰 생성
    case process.env.REFRESH_TOKEN_SECRET: {
      console.log('refresh 토큰 생성');
      return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
      });
    }

    default:
      throw new Error();
  }
};

export default createToken;
