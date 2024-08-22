import bcrypt from 'bcryptjs'
import { addMinutes, getUnixTime } from 'date-fns'
import jwt from 'jwt-simple'
import mongoose from 'mongoose'
import config from '#configs/environment'

const { env } = config
const { jwtSecret, jwtExpirationInterval } = config.auth
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
        const fields = ['id', 'name', 'email', 'avatar', 'role', 'createdAt']

        for (const field of fields) {
            transformed[field] = this[field]
        }

        return transformed
    },

    token() {
        const payload = {
            exp: getUnixTime(addMinutes(Date.now(), jwtExpirationInterval)),
            iat: getUnixTime(Date.now()),
            sub: this._id,
        }
        return jwt.encode(payload, jwtSecret)
    },

    async passwordMatches(password) {
        return bcrypt.compare(password, this.password)
    },
})

const User = mongoose.model('User', userSchema)

export default User