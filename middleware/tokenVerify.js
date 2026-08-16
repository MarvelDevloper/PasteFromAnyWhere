import jwt from 'jsonwebtoken'

export const tokenVerify = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: 'Token not found!'
            })
        }

        const decode = jwt.verify(token, process.env.SECRET)

        req.userId = decode.userId

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: 'Invalid or expired token'
        })
    }
}