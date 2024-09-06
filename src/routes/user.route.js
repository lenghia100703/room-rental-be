import express from 'express'
import * as userController from '#controllers/user'

const router = express.Router()

router //
    .route('/me')
    .get(userController.getCurrentUser)

router //
    .route('/:id')
    .get(userController.getUserById)

export default router