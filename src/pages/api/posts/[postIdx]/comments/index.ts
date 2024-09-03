import { NextApiResponse, NextApiRequest } from 'next'
import { PrismaClient } from '@prisma/client/extension'
import { getComment } from '@/apis/comments/getComment'
import { createComment } from '@/apis/comments/createComment'
import { verify } from 'jsonwebtoken'
import { parseCookies } from 'nookies'

// 토큰 인증 코드 적용

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
    authorIdx: number,
    postIdx: number
) {
    try {
        const cookies = parseCookies({ req })
        // 서버에 전달된 쿠키 문자열을 js 객체로 변환해주는 함수

        const token = cookies['token']
        const secret = process.env.SECRET_JWT

        if (!secret) {
            throw new Error('SECRET_JWT 환경 변수가 설정되지 않았습니다.')
        }

        if (!token) {
            return res
                .status(400)
                .json({ message: '토큰이 발급되지 않았습니다.' })
        }
        try {
            const decoded = verify(token, secret) as any
            const authorIdx = decoded.idx

            if (req.method === 'GET') {
                await getComment(req, res, postIdx)
            } else if (req.method == 'POST') {
                await createComment(req, res, authorIdx, postIdx)
            } else {
                res.status(405).json({ message: '지원하지 않는 메서드입니다.' })
            }
        } catch {
            return res
                .status(400)
                .json({ message: '토큰이 올바르지 않습니다.' })
        }
    } catch {
        res.status(500).json('error')
    }
}
