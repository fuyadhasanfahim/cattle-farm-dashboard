import { IUser } from '@/types/user.interface';
import { model, models, Schema } from 'mongoose';

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
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
        default: 'admin',
    },
    profileImage: {
        type: String,
        required: false,
    },
});

const UserModel = models?.User || model<IUser>('User', UserSchema);
export default UserModel;
