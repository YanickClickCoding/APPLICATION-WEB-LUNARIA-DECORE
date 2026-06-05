import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../common/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({
      $or: [...(dto.email ? [{ email: dto.email }] : []), { phone: dto.phone }],
    });
    if (exists) throw new ConflictException('Email ou téléphone déjà utilisé');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({ ...dto, password: hashed });
    return this.buildResponse(user);
  }

  async login(dto: LoginDto) {
    const filter = dto.email ? { email: dto.email } : { phone: dto.phone };
    const user = await this.userModel.findOne(filter);
    if (!user) throw new UnauthorizedException('Identifiants incorrects');
    if (!user.isActive) throw new UnauthorizedException('Compte désactivé');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants incorrects');

    return this.buildResponse(user);
  }

  async sendOtp(phone: string) {
    let user = await this.userModel.findOne({ phone });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    if (!user) {
      user = await this.userModel.create({
        phone,
        firstName: 'Utilisateur',
        lastName: '',
        otpCode: code,
        otpExpires: expires,
      });
    } else {
      user.otpCode = code;
      user.otpExpires = expires;
      await user.save();
    }

    // TODO: SMS réel via gateway
    console.log(`[OTP] ${phone} → ${code}`);
    return { message: 'Code OTP envoyé' };
  }

  async verifyOtp(phone: string, code: string) {
    const user = await this.userModel.findOne({ phone });
    if (!user || user.otpCode !== code)
      throw new BadRequestException('Code invalide');
    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new BadRequestException('Code expiré');
    }
    user.isVerified = true;
    (user as unknown as Record<string, unknown>).otpCode = undefined;
    (user as unknown as Record<string, unknown>).otpExpires = undefined;
    await user.save();
    return this.buildResponse(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.userModel.findById(payload.sub);
      if (!user || !user.isActive) throw new UnauthorizedException();
      return { accessToken: this.signAccess(user) };
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
  }

  private signAccess(user: UserDocument) {
    return this.jwtService.sign(
      { sub: user._id, role: user.role },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      },
    );
  }

  private signRefresh(user: UserDocument) {
    return this.jwtService.sign(
      { sub: user._id },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );
  }

  private buildResponse(user: UserDocument) {
    const userObj = user.toObject() as Record<string, unknown>;
    delete userObj.password;
    delete userObj.otpCode;
    delete userObj.otpExpires;
    return {
      user: userObj,
      tokens: {
        accessToken: this.signAccess(user),
        refreshToken: this.signRefresh(user),
      },
    };
  }
}
