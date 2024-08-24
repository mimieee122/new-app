import { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie } from 'nookies'

export const logoutUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            // 로그아웃 처리
            // 쿠키에서 'token'을 삭제합니다.
            destroyCookie({ res }, 'token', {
                path: '/', // 쿠키의 경로 설정
            })

            res.status(200).json({
                message: '로그아웃 성공',
            })
        } else {
            res.status(400).json({
                message: '지원하지 않는 메서드입니다.',
            })
        }
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}
