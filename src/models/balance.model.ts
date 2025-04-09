import { IBalance } from '@/types/balance.interface';
import { model, models, Schema } from 'mongoose';

const BalanceSchema = new Schema<IBalance>(
    {
        balance: { type: Number, default: 0 },
        earning: { type: Number, default: 0 },
        expense: { type: Number, default: 0 },
        due: { type: Number, default: 0 },
        description: { type: String, required: false },
        date: { type: Date, required: true, default: new Date() },
    },
    {
        timestamps: true,
    }
);

const BalanceModel =
    models?.Balance || model<IBalance>('Balance', BalanceSchema);
export default BalanceModel;
