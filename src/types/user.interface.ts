export default interface IUser {
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    isVerified: boolean;
    isAdmin: boolean;
    forgetPasswordToken: string;
    forgetPasswordTokenExpiry: Date;
    verifyToken: string;
    verifyTokenExpiry: Date;
    profileImage: string;
}
