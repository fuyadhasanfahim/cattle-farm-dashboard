import { z } from 'zod';

export const milkProductionValidationSchema = z.object({
    _id: z.string().optional(),
    দুধ_সংগ্রহের_তারিখ: z.date({
        required_error: 'দুধ সংগ্রহের তারিখ প্রয়োজন',
        invalid_type_error: 'দুধ সংগ্রহের তারিখ অবশ্যই একটি বৈধ তারিখ হতে হবে',
    }),
    গবাদি_পশুর_ধরণ: z.string({
        required_error: 'গবাদি পশুর ধরণ প্রয়োজন',
    }),
    ফ্যাট_শতাংশ: z.string({
        required_error: 'সেশন প্রয়োজন',
    }),
    গবাদি_পশুর_ট্যাগ_আইডি: z.string({
        required_error: 'গবাদি পশুর ট্যাগ আইডি প্রয়োজন',
    }),
    দুধের_পরিমাণ: z.string().refine((value) => !isNaN(parseFloat(value)), {
        message: 'দুধের পরিমাণ অবশ্যই একটি সংখ্যা হতে হবে',
    }),
    সময়: z.string({
        required_error: 'সময় প্রয়োজন',
    }),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
