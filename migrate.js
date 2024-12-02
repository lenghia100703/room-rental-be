import mongoose from 'mongoose'
import Room from '#models/room' // Đường dẫn tới model Room

// Kết nối MongoDB
mongoose.connect('mongodb+srv://21020542:WxGp2FgZK3nBMXYK@cluster0.hbqlx.mongodb.net/Rental?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

async function migrateAddressField() {
    try {
        // Tìm tất cả các phòng có trường address chứa chuỗi mảng không chuẩn
        const rooms = await Room.find()

        for (const room of rooms) {
            // Chuyển đổi từng phần tử address thành mảng thực sự
            room.address = room.address.map((addr) => {
                // Loại bỏ khoảng trắng thừa
                const trimmed = addr.trim()
                try {
                    return JSON.parse(trimmed.replace(/'/g, '"'))
                } catch (err) {
                    console.error(`Failed to parse address: ${addr}`)
                    return addr
                }
            }).flat()
            await room.save()
        }

        console.log('Address migration completed successfully!')
    } catch (error) {
        console.error('Error migrating address field:', error)
    } finally {
        mongoose.connection.close()
    }
}

migrateAddressField()
