import { Prisma, PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const updatePost = async (
    req: NextApiRequest,
    res: NextApiResponse,
    postIdx: number
) => {
    const cookies = parseCookies({ req })
    const token = cookies['token']

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' })
    }

    try {
        //토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token, process.env.SECRET_JWT as string) as {
            idx: number
        }

        const { title, content } = req.body

        // 게시물 정보 가져오기
        const posts = await prisma.post.findUnique({
            where: { idx: postIdx },
            select: { authorIdx: true }, // 작성자 ID만 가져오기
        })

        if (!posts) {
            return res
                .status(404)
                .json({ message: '게시물을 찾을 수 없습니다.' })
        }

        if (decoded.idx !== posts.authorIdx) {
            return res
                .status(400)
                .json({ message: '게시물을 수정할 권한이 없습니다.' })
        }

        const post = await prisma.post.update({
            where: { idx: postIdx }, //*
            data: {
                title: title,
                content: content,
            },
        })
        res.status(200).json(post)
    } catch (error) {
        console.error('게시물 업데이트 중 오류 발생:', error)
        return res
            .status(500)
            .json({ message: '게시물 업데이트에 실패했습니다.' })
    }
}
