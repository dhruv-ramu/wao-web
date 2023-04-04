import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LoginDto } from 'src/validators/auth.validator';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

@Controller('auth/login')
export class LoginController {
  constructor(protected p: PrismaService) {}

  @Post()
  async login(@Body() body: LoginDto) {
    const user = await this.p.user.findFirst({
      where: { email: body.email },
      select: {
        password: true,
        id: true,
        name: true,
        role: true,
        verifiedHelper: true,
        grades: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!user)
      throw new HttpException('No User Found with provided email.', 404);
    if (!(await compare(body.password, user.password)))
      throw new HttpException('Incorrect Password', 403);
    delete user.password;
    if (user.role == 'Teacher') {
      delete user.verifiedHelper;
    }
    if (user.role != 'Teacher') delete user.grades;
    return {
      token: sign({ id: user.id }, process.env.JWT_SECRET),
      user,
    };
  }
}
