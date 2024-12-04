import Room from '#models/room'
import { PAGE, PER_PAGE } from '#constants/pagination'
import httpStatus from 'http-status'
import User from '#models/user'
import { removeVietnameseTones } from '#utils/removeVietnameseTones'

export const getListRooms = async (req, res) => {
    try {
        let { page, perPage, city, bedroom, bathroom, priceFrom, priceTo } = req.query
        if (!page || !perPage) {
            page = PAGE
            perPage = PER_PAGE
        }
        const filter = {}
        if (city) {
            const normalizedCity = removeVietnameseTones(city)
            filter.city = {
                $regex: new RegExp(city, 'i'),
            }
        }
        if (bedroom) {
            filter.bedroom = parseInt(bedroom, 10)
        }
        if (bathroom) {
            filter.bathroom = parseInt(bathroom, 10)
        }
        if (priceFrom) {
            filter.price = { ...filter.price, $gte: parseFloat(priceFrom) }
        }
        if (priceTo) {
            filter.price = { ...filter.price, $lte: parseFloat(priceTo) }
        }
        let rooms, totalRooms
        if (parseInt(perPage, 10) === -1) {
            rooms = await Room.find(filter)
            totalRooms = rooms.length
        } else {
            const skip = (page - 1) * perPage
            const limit = parseInt(perPage, 10)
            rooms = await Room.find(filter).skip(skip).limit(limit)
            totalRooms = await Room.countDocuments(filter)
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
        const ownerId = req.user._id
        const user = await User.findById(ownerId)
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy người dùng',
            })
        }
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

export const markRoom = async (req, res) => {
    try {
        const { roomId } = req.params
        const userId = req.user._id

        const room = await Room.findById(roomId)
        if (!room) {
            return res.status(404).json({
                message: 'Không tìm thấy phòng',
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy người dùng',
            })
        }
        const alreadyMarked = user.markedRooms.includes(roomId)
        if (alreadyMarked) {
            user.markedRooms = user.markedRooms.filter((id) => id.toString() !== roomId.toString())
            await user.save()
            return res.status(200).json({
                message: 'Phòng đã bỏ đánh dấu',
            })
        } else {
            user.markedRooms.push(roomId)
            await user.save()
            return res.status(200).json({
                message: 'Phòng đã được đánh dấu',
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Có lỗi xảy ra khi đánh dấu phòng',
        })
    }
}

export const getRoomByOwner = async (req, res) => {
    try {
        const ownerId = req.user._id
        let { page, perPage } = req.query
        let rooms, totalRooms
        if (!page || !perPage) {
            page = PAGE
            perPage = PER_PAGE
        }
        const user = await User.findById(ownerId)
        if (!user) {
            return res.status(404).json({
                message: 'Chủ trọ không tồn tại',
            })
        }
        if (parseInt(perPage, 10) === -1) {
            rooms = await Room.find({
                owner: ownerId,
            })
            totalRooms = rooms.length
        } else {
            const skip = (page - 1) * perPage
            const limit = parseInt(perPage, 10)
            rooms = await Room.find({ owner: ownerId }).skip(skip).limit(limit)
            totalRooms = await Room.find({ owner: ownerId }).countDocuments()
        }
        return res.status(httpStatus.OK).json({
            data: rooms,
            page: parseInt(page, 10),
            totalPages: perPage === -1 ? 1 : Math.ceil(totalRooms / perPage),
            message: 'Lấy danh sách phòng thành công',
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Lấy danh sách phòng thất bại',
        })
    }
}
