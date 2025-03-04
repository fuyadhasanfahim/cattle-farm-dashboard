export default interface IBreeding {
    _id?: string;
    mothersId: string;
    breedType: string;
    semenType: string;
    semenPercentage: string;
    semenCompanyName: string;
    approximateBirthDate: Date;
    semenDate: Date;
    status: 'pregnant' | 'calf_registered' | 'failed';
    createdAt?: Date;
    updatedAt?: Date;
}
