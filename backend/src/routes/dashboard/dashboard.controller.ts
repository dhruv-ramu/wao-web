import { Controller, Get, HttpException } from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('dashboard')
export class DashboardController {
  constructor(protected p: PrismaService) {}

  @Get()
  async getDashboardStats(@Token({ serialize: true }) { id }) {
    const user = await this.p.user.findFirst({
      where: { id },
      select: {
        id: true,
        section: true,
        role: true,
        grade: true,
      },
    });
    if (!user) throw new HttpException('No User Found', 404);
    const totalUpvotes = await this.p.upvote.count({
      where: {
        Question: {
          createdBy: {
            id,
          },
        },
      },
    });
    const totalDownvotes = await this.p.downvote.count({
      where: {
        Question: {
          createdBy: {
            id,
          },
        },
      },
    });
    const questionsAskedThisMonth = await this.p.question.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
        userId: id,
      },
    });
    const answersRecievedThisMonth = await this.p.answer.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
        authorId: id,
      },
    });
    const downvotesRecievedThisMonth = await this.p.downvote.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
        Question: {
          createdBy: {
            id,
          },
        },
      },
    });

    const totalQuestions = await this.p.question.count({
      where: {
        userId: id,
      },
    });
    const totalAnswersRecieved = await this.p.answer.count({
      where: {
        Question: {
          createdBy: { id },
        },
      },
    });

    const random = Math.random() * 0.12 + 1.0;
    const totalCuriosityPoints = Math.round(
      (totalUpvotes / (totalUpvotes + totalDownvotes)) *
        (totalQuestions + totalAnswersRecieved) *
        random,
    );
    let curiosityPoints =
      (totalUpvotes / (totalUpvotes + totalDownvotes)) *
      (totalQuestions + totalAnswersRecieved) *
      random;

    curiosityPoints = Math.round(curiosityPoints / 100) * 100;

    const maxCuriosityPoints = Math.ceil(curiosityPoints / 100) * 100;
    const upvoteRatio = (totalUpvotes / (totalUpvotes + totalDownvotes)) * 100;
    return {
      totalUpvotes,
      totalDownvotes,
      questionsAskedThisMonth,
      answersRecievedThisMonth,
      downvotesRecievedThisMonth,
      totalQuestions,
      totalAnswersRecieved,
      curiosityPoints: curiosityPoints || 0,
      section: user.role === 'Teacher' ? undefined : user.section,
      grade: user.role === 'Teacher' ? undefined : user.grade,
      maxCuriosityPoints,
      upvoteRatio,
      totalCuriosityPoints,
    };
  }
}
