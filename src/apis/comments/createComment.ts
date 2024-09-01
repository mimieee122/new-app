import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createComment = async (
    req: NextApiRequest,
    res: NextApiResponse,
    authorIdx: number,
    postIdx: number
) => {
    const idx = req.query
    const { content } = req.body
    const commentIdx = Number(idx)
    const comment = await prisma.comment.create({
        data: {
            authorIdx: authorIdx,
            postIdx: postIdx,
            idx: commentIdx,
            content: content,
        },
    })
    res.status(200).json(comment)
}
