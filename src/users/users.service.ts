import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import * as bcrypt from 'bcryptjs';
import aqp from 'api-query-params';
import { IUser } from 'src/interface/user.interface';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: SoftDeleteModel<UserDocument>,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
  ) { }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExisted = await this.userModel.findOne({ email: createUserDto.email });
    if (isExisted) {
      throw new BadRequestException('This email is already existed')
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(createUserDto.password, salt)
    const res = await this.userModel.create
      ({
        ...createUserDto,
        password: hashPassword,
        type: 'SYSTEM',
        role: createUserDto.role ? createUserDto.role : "USER",
        isVerify: true,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      })
    return {
      _id: res._id,
      createdAt: res.createdAt
    }
  }

  async register(createUserDto: CreateUserDto) {
    const isExisted = await this.userModel.findOne({ email: createUserDto.email });
    if (isExisted) {
      throw new BadRequestException('This email is already existed')
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 20 * 60 * 1000;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(createUserDto.password, salt)
    const res = await this.userModel.create
      ({
        ...createUserDto,
        password: hashPassword,
        role: "USER",
        type: 'SYSTEM',
        isVerify: false,
      })
    const sendMail = await this.mailService.sendVerifyOTP(otp, expirationTime, createUserDto.email)

    return {
      _id: res._id,
      createdAt: res.createdAt
    }
  }

  async verifyOTP(email: string, otp: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new BadRequestException('This user is not existed')
    }
    if (Date.now() > user.verifyExpired) {
      throw new BadRequestException('OTP has expired. Please request a new one')
    }
    if (otp !== user.verifyOTP) {
      throw new BadRequestException('Invalid OTP')
    }
    const res = await this.userModel.updateOne({ email: email },
      {
        isVerify: true,
        verifyExpired: null,
        verifyOTP: null
      }
    )
    return 'ok'
  }



  async socialCreate(email: string, type: string) {
    const password = Math.random().toString(36).slice(2, 10)
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt)
    const res = await this.userModel.create
      ({
        email: email,
        password: hashPassword,
        role: "USER",
        type: type,
        isVerify: true
      })
    return {
      _id: res._id as unknown as string,
      email: res.email,
      name: res.name,
      role: res.role,
      isVerify: res.isVerify
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {

    const { filter, sort, projection, population } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    const defaultLimit = +pageSize ? +pageSize : 10

    const totalItems = await this.userModel.count({})
    const skip = (current - 1) * defaultLimit
    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: await this.userModel.find(filter, '-refreshToken -verifyExpired -verifyOTP')
        .skip(skip)
        .limit(defaultLimit)
        .sort(sort as any)
        .select(projection)
        .populate(population)
    }
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ _id: id })
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({ _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
  }

  async remove(id: string, user: IUser) {
    let res = await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
    return await this.userModel.softDelete({ _id: id })
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email: email })
  }

  async updateUserToken(refreshToken: string, id: string) {
    return this.userModel.updateOne({ _id: id }, { refreshToken: refreshToken })
  }

  async findOneByToken(refreshToken: String) {
    return await this.userModel.findOne({ refreshToken })
  }

  async resendOTP(otp: string, expirationTime: number, email: string) {
    return await this.userModel.updateOne({ email: email }, {
      verifyExpired: expirationTime,
      verifyOTP: otp
    })
  }
}
