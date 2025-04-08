import { z } from 'zod';

export const salesValidationSchema = z.object({
    salesType: z.string().min(1, 'Sales type is required'),
    salesDate: z.date(),
    buyersPhoneNumber: z.string().min(1, "Buyer's phone number is required"),
    buyersName: z.string().min(1, "Buyer's name is required"),
    milkQuantity: z.string().min(0, 'Milk quantity must be a positive number'),
    perLiterPrice: z
        .string()
        .min(0, 'Per liter price must be a positive number'),
    totalPrice: z.string().min(0, 'Total price must be a positive number'),
    paymentAmount: z
        .string()
        .min(0, 'Payment amount must be a positive number'),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    dueAmount: z.string().min(0, 'Due amount must be a positive number'),
});
