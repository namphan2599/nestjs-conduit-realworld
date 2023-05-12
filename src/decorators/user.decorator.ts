
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    let userId = null;

    if(user) {
      userId = user.sub;
    }

    return data ? userId : user;
  },
);