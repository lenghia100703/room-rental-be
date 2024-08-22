import authService from '#services/auth'

export const register = async (req, res) => {

}

export const login = async (req, res) => {
    await authService.login(req, res)
}

export const logout = async (req, res) => {

}

export const refreshToken = async (req, res) => {

}