import mongoose from 'mongoose'
import colors from 'colors'

export const conectarDB = async () => {

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        const url = `${db.connection.host}: ${db.connection.port}`;
        console.log(colors.blue.bold(url));
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}