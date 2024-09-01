import { Prisma, PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const updateComment = async (
    req: NextApiRequest,
    res: NextApiResponse,
    commentIdx: number
) => {
    const { content } = req.body

    const comment = await prisma.comment.update({
        where: { idx: commentIdx }, //*
        data: {
            content: content,
        },
    })
    res.status(200).json(comment)
}
