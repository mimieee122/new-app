import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '@/apis/users/createUser'
import { verify } from 'jsonwebtoken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            // 회원가입 처리
            const createdUser = await createUser(req, res) // 사용자 생성 함수 호출

            // 성공적으로 생성된 경우
            return res.status(201).json({
                message: '회원가입이 완료되었습니다.',
                user: createdUser, // 생성된 사용자 정보 반환
            })
        }

        // POST가 아닌 다른 메서드일 경우 토큰 검증
        const token = req.cookies.token

        if (!token) {
            return res
                .status(401)
                .json({ message: '토큰이 제공되지 않았습니다.' })
        }

        // 토큰 검증
        try {
            const decoded = verify(token, process.env.JWT_SECRET as string)
            return res
                .status(200)
                .json({ message: '토큰이 유효합니다.', user: decoded })
        } catch (err) {
            return res
                .status(400)
                .json({ message: '토큰이 올바르지 않습니다.' })
        }
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}

export default handler
