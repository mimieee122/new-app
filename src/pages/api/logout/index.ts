import { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie } from 'nookies'

const logOut = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        destroyCookie({ res }, 'token', { path: '/' })
        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}

export default logOut
