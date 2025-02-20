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
        phoneNumber: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        forgetPasswordToken: {
            type: String,
            default: null,
        },
        forgetPasswordTokenExpiry: {
            type: Date,
            default: null,
        },
        verifyToken: {
            type: String,
            default: null,
        },
        verifyTokenExpiry: {
            type: Date,
            default: null,
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
