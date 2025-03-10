import { ITreatment } from '@/types/treatment.interface';
import mongoose, { Schema } from 'mongoose';

const CattleTreatmentSchema = new Schema<ITreatment>({
    cattleId: { type: String, ref: 'Cattle', required: true },
    treatmentType: {
        type: String,
        enum: ['Deworming', 'Vaccination', 'General'],
        required: true,
    },
    medicineName: { type: String, required: true },
    treatmentDate: { type: Date, required: true },
    nextDueDate: { type: Date },
    vaccinationInterval: { type: Number, enum: [3, 6, 9, 12] },
    dewormingCount: { type: Number, default: 0 },
    vaccinationCount: { type: Number, default: 0 },
    generalCount: { type: Number, default: 0 },
});

CattleTreatmentSchema.pre('save', function (next) {
    if (this.treatmentType === 'Deworming') {
        this.nextDueDate = new Date(this.treatmentDate);
        this.nextDueDate.setMonth(this.nextDueDate.getMonth() + 3);
        this.dewormingCount += 1;
    } else if (
        this.treatmentType === 'Vaccination' &&
        this.vaccinationInterval
    ) {
        this.nextDueDate = new Date(this.treatmentDate);
        this.nextDueDate.setMonth(
            this.nextDueDate.getMonth() + this.vaccinationInterval
        );
        this.vaccinationCount += 1;
    } else if (this.treatmentType === 'General') {
        this.generalCount += 1;
    }
    next();
});

const TreatmentModel =
    mongoose.models?.Treatment ||
    mongoose.model<ITreatment>('Treatment', CattleTreatmentSchema);
export default TreatmentModel;
