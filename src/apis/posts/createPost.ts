import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createPost = async (req: NextApiRequest, res: NextApiResponse) => {
    const { title, content, authorIdx } = req.body

    if (!title || !content) {
        return res.status(400).json({ message: '제목, 내용 필수입니다.' })
    }

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorIdx,
            },
        })

        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: '게시물 생성 중 오류 발생' })
    }
}
