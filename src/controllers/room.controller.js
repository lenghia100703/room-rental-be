import * as roomService from '#services/room'

export const getListRooms = async (req, res) => {
    await roomService.getListRooms(req, res)
}

export const createRoom = async (req, res) => {
    await roomService.createRoom(req, res)
}

export const editRoom = async (req, res) => {
    await roomService.editRoom(req, res)
}

export const deleteRoom = async (req, res) => {
    await roomService.deleteRoom(req, res)
}

export const getRoomById = async (req, res) => {
    await roomService.getRoomById(req, res)
}

export const markRoom = async (req, res) => {
    await roomService.markRoom(req, res)
}

export const getRoomByOwner = async (req, res) => {
    await roomService.getRoomByOwner(req, res)
}