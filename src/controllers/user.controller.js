import * as userService from '#services/user'

export const getUserById = async (req, res) => {
    await userService.getUserById(req, res, req.params.id)
}

export const getCurrentUser = async (req, res) => {
    await userService.getCurrentUser(req, res)
}

export const getMarkedRooms = async (req, res) => {
    await userService.getMarkedRooms(req, res)
}

export const getMarkedRoomByRoomId = async (req, res) => {
    await userService.getMarkedRoomByRoomId(req, res)
}