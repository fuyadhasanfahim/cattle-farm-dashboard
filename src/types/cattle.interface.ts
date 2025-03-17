export interface ICattle {
    _id: string;
    tagId: string;
    registrationDate: Date | undefined;
    dateOfBirth: Date | undefined;
    age: string;
    stallNumber: string;
    breed?: string;
    fatherName?: string;
    fatherId?: string;
    motherName?: string;
    motherId?: string;
    percentage?: string;
    weight: string;
    gender: string;
    fatteningStatus: string;
    cattleType: string;
    cattleCategory: string;
    location: string;
    status: string;
    description?: string;
}
