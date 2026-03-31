import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  userSeq: 1,
  userEmail: 'test@test.com',
  userLevel: 1,
  userPw: 'hashed_password',
};

const mockUsersService = {
  login: jest.fn(),
  updateLastLoginDate: jest.fn(),
  findUserDoubleCheck: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_token'),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      JWT_REFRESH: 'test_refresh_secret',
      JWT_REFRESH_EXPIRE: '7d',
    };
    return config[key];
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('로그인 성공 시 access, refresh 토큰을 반환해야 한다', async () => {
      mockUsersService.login.mockResolvedValue(mockUser);
      mockUsersService.updateLastLoginDate.mockResolvedValue(undefined);

      const result = await service.login({ email: 'test@test.com', password: '1234' });

      expect(result).toHaveProperty('access');
      expect(result).toHaveProperty('refresh');
      expect(mockUsersService.updateLastLoginDate).toHaveBeenCalledWith(mockUser.userEmail);
    });

    it('존재하지 않는 유저로 로그인 시 NotFoundException을 던져야 한다', async () => {
      mockUsersService.login.mockRejectedValue(new NotFoundException());

      await expect(service.login({ email: 'none@test.com', password: '1234' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('refresh', () => {
    it('유효한 userSeq로 새 access 토큰을 반환해야 한다', async () => {
      mockUsersService.findUserDoubleCheck.mockResolvedValue(mockUser);

      const result = await service.refresh(1);

      expect(result).toHaveProperty('access');
      expect(mockUsersService.findUserDoubleCheck).toHaveBeenCalledWith(1);
    });
  });
});
