import { Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { Cron } from '@nestjs/schedule';
import { genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/constants';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { SignUpDto } from 'src/validators/auth.validator';

@Controller('auth/signup')
export class SignupController {
  constructor(protected p: PrismaService) {}
  @Post()
  async createAccount(@Body() body: SignUpDto) {
    const { email, grades, name, password, teacher, subjects, grade, section } =
      body;
    const oldUser = await this.p.user.findFirst({
      where: {
        email,
      },
      select: {
        role: true,
      },
    });
    if (oldUser) {
      throw new HttpException(
        `A ${oldUser.role} with provided email already exists.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(password, await genSalt(10));

    const user = await this.p.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: teacher === true ? 'Teacher' : 'Student',
        grades:
          teacher === true
            ? {
                connectOrCreate: grades.map((grade) => ({
                  create: {
                    name: grade,
                  },
                  where: {
                    name: grade,
                  },
                })),
              }
            : undefined,
        subjects:
          teacher === true
            ? {
                connectOrCreate: subjects.map((subject) => ({
                  create: {
                    name: subject,
                  },
                  where: {
                    name: subject,
                  },
                })),
              }
            : undefined,
        grade: teacher === true ? undefined : grade,
        section: teacher === false ? section : undefined,
      },
    });
    const token = sign(
      {
        id: user.id,
      },
      JWT_SECRET,
    );
    return {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }
  @Cron('0 0 1 7 *')
  async incrementGrade() {
    await this.p.user.updateMany({
      where: {
        role: 'Student',
        AND: [
          {
            grade: {
              lt: 12,
            },
          },
          {
            grade: {
              gt: 0,
            },
          },
        ],
      },
      data: {
        grade: {
          increment: 1,
        },
      },
    });
  }
}
