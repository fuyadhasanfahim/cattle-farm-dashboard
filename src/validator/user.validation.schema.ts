import { z } from 'zod';

export const userLoginValidationSchema = z.object({
    email: z.string().email({ message: 'Invalid email address.' }).trim(),
    password: z
        .string()
        .min(4, { message: 'Password must be at least 8 characters long.' })
        .trim(),
});
