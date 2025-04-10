export interface IBalance {
    _id?: string;
    balance?: number;
    earning?: number;
    expense?: number;
    due?: number;
    description?: string;
    date: Date;
}
