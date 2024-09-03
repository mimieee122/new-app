import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createPost = async (
    req: NextApiRequest,
    res: NextApiResponse,
    authorIdx: number
) => {
    const { title, content } = req.body

    const post = await prisma.post.create({
        data: {
            title,
            content,
            authorIdx,
        },
    })
    try {
        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json({ message: '게시물 생성 중 오류 발생' })
    }
}
