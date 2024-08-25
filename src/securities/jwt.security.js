import jwt from 'jsonwebtoken'
import config from '#configs/environment'
import { setCookie } from '#utils/cookie'
import { getUnixTime } from 'date-fns'
import { JWT_CONSTANTS } from '#constants/index'
import http from 'node:http'

const { jwtSecret, jwtAccessExpiration, jwtRefreshExpiration } = config.auth

export const generateAccessToken = (res, user) => {
    const payload = {
        sub: user._id,
        role: user.role,
        iat: getUnixTime(Date.now()),
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtAccessExpiration })

    setCookie(res, JWT_CONSTANTS.COOKIE_ACCESS_TOKEN, token,
        {
            maxAge: jwtAccessExpiration,
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'None',
        },
    )

    res.addHeader('Authorization', `Bearer ${token}`)
    res.addHeader(JWT_CONSTANTS.HEADER_ACCESS_TOKEN, token)

    return token
}

export const generateRefreshToken = (res, user) => {
    const payload = {
        sub: user._id,
        role: user.role,
        iat: getUnixTime(Date.now()),
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtRefreshExpiration })

    setCookie(res, JWT_CONSTANTS.COOKIE_REFRESH_TOKEN, token,
        {
            maxAge: jwtRefreshExpiration,
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'None',
        },
    )

    res.addHeader(JWT_CONSTANTS.HEADER_REFRESH_TOKEN, token)

    return token
}
