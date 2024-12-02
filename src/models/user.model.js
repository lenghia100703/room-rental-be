import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import config from '#configs/environment'
import BaseModel from '#models/base'
import { ROLE } from '#constants/role'

const { env } = config
const roles = ['user', 'owner']

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
        phone: {
            type: String,
            match: /(0[3|5|7|8|9])+([0-9]{8})\b/,
            default: ''
        },
        username: {
            type: String,
            maxlength: 128,
            required: true,
            index: true,
            trim: true,
        },
        services: {
            facebook: String,
            google: String,
        },
        role: {
            type: String,
            required: true,
            enum: [ROLE.OWNER, ROLE.USER],
            default: ROLE.USER,
        },
        avatar: {
            type: String,
            trim: true,
            default: config.defaultAvatar
        },
        accessToken: {
            type: String,
            trim: true,
        },
        refreshToken: {
            type: String,
            trim: true,
        },
        markedRooms: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
        }],
    },
    {
        timestamps: true,
    },
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
    transform() {
        const transformed = {}
        const fields = ['_id', 'username', 'accessToken', 'email', 'avatar', 'role', 'createdAt', 'updatedAt']

        for (const field of fields) {
            transformed[field] = this[field]
        }

        return transformed
    },

    async passwordMatches(password) {
        return bcrypt.compare(password, this.password)
    },
})

userSchema.statics = {
    roles,
}

const baseModel = new BaseModel(userSchema)

const User = baseModel.createModel('User')

export default User