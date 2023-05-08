import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/follow/follow.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import ProfileRO from './interfaces/ProfileRO';



@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
  ) {}

  async findProfile(userId: number | null ,userNameToFollow: string) {
    const userToFollow = await this.userRepository.findOneBy({ username: userNameToFollow });

    if(!userToFollow) {
      return {
        status: 'error',
        mess: 'User not found' 
      }
    }

    const profile: ProfileRO= {
      username: userToFollow.username,
      bio: userToFollow.bio,
      image: userToFollow.image,
      following: false,
    }

    if(userId) {
      const isFollowed = await this.followRepository.findOneBy({ followerId: userId, followingId: userToFollow.id});
      profile.following = !!isFollowed;
    }

    return {profile};
  }

  async follow(userId: number ,userNameToFollow: string) {
    const userToFollow = await this.userRepository.findOneBy({ username: userNameToFollow })

    const isFollowed = await this.followRepository.findOneBy({ followerId: userId, followingId: userToFollow.id});

    if(!isFollowed) {
      let follows = new Follow();

      follows.followerId = userId;
      follows.followingId = userToFollow.id;

      await this.followRepository.save(follows);
    }

    let profile: ProfileRO = {
      username: userToFollow.username,
      bio: userToFollow.bio,
      image: userToFollow.image,
      following: true,
    }

    return { profile };
  }

  async unfollow(userId: number ,userNameToUnfollow: string) {
    const userToUnfollow = await this.userRepository.findOneBy({ username: userNameToUnfollow });
    
    await this.followRepository.delete({followerId: userId, followingId: userToUnfollow.id});

    const profile: ProfileRO = {
      username: userToUnfollow.username,
      bio: userToUnfollow.bio,
      image: userToUnfollow.image,
      following: false,
    }

    return { profile }
  }

}
