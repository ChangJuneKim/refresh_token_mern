import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.FORBIDDEN; // 403
  }
}

export default ForbiddenError;
