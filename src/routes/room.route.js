import express from 'express'
import * as roomController from '#controllers/room'

const router = express.Router()

router
    .route('/')
    .get(roomController.getListRooms)
    .post(roomController.createRoom)

router
    .route('/:roomId')
    .get(roomController.getRoomById)
    .put(roomController.editRoom)
    .delete(roomController.deleteRoom)

export default router