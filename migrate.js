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
            room.description = room.description.trim()
            room.title = room.title.trim()
            room.city = room.city.trim()
            // if (Array.isArray(room.address)) {
            //     // Loại bỏ khoảng trắng thừa trong từng phần tử mảng
            //     room.address = room.address.map(addr => addr.trim())
            // } else if (typeof room.address === 'string') {
            //     // Loại bỏ khoảng trắng nếu address là chuỗi
            //     room.address = room.address.trim()
            // } else if (typeof room.description === 'string') {
            //     room.description = room.description.trim()
            // } else if (typeof room.city === 'string') {
            //     // Loại bỏ khoảng trắng nếu city là chuỗi
            //     room.city = room.city.trim()
            // } else if (typeof room.title === 'string') {
            //     // Loại bỏ khoảng trắng nếu title là chuỗi
            //     room.title = room.title.trim()
            // }
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
