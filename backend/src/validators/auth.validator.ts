import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const SignUpSchema = z
  .object({
    email: z
      .string({
        invalid_type_error: 'email must be a string',
        required_error: 'email is required',
      })
      .email(),
    password: z
      .string({
        invalid_type_error: 'password must be a string',
        required_error: 'password is required',
      })
      .min(8),
    name: z.string({
      invalid_type_error: 'name must be a string',
      required_error: 'name is required',
    }),
    teacher: z.boolean({
      invalid_type_error: 'teacher must be a boolean',
      required_error: 'please provide if you are a teacher or a student',
    }),
    grades: z.array(z.string()).optional(),
    subjects: z.array(z.string()).optional(),
    grade: z.number().optional(),
    section: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.teacher && !data.grades) {
      ctx.addIssue({
        path: ['grades'],
        message: 'grades is required for teachers',
        code: z.ZodIssueCode.custom,
        fatal: true,
      });
    }
  })
  .superRefine((data, ctx) => {
    if (data.teacher && !data.subjects) {
      ctx.addIssue({
        path: ['subjects'],
        message: 'subjects is required for teachers',
        code: z.ZodIssueCode.custom,
        fatal: true,
      });
    }
  })
  .superRefine((data, ctx) => {
    if (!data.teacher && !data.grade) {
      ctx.addIssue({
        path: ['grade'],
        message: 'grade is required for students',
        code: z.ZodIssueCode.custom,
        fatal: true,
      });
    }
  })
  .superRefine((data, ctx) => {
    if (!data.teacher && !data.section) {
      ctx.addIssue({
        path: ['section'],
        message: 'section is required for students',
        code: z.ZodIssueCode.custom,
        fatal: true,
      });
    }
  });

export class SignUpDto extends createZodDto(SignUpSchema) {}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export class LoginDto extends createZodDto(LoginSchema) {}
