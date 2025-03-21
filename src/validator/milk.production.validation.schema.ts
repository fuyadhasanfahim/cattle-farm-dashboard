import { z } from 'zod';

export const milkProductionValidationSchema = z.object({
    milkCollectionDate: z.date(),
    cattleTagId: z.string().optional(),
    milkQuantity: z.string().min(1, 'Total milk quantity is required'),
    fatPercentage: z.string().optional(),
    time: z.string().min(1, 'Time is required'),
});
