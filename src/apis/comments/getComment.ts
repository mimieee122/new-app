import { Prisma, PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const getComment = async (
    req: NextApiRequest,
    res: NextApiResponse,
    commentIdx: number
) => {
    try {
        const comment = await prisma.comment.findUnique({
            where: { idx: commentIdx },
        })
        return res.status(200).json(comment)
    } catch {
        res.status(500).json({ message: 'error' })
    }
}
