import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { parseCookies } from 'nookies'
const prisma = new PrismaClient()

export const createPost = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: '허용되지 않은 메서드입니다.' })
    }

    const cookies = parseCookies({ req })
    const token = cookies['token']

    //****************************************** */
    if (!token) {
        return res
            .status(401)
            .json({ message: '로그인 후 게시물 작성이 가능합니다.' })
    }

    try {
        // 토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token, process.env.SECRET_JWT as string) as {
            idx: number
            nickname: string
        }
        const { title, content } = req.body

        if (!title || !content) {
            return res.status(400).json({ message: ' 제목, 내용 필수입니다.' })
        }

        const user = await prisma.user.findUnique({
            where: {
                idx: decoded.idx,
            },
            select: {
                nickname: true,
            },
        })

        if (!user) {
            return res.status(401).json({ message: '유저가 없습니다' })
        }

        // 게시물 생성 시 authorIdx를 JWT에서 추출한 사용자 idx로 설정
        const post = await prisma.post.create({
            data: {
                title,
                content,
                nickname: String(user.nickname),
                authorIdx: Number(decoded.idx), // 토큰에서 추출한 사용자 idx 사용
            },
        })

        return res.status(201).json(post)
    } catch (error) {
        console.error('게시물 생성 중 오류 발생:', error)
        return res.status(500).json({ message: '게시물 생성에 실패했습니다.' })
    }
}
