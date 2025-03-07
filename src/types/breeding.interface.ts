export default interface IBreeding {
    _id?: string;
    selectId: number;
    bullName: string;
    bullNumber: string;
    bullType: string;
    semenPercentage: string;
    semenCompanyName: string;
    semenDate: Date;
    checkForSemenSuccessResult: Date;
    approximateBirthdate: Date;
    checkForSemenSuccessStatus: string;
    createdAt?: Date;
    updatedAt?: Date;
}
