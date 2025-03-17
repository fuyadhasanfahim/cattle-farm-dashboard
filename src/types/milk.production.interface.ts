export interface IMilkProduction {
    _id?: string;
    milkCollectionDate: Date;
    cattleTagId?: string;
    totalMilkQuantity: string;
    saleableMilkQuantity: string;
    milkForConsumption: string;
    fatPercentage?: string;
    time: string;
    createdAt?: Date;
    updatedAt?: Date;
}
