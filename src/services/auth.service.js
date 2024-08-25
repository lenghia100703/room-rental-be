import APIError from '#exceptions/api'
import httpStatus from 'http-status'
import { generateAccessToken, generateRefreshToken } from '#securities/jwt'
import User from '#models/user'
import { omit } from 'lodash-es'


export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user || !(await user.passwordMatches(req.body.password))) {
            throw new APIError({
                message: 'Tên đăng nhập hoặc mật khẩu không đúng',
                status: httpStatus.UNAUTHORIZED,
            })
        }

        const accessToken = generateAccessToken(res, user)
        const refreshToken = generateRefreshToken(res, user)

        await User.findByIdAndUpdate(user._id,
            {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
            {
                new: true,
            },
        )

        const safeUser = omit(user, ['password'])

        return res.status(httpStatus.OK).json({
            message: 'Đăng nhập thành công',
            data: {
                safeUser,
            },
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Lỗi đăng nhập',
        })
    }
}
export const register = async (req, res) => {

}
export const logout = async (req, res) => {

}
export const refreshToken = async (req, res) => {

}
