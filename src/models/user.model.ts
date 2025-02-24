import IUser from '@/types/user.interface';
import { model, models, Schema } from 'mongoose';

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'user',
        },
        profileImage: {
            type: String,
            default:
                'https://res.cloudinary.com/dny7zfbg9/image/upload/v1740043768/hcmhd5w36fwnmllby6wo.png',
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = models?.users || model<IUser>('users', userSchema);
export default UserModel;
