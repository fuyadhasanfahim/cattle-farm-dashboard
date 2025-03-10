export interface ITreatment {
    cattleId: string;
    treatmentType: 'Deworming' | 'Vaccination' | 'General';
    medicineName: string;
    treatmentDate: Date;
    nextDueDate?: Date;
    vaccinationInterval?: 3 | 6 | 9 | 12;
    dewormingCount: number;
    vaccinationCount: number;
    generalCount: number;
}
