import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipAuth } from 'src/auth/decorators/SkipAuth.decorator';
import { User } from 'src/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileService :ProfileService) {}

  @SkipAuth()
  @Get(':username')
  getProfile(@User('id') userId: number, @Param('username') usernameToFollow) {
    return this.profileService.findProfile(userId, usernameToFollow);
  }

  @Post(':username/follow')
  follow(@User('id') userId: number, @Param('username') usernameToFollow) {
    return this.profileService.follow(userId, usernameToFollow);
  }

  @Delete(':username/unfollow')
  unfollow(@User('id') userId: number, @Param('username') usernameToUnfollow) {
    return this.profileService.unfollow(userId, usernameToUnfollow);
  }
}
