import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findOneByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  async createUser(username: string, password: string, roles: string[] = ['provider']): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ username, password: hashed, roles });
    return this.repo.save(user);
  }

  async count(): Promise<number> {
    return this.repo.count();
  }
}