import express from 'express'
import * as controller from '#controllers/auth'

const router = express.Router()

router //
    .route('/register')
    .post(controller.register)

router //
    .route('/login')
    .post(controller.login)

router //
    .route('/logout')
    .post(controller.logout)

router //
    .route('/refresh-token')
    .post(controller.refreshToken)

export default router