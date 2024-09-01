import { Prisma, PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const updatePost = async (
    req: NextApiRequest,
    res: NextApiResponse,
    idx: number
) => {
    const { title, content } = req.body

    const post = await prisma.post.update({
        where: { idx }, //*
        data: {
            title: title,
            content: content,
        },
    })
    res.status(200).json(post)
}
