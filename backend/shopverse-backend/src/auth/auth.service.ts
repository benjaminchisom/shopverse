import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { SigninDto } from './dto/signin.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { fullName, email, password, gender } = signupDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        gender,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        gender: true,
        createdAt: true,
      },
    });

    return {
      message: 'Account created successfully',
      user,
    };
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
      },
    };
  }

  async me(authorization: string | undefined) {
    const match = authorization?.trim().match(/^Bearer\s+(\S+)$/i);
    const token = match?.[1];

    if (!token) {
      throw new UnauthorizedException(
        'Please sign in to view your account',
      );
    }

    let payload: { sub?: unknown } | null = null;

    try {
      payload = await this.jwtService.verifyAsync<{ sub?: unknown }>(
        token,
        {
          algorithms: ['HS256'],
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    if (
      payload === null ||
      typeof payload !== 'object' ||
      typeof payload.sub !== 'number' ||
      !Number.isSafeInteger(payload.sub) ||
      payload.sub <= 0
    ) {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Please sign in again');
    }

    return { user };
  }
}