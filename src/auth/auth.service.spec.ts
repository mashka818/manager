import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mockUserRepository: any;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      await expect(service.register(dto)).resolves.not.toThrow();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'verify').mockImplementation(() => Promise.resolve(true));

      const result = await service.login(dto);
      expect(result.accessToken).toBeDefined();
      expect(result.accessToken).toBe('test-token');
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const dto = { email: 'wrong@example.com', password: 'password123' };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const dto = { email: 'test@example.com', password: 'wrongpassword' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'verify').mockImplementation(() => Promise.resolve(false));

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
}); 