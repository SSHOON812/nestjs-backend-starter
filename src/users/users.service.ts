import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseResponseDto } from 'src/common/base_reponse.dto';
import { PasswordService } from 'src/password/password.service';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly passwordService: PasswordService,

  ) { };

  async checkEmail(email: string): Promise<BaseResponseDto> {
    const check = await this.userRepository.findOne({
      where: {
        userEmail: email
      }
    });

    if (check) {
      throw new ConflictException("이미 가입된 이메일입니다.");
    }
    return {
      success: true,
      "message": "사용 가능한 이메일입니다.",
    }
  }


  async joinUser(createUserDto: CreateUserDto): Promise<User> {

    const hashPass = await this.passwordService.transferHash(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      userPw: hashPass,
    });

    return await this.userRepository.save(user);

  }


  async login(loginDto: LoginDto): Promise<User> {

    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { userEmail: email, userLevel: Not(0) }, select: ['userSeq', 'userEmail', 'userLevel', 'userPw'] });

    if (!user) {
      throw new NotFoundException("회원정보를 찾을 수 없습니다.");
    }

    const check = await this.passwordService.verify(user.userPw, password);

    if (check === false) {
      throw new NotFoundException("로그인 정보를 확인 바랍니다.");
    }

    return user;

  }


  async updateLastLoginDate(userEmail: string): Promise<void> {

    const update = await this.userRepository.update(
      { userEmail: userEmail },
      { lastLoginDt: new Date() }
    );
  }


  async findUserDoubleCheck(userSeq: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ userSeq });

    if (!user) {
      throw new UnauthorizedException('로그인 실패');
    }

    return user;
  }

}
