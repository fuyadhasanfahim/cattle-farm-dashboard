import mongoose from 'mongoose';

interface ConnectionObject {
    isConnected?: number;
}

const connection: ConnectionObject = {};

export default async function dbConnect() {
    if (connection.isConnected) {
        console.log('Already connected to database.');
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error('Please specify a URI to connect to database.');
    }

    try {
        const database = await mongoose.connect(process.env.MONGO_URI, {});

        connection.isConnected = database.connections[0].readyState;

        console.log('🚀 Connected to database.');
    } catch (error) {
        console.error('❌ Error connecting to database:', error);
        process.exit(1);
    }
}
