import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PasswordService } from 'src/password/password.service';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockUser = {
  userSeq: 1,
  userEmail: 'test@test.com',
  userPw: 'hashed_password',
  userName: '홍길동',
  userPhone: '010-0000-0000',
  userLevel: 1,
};

const mockRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockPasswordService = {
  transferHash: jest.fn().mockResolvedValue('hashed_password'),
  verify: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
        { provide: PasswordService, useValue: mockPasswordService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('checkEmail', () => {
    it('사용 가능한 이메일이면 성공 메시지를 반환해야 한다', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.checkEmail('new@test.com');

      expect(result.success).toBe(true);
    });

    it('이미 가입된 이메일이면 ConflictException을 던져야 한다', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.checkEmail('test@test.com')).rejects.toThrow(ConflictException);
    });
  });

  describe('joinUser', () => {
    it('회원가입 성공 시 유저 객체를 반환해야 한다', async () => {
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.joinUser({
        email: 'new@test.com',
        password: 'password123',
        name: '홍길동',
        phoneNumber: '010-0000-0000',
      });

      expect(result).toEqual(mockUser);
      expect(mockPasswordService.transferHash).toHaveBeenCalledWith('password123');
    });
  });

  describe('login', () => {
    it('올바른 정보로 로그인 시 유저 객체를 반환해야 한다', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockPasswordService.verify.mockResolvedValue(true);

      const result = await service.login({ email: 'test@test.com', password: 'password123' });

      expect(result).toEqual(mockUser);
    });

    it('존재하지 않는 유저면 NotFoundException을 던져야 한다', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.login({ email: 'none@test.com', password: '1234' })).rejects.toThrow(NotFoundException);
    });

    it('비밀번호가 틀리면 NotFoundException을 던져야 한다', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockPasswordService.verify.mockResolvedValue(false);

      await expect(service.login({ email: 'test@test.com', password: 'wrong' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserDoubleCheck', () => {
    it('존재하는 유저면 유저 객체를 반환해야 한다', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findUserDoubleCheck(1);

      expect(result).toEqual(mockUser);
    });

    it('존재하지 않는 유저면 UnauthorizedException을 던져야 한다', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findUserDoubleCheck(999)).rejects.toThrow(UnauthorizedException);
    });
  });
});
