import express from 'express'
import authRoutes from '#routes/auth'
import userRoutes from '#routes/user'
import roomRoutes from '#routes/room'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/room', roomRoutes)

export default router