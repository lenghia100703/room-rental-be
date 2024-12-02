import mongoose from 'mongoose'
import Room from '#models/room' // Đường dẫn tới model Room

// Kết nối MongoDB
mongoose.connect('mongodb+srv://21020542:WxGp2FgZK3nBMXYK@cluster0.hbqlx.mongodb.net/Rental?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

async function migrateAddressField() {
    try {
        // Tìm tất cả các phòng trong cơ sở dữ liệu
        const rooms = await Room.find()

        for (const room of rooms) {
            room.price = room.price * 1000000
            await room.save()
        }

        console.log('Address migration completed successfully!')
    } catch (error) {
        console.error('Error migrating address field:', error)
    } finally {
        // Đóng kết nối sau khi hoàn thành
        mongoose.connection.close()
    }
}

// Gọi hàm migrate
migrateAddressField()
