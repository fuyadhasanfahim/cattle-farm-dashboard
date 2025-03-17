import { z } from 'zod';

export const milkProductionValidationSchema = z.object({
    milkCollectionDate: z.date(),
    cattleTagId: z.string().optional(),
    totalMilkQuantity: z.string().min(1, 'Total milk quantity is required'),
    saleableMilkQuantity: z
        .string()
        .min(1, 'Saleable milk quantity is required'),
    milkForConsumption: z.string().min(1, 'Milk for consumption is required'),
    fatPercentage: z.string().optional(),
    time: z.string().min(1, 'Time is required'),
});
