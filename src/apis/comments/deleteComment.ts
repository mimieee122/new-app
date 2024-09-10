import { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client/extension'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const deleteComment = async (
    req: NextApiRequest,
    res: NextApiResponse,
    commentIdx?: number
) => {
    if (commentIdx) {
        const comment = await prisma.comment.delete({
            where: { commentIdx: commentIdx },
        })
        res.status(200).json(comment)
    } else {
        await prisma.comment.findMany({})
        res.status(201).json({ message: '전부 삭제 완료' })
    }
}
