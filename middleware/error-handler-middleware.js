import { StatusCodes } from 'http-status-codes';
import fs from 'fs';

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(`에러 : ${err}`); // cloudinary 에러는 메세지가 없고 그냥 err라..

  fs.readdir('tmp', (err, file) => {
    // async handler의 catch에 잡히는 에러일 때 tmp 폴더에 생기는 파일 제거

    if (file.length > 0) {
      fs.unlinkSync(`tmp/${file[0]}`);
    }
  });

  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || '알 수 없는 문제가 발생했습니다, 나중에 다시 시도해주세요',
  };

  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    //defaultError.msg = err.message
    defaultError.msg = Object.values(err.errors)
      .map(error => error.message)
      .join(',');
  }

  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} 필드는 unique 해야합니다.`;
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandlerMiddleware;
