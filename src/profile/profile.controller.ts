import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipAuth } from 'src/auth/decorators/SkipAuth.decorator';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileService :ProfileService) {}

  @SkipAuth()
  @Get(':username')
  getProfile(@Req() req, @Param('username') usernameToFollow) {
    console.log(req['user'])
    let userId = null;
    if(req['user']) {
      userId = req['user'].sub;
    }
    return this.profileService.findProfile(userId, usernameToFollow);
  }

  @Post(':username/follow')
  follow(@Req() req, @Param('username') usernameToFollow) {
    return this.profileService.follow(req['user'].sub, usernameToFollow);
  }

  @Delete(':username/follow')
  unfollow(@Req() req, @Param('username') usernameToUnfollow) {
    return this.profileService.unfollow(req['user'].sub, usernameToUnfollow);
  }
}
