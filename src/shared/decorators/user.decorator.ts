import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    let userId = null;

    // for protected routes
    if (user) {
      userId = user.sub;

      return data ? userId : user;
    }

    // in case we need userID without guard
    const token = request.headers.authorization
      ? (request.headers.authorization as string).split(' ')
      : null;

    if(token) {
      const decodedPayload = jwt.verify(token[1], process.env.JWT_SECRET);
      userId = decodedPayload.sub;
    }

    return userId;
  },
);
