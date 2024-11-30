import Room from '#models/room'
import { PAGE, PER_PAGE } from '#constants/pagination'
import httpStatus from 'http-status'

export const getListRooms = async (req, res) => {
    try {
        let { page, perPage } = req.query
        if (!page || !perPage) {
            page = PAGE
            perPage = PER_PAGE
        }
        let rooms, totalRooms
        if (parseInt(perPage, 10) === -1) {
            rooms = await Room.find()
            totalRooms = rooms.length
        } else {
            const skip = (page - 1) * perPage
            const limit = parseInt(perPage, 10)
            rooms = await Room.find().skip(skip).limit(limit)
            totalRooms = await Room.countDocuments()
        }

        return res.status(httpStatus.OK).json({
            data: rooms,
            page: parseInt(page, 10),
            totalPages: perPage === -1 ? 1 : Math.ceil(totalRooms / perPage),
            message: 'Lấy danh sách phòng thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Lấy danh sách phòng thất bại',
        })
    }
}

export const createRoom = async (req, res) => {
    try {
        const {
            title,
            price,
            images,
            bedroom,
            bathroom,
            size,
            latitude,
            longitude,
            city,
            address,
            school,
            bus,
            restaurant,
            description,
            ownerId,
        } = req.body
        const newRoom = new Room({
            title,
            price,
            images,
            bedroom,
            bathroom,
            size,
            latitude,
            longitude,
            city,
            address,
            school,
            bus,
            restaurant,
            description,
            owner: ownerId,
        })
        const savedRoom = await newRoom.save()
        return res.status(httpStatus.CREATED).json({
            data: savedRoom,
            message: 'Tạo phòng thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Tạo phòng thất bại',
        })
    }
}


export const editRoom = async (req, res) => {
    try {
        const { roomId } = req.params
        const {
            title,
            price,
            images,
            bedroom,
            bathroom,
            size,
            latitude,
            longitude,
            city,
            address,
            school,
            bus,
            restaurant,
            description,
            status,
        } = req.body
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            {
                title,
                price,
                images,
                bedroom,
                bathroom,
                size,
                latitude,
                longitude,
                city,
                address,
                school,
                bus,
                restaurant,
                description,
                status,
            },
            { new: true },
        )
        if (!updatedRoom) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy phòng',
            })
        }
        return res.status(httpStatus.OK).json({
            data: updatedRoom,
            message: 'Cập nhật phòng thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Cập nhật phòng thất bại',
        })
    }
}


export const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params
        const deletedRoom = await Room.findByIdAndDelete(roomId)
        if (!deletedRoom) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy phòng',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Xóa phòng thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Xóa phòng thất bại',
        })
    }
}

export const getRoomById = async (req, res) => {
    try {
        const { roomId } = req.params
        const room = await Room.findById(roomId)
        if (!room) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy phòng',
            })
        }
        await room.save()
        return res.status(httpStatus.OK).json({
            data: room,
            message: 'Lấy phòng thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Không tìm thấy phòng',
        })
    }
}