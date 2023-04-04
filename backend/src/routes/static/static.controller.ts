import { Controller } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('static')
export class StaticController {
  constructor(protected p: PrismaService) {}
}
