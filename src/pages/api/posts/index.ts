import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { createPost } from '@/apis/posts/createPost'
import { parseCookies } from 'nookies'
import { verify, JwtPayload } from 'jsonwebtoken'
import { geteveryPost } from '@/apis/posts/getPost'

const prisma = new PrismaClient()

interface DecodedToken extends JwtPayload {
    authorIdx: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const secret = process.env.SECRET_JWT

    if (!secret) {
        return res
            .status(500)
            .json({ message: 'JWT_SECRET 환경 변수가 설정되지 않았습니다.' })
    }

    // 쿠키에서 토큰 가져오기
    // const cookies = parseCookies({ req })
    // const token = cookies['token']

    // if (!token) {
    //     return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' })
    // }

    try {
        // 토큰 검증
        // const decoded = verify(token, secret) as DecodedToken
        // const authorIdx = decoded.authorIdx

        // POST 요청 처리
        if (req.method === 'POST') {
            const { title, content, nickname } = req.body

            if (!title || !content || !nickname) {
                return res
                    .status(400)
                    .json({ message: '제목과 내용이 필요합니다.' })
            }

            try {
                await createPost(req, res)
                return res
                    .status(201)
                    .json({ message: '게시물이 성공적으로 생성되었습니다.' })
            } catch (error) {
                console.error('게시물 생성 중 오류 발생:', error)
                return res
                    .status(500)
                    .json({ message: '게시물 생성에 실패했습니다.' })
            }
        } else if (req.method === 'GET') {
            await geteveryPost(req, res)
            return res.status(202).json({ message: '게시물 조회 완료.' })
        } else {
            return res
                .status(405)
                .json({ message: '지원하지 않는 메서드입니다.' })
        }
    } catch (error) {
        console.error('토큰 검증 중 오류 발생:', error)
        return res.status(401).json({ message: '토큰이 올바르지 않습니다.' })
    }
}
