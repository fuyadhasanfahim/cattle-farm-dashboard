export default interface IBreeding {
    _id?: string;
    mothersId: string;
    breedType: string; // 
    bullName: string;
    bullNumber: string;
    bullType: string;
    semenPercentage: string;
    semenCompanyName: string;
    semenDate: Date; // breding Date
    checkDate: Date;
    breedingStatus: string;

    semenType: string;
    approximateBirthDate: Date;
    status: 'pregnant' | 'calf_registered' | 'failed';
    createdAt?: Date;
    updatedAt?: Date;
}
