import express from 'express'
import * as userController from '#controllers/user'
import { authorize } from '#middlewares/auth'

const router = express.Router()

router //
    .route('/me')
    .get(authorize(), userController.getCurrentUser)

router
    .route('/marked-rooms')
    .get(authorize(), userController.getMarkedRooms)

router //
    .route('/:id')
    .get(authorize(), userController.getUserById)
    .put(authorize(), userController.updateUser)

router
    .route('/check-room/:roomId')
    .get(authorize(), userController.getMarkedRoomByRoomId)

export default router