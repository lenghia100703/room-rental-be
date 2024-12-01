import express from 'express'
import * as roomController from '#controllers/room'
import { authorize } from '#middlewares/auth'

const router = express.Router()

router
    .route('/')
    .get(roomController.getListRooms)
    .post(authorize(), roomController.createRoom)

router
    .route('/:roomId')
    .get(authorize(), roomController.getRoomById)
    .put(authorize(), roomController.editRoom)
    .delete(authorize(), roomController.deleteRoom)

router
    .route('/mark-room/:roomId')
    .post(authorize(), roomController.markRoom)

export default router