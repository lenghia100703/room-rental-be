import mongoose from 'mongoose';
import Room from '#models/room'; // Đường dẫn tới model Room

mongoose.connect('mongodb+srv://21020542:WxGp2FgZK3nBMXYK@cluster0.hbqlx.mongodb.net/Rental?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function migrateOwnerField() {
    try {
        // Tìm các tài liệu có `owner` là string
        const rooms = await Room.find();
        console.log(`Found ${rooms.length} documents with string owner`);

        // Cập nhật từng tài liệu
        for (const room of rooms) {
            const updated = await Room.updateOne(
                { _id: room._id },
                { $set: { owner: new mongoose.Types.ObjectId(room.owner) } }
            );
            console.log(`Updated room with ID: ${room._id}, Modified count: ${updated.modifiedCount}`);
        }

        console.log('Migration completed successfully');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error during migration:', error);
        mongoose.disconnect();
    }
}

migrateOwnerField();
