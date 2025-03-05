import { z } from 'zod';

export const milkProductionValidationSchema = z.object({
    দুধ_সংগ্রহের_তারিখ: z.date(),
    গবাদি_পশুর_ট্যাগ_আইডি: z.string().optional(),
    গবাদি_পশুর_ধরণ: z.string().optional(),
    মোট_দুধের_পরিমাণ: z.string().min(1, 'মোট দুধের পরিমাণ প্রয়োজন'),
    বিক্রি_যোগ্য_দুধের_পরিমাণ: z
        .string()
        .min(1, 'বিক্রি যোগ্য দুধের পরিমাণ প্রয়োজন'),
    খাওয়ার_জন্য_দুধের_পরিমাণ: z
        .string()
        .min(1, 'খাওয়ার জন্য দুধের পরিমাণ প্রয়োজন'),
    ফ্যাট_শতাংশ: z.string().optional(),
    সময়: z.string().min(1, 'সময় প্রয়োজন'),
});
