import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateQuestionSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
  }),
  content: z.string({
    required_error: 'Content is required',
    invalid_type_error: 'Content must be a string',
  }),
  grade: z.string({
    required_error: 'Please select a grade',
    invalid_type_error: 'Grade must be a string',
  }),
  subject: z.string({
    required_error: 'Please select a subject',
    invalid_type_error: 'Subject must be a string',
  }),
});

export class CreateQuestionsDTO extends createZodDto(CreateQuestionSchema) {}
