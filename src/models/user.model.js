import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import config from '#configs/environment'
import baseModel from '#models/base'

const { env } = config
const roles = ['user', 'admin']

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            match: /^\S+@\S+\.\S+$/,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 128,
        },
        name: {
            type: String,
            maxlength: 128,
            index: true,
            trim: true,
        },
        services: {
            facebook: String,
            google: String,
        },
        role: {
            type: String,
            enum: roles,
            default: 'user',
        },
        avatar: {
            type: String,
            trim: true,
        },
        accessToken: {
            type: String,
            trim: true,
        },
        refreshToken: {
            type: String,
            trim: true,
        }
    }
)

userSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) return next()

        const rounds = env === 'test' ? 1 : 10

        this.password = await bcrypt.hash(this.password, rounds)

        return next()
    } catch (error) {
        return next(error)
    }
})

userSchema.method({
    async passwordMatches(password) {
        return bcrypt.compare(password, this.password)
    },
})

const User = baseModel.createModel('User')

export default User