import { Controller, Get, HttpException } from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('auth/me')
export class MeController {
  constructor(protected p: PrismaService) {}
  @Get()
  async me(@Token({ serialize: true }) { id }) {
    const user = await this.p.user.findFirst({
      where: { id },
      select: {
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
    if (!user) {
      throw new HttpException('No User Found with provided email.', 404);
    }
    if (user.role == 'Teacher') {
      delete user.verifiedHelper;
    }
    if (user.role !== 'Teacher') {
      delete user.grades;
    }
    return user;
  }
}
