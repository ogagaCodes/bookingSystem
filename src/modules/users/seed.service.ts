import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * Seed default users when the application starts if the users table is empty.
 */
@Injectable()
export class UsersSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersSeedService.name);
  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    const count = await this.usersService.count();
    if (count > 0) {
      return;
    }
    this.logger.log('No users found, seeding default users...');
    await this.usersService.createUser('admin', 'password', ['admin']);
    await this.usersService.createUser('provider', 'password', ['provider']);
    this.logger.log('Seeded default admin and provider users with password "password".');
  }
}