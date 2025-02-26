import { z } from 'zod';

export const formValidationSchema = z.object({
    বিক্রয়ের_ধরণ: z
        .string()
        .min(1, { message: 'বিক্রয়ের ধরণ নির্বাচন করুন' }),
    বিক্রয়ের_তারিখ: z.date(),
    দুধের_পরিমাণ: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (val === undefined || val === '') return true;
                return !isNaN(Number(val)) && Number(val) > 0;
            },
            { message: 'দুধের পরিমাণ সংখ্যা হিসেবে দিন' }
        ),
    গবাদি_পশুর_ট্যাগ_আইডি: z.string().optional(),
    গবাদি_পশুর_ধরন: z.string().optional(),
    প্রতি_লিটারের_দাম: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (val === undefined || val === '') return true;
                return !isNaN(Number(val)) && Number(val) > 0;
            },
            { message: 'প্রতি লিটারের দাম সংখ্যা হিসেবে দিন' }
        ),
    মোট_মূল্য: z.string().optional(),
    বিক্রয়_মূল্য: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (val === undefined || val === '') return true;
                return !isNaN(Number(val)) && Number(val) > 0;
            },
            { message: 'বিক্রয় মূল্য সংখ্যা হিসেবে দিন' }
        ),
});
