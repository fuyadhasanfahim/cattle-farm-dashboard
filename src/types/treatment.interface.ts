export interface ITreatment {
    _id?: string;
    cattleId: string;
    treatmentType: 'Deworming' | 'Vaccination' | 'General';
    medicineName: string;
    medicineReason?: string;
    treatmentDate: Date;
    nextDueDate?: Date;
    vaccinationInterval?: 3 | 6 | 9 | 12;
    dewormingCount: number;
    vaccinationCount: number;
    generalCount: number;
}
