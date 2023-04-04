import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  HttpException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateQuestionsDTO } from 'src/validators/questions.validator';

@Controller('questions')
export class QuestionsController {
  constructor(protected p: PrismaService) {}

  @Post()
  async createQuestion(
    @Token({ serialize: true }) { id },
    @Body() body: CreateQuestionsDTO,
  ) {
    const { content, grade, subject, title } = body;

    const question = await this.p.question.create({
      data: {
        content,
        // this will make sure title is unique
        title,
        url: `${title
          .trim()
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '')}-${nanoid(10)}`,
        createdBy: {
          connect: {
            id,
          },
        },
        grade: {
          connectOrCreate: {
            where: {
              name: grade,
            },
            create: {
              name: grade,
            },
          },
        },
        subject: {
          connectOrCreate: {
            where: {
              name: subject,
            },
            create: {
              name: subject,
            },
          },
        },
      },
      select: {
        url: true,
      },
    });
    return {
      url: question.url,
    };
  }

  @Get(':title')
  async getQuestion(@Param('title') title: string) {
    const question = await this.p.question.findFirst({
      where: {
        url: title,
      },
      select: {
        content: true,
        createdAt: true,
        grade: {
          select: {
            name: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
        title: true,
        upvotes: {
          select: {
            id: true,
          },
        },
        downvotes: {
          select: {
            id: true,
          },
        },
      },
    });
    return {
      ...question,
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
    };
  }

  @Get()
  async getQuestions(@Query('take') take: string) {
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);
    const questions = await this.p.question.findMany({
      take: toTake,
      select: {
        content: true,
        createdAt: true,
        grade: {
          select: {
            name: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
        title: true,
        url: true,
        id: true,
      },
      skip: toTake > 10 ? toTake - 10 : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    if (questions.length === 10) {
      return {
        questions,
        next: toTake + 10,
      };
    }
    return { questions };
  }

  @Post(':slug/upvote')
  async upvoteQuestion(
    @Token({ serialize: true }) { id },
    @Param('slug') slug: string,
  ) {
    const question = await this.p.question.findFirst({
      where: {
        url: slug,
      },
      select: {
        id: true,
      },
    });
    if (!question) {
      throw new HttpException('Question not found', 404);
    }
    const upvote = await this.p.upvote.findFirst({
      where: {
        questionId: question.id,
        userId: id,
      },
    });
    const downvote = await this.p.downvote.findFirst({
      where: {
        questionId: question.id,
        userId: id,
      },
    });
    if (downvote) {
      await this.p.downvote.delete({
        where: {
          id: downvote.id,
        },
      });
    }
    if (upvote) {
      throw new HttpException('You have already upvoted this question', 400);
    }
    await this.p.upvote.create({
      data: {
        Question: {
          connect: {
            id: question.id,
          },
        },
        User: {
          connect: {
            id,
          },
        },
      },
    });
    return {
      message: 'Upvote successful',
    };
  }

  @Post(':slug/downvote')
  async downvoteQuestion(
    @Token({ serialize: true }) { id },
    @Param('slug') slug: string,
  ) {
    const question = await this.p.question.findFirst({
      where: {
        url: slug,
      },
      select: {
        id: true,
      },
    });
    if (!question) {
      throw new HttpException('Question not found', 404);
    }
    const downvote = await this.p.downvote.findFirst({
      where: {
        questionId: question.id,
        userId: id,
      },
    });
    const upvote = await this.p.upvote.findFirst({
      where: {
        questionId: question.id,
        userId: id,
      },
    });
    if (upvote) {
      await this.p.upvote.delete({
        where: {
          id: upvote.id,
        },
      });
    }

    if (downvote) {
      throw new HttpException('You have already downvoted this question', 400);
    }
    await this.p.downvote.create({
      data: {
        Question: {
          connect: {
            id: question.id,
          },
        },
        User: {
          connect: {
            id,
          },
        },
      },
    });
    return {
      message: 'Downvote successful',
    };
  }

  @Post(':slug/answer')
  async answerQuestion(
    @Token({ serialize: true }) { id },
    @Param('slug') slug: string,
    @Body() { answer }: { answer: string },
  ) {
    if (!answer) {
      throw new HttpException('Answer cannot be empty', 400);
    }
    const question = await this.p.question.findFirst({
      where: {
        url: slug,
      },
      select: {
        id: true,
      },
    });
    if (!question) {
      throw new HttpException('Question not found', 404);
    }
    const user = await this.p.user.findFirst({
      where: {
        id,
      },
      select: {
        role: true,
        verifiedHelper: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (user.role !== 'Teacher' && !user.verifiedHelper) {
      throw new HttpException(
        'Only Teachers and verified helpers can answer questions',
        401,
      );
    }
    await this.p.answer.create({
      data: {
        content: answer,
        Question: {
          connect: {
            id: question.id,
          },
        },
        author: {
          connect: {
            id,
          },
        },
      },
    });
    return {
      message: 'Answer added',
    };
  }

  @Get(':slug/answers')
  async getAnswers(@Param('slug') slug: string, @Query('take') take: string) {
    const question = await this.p.question.findFirst({
      where: {
        url: slug,
      },
      select: {
        id: true,
      },
    });
    if (!question) {
      throw new HttpException('Question not found', 404);
    }
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);
    const answers = await this.p.answer.findMany({
      where: {
        questionId: question.id,
      },
      select: {
        content: true,
        createdAt: true,
        id: true,
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
    });
    if (answers.length === 10) {
      return {
        answers,
        next: toTake + 10,
      };
    }
    return { answers };
  }
}
