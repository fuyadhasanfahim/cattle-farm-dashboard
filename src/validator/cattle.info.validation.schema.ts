import { z } from 'zod';

export const cattleInfoValidationSchema = z.object({
    cattleId: z.string(),
    registrationDate: z.date().optional(),
    birthDate: z.date().optional(),
    age: z.string(),
    stallNo: z.string(),
    weight: z.string(),
    gender: z.string(),
    fatteningStatus: z.string(),
    cattleType: z.string(),
    category: z.string(),
    MilkingAndDryStatus: z.string(),
    transferStatus: z.string(),
    deathStatus: z.string(),
    description: z.string(),
    profileImage: z.string(),
});
