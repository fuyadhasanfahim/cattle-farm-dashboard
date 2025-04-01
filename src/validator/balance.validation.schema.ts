import { z } from 'zod';

const BalanceValidationSchema = z.object({
    balance: z.string(),
    earning: z.string(),
    expense: z.string(),
    due: z.string(),
    date: z.date(),
    description: z.string(),
});

export default BalanceValidationSchema;
