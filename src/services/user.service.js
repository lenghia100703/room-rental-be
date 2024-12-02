import httpStatus from 'http-status'
import User from '#models/user'
import { getUserByToken } from '#securities/jwt'
import { PAGE, PER_PAGE } from '#constants/pagination'

export const getUserById = async (req, res, id) => {
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Người dùng không tồn tại hoặc đã bị xóa',
            })
        }
        return res.status(httpStatus.OK).json({
            data: user,
            message: 'Lấy người dùng thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.NOT_FOUND).json({
            message: e.message || 'Không thể tìm thấy người dùng',
        })
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = getUserByToken(req, res)
        await getUserById(req, res, user._id)
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Không thể lấy thông tin người dùng',
        })
    }
}

export const getMarkedRooms = async (req, res) => {
    try {
        const userId = req.user._id
        const page = parseInt(req.query.page) || PAGE
        const limit = parseInt(req.query.perPage) || PER_PAGE
        const skip = (page - 1) * limit

        const user = await User.findById(userId).populate('markedRooms')
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy người dùng',
            })
        }
        const markedRooms = user.markedRooms.slice(skip, skip + limit)

        return res.status(httpStatus.OK).json({
            data: markedRooms,
            message: 'Lấy danh sách phòng đã đánh dấu thành công',
            page: page,
            totalPages: Math.ceil(user.markedRooms.length / limit),
        })
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message || 'Có lỗi xảy ra khi lấy danh sách phòng',
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate(
            id,
            {
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone
            },
            {
                new: true
            }
        )
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy người dùng',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Cập nhật hồ sơ thành công',
        })
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message || 'Có lỗi xảy ra khi cập nhật hồ sơ',
        })
    }
}

export const getMarkedRoomByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params
        const userId = req.user._id
        const user = await User.findById(userId).populate('markedRooms')
        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy người dùng',
            })
        }
        const markedRoom = user.markedRooms.find(room => room._id.toString() === roomId)
        if (!markedRoom) {
            return res.status(200).json({
                data: {
                    isMarked: false,
                },
                message: 'Phòng chưa được đánh dấu',
            })
        }
        return res.status(200).json({
            data: {
                isMarked: true,
            },
            message: 'Phòng đã được đánh dấu',
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Có lỗi xảy ra khi lấy thông tin phòng đã đánh dấu',
        })
    }
}


