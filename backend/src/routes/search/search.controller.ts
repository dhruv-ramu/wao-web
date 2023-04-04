import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('search')
export class SearchController {
  constructor(protected p: PrismaService) {}

  @Get('')
  @HttpCode(200)
  async search(
    @Query('subject') subject?: string,
    @Query('take') take?: string,
    @Query('query') query?: string,
    @Query('grade') grade?: string,
  ) {
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);
    if (subject && query) {
      let questions = await this.p.subject.findMany({
        where: {
          name: {
            equals: subject,
          },
          Question: {
            some: {
              OR: [
                {
                  title: {
                    contains: query,
                  },
                },
                {
                  content: {
                    contains: query,
                  },
                },
              ],
            },
          },
        },
        select: {
          Question: {
            where: {
              title: {
                contains: query,
              },
            },
            select: {
              id: true,
              url: true,
              grade: {
                select: {
                  name: true,
                },
              },
              content: true,
              title: true,
              subject: {
                select: {
                  name: true,
                },
              },
            },
            take: toTake,
            skip: toTake > 10 ? toTake - 10 : undefined,
          },
        },
      });
      questions = questions.map((q) => q.Question.map((q) => q)).flat() as any;
      if (questions.length > 10) return { questions, next: toTake + 10 };
      return { questions };
    }
    if (query) {
      const questions = await this.p.question.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
              },
            },
            {
              content: {
                contains: query,
              },
            },
          ],
        },
        select: {
          id: true,
          url: true,
          grade: {
            select: {
              name: true,
            },
          },
          content: true,
          title: true,
          subject: {
            select: {
              name: true,
            },
          },
        },
        take: toTake,
        skip: toTake > 10 ? toTake - 10 : undefined,
      });
      if (questions.length > 10) return { questions, next: toTake + 10 };
      return { questions };
    }
    if (subject) {
      let questions = await this.p.subject.findMany({
        where: {
          name: {
            equals: subject,
          },
        },
        select: {
          Question: {
            select: {
              id: true,
              url: true,
              grade: {
                select: {
                  name: true,
                },
              },
              content: true,
              title: true,
              subject: {
                select: {
                  name: true,
                },
              },
            },
            take: toTake,
            skip: toTake > 10 ? toTake - 10 : undefined,
          },
        },
      });
      questions = questions.map((q) => q.Question.map((q) => q)).flat() as any;
      if (questions.length > 10) return { questions, next: toTake + 10 };
      return { questions };
    }

    if (grade) {
      const questions = await this.p.question.findMany({
        where: {
          grade: {
            name: {
              equals: grade,
            },
          },
        },
        select: {
          id: true,
          url: true,
          grade: {
            select: {
              name: true,
            },
          },
          content: true,
          title: true,
          subject: {
            select: {
              name: true,
            },
          },
        },
        take: toTake,
        skip: toTake > 10 ? toTake - 10 : undefined,
      });
      if (questions.length > 10) return { questions, next: toTake + 10 };
      return { questions };
    } else {
      const questions = await this.p.question.findMany({
        select: {
          id: true,
          url: true,
          grade: {
            select: {
              name: true,
            },
          },
          content: true,
          title: true,
          subject: {
            select: {
              name: true,
            },
          },
        },
        take: toTake,
        skip: toTake > 10 ? toTake - 10 : undefined,
      });
      if (questions.length > 10) return { questions, next: toTake + 10 };
      return { questions };
    }
  }
}
