import mongoose from 'mongoose';

export default async function dbConfig() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Connected to Database successfully.');
        });
        connection.on('error', (err) => {
            console.log('Database connection error:', err);

            process.exit();
        });
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}
