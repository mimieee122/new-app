import { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client/extension'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const deleteComment = async (
    req: NextApiRequest,
    res: NextApiResponse,
    commentIdx: number
) => {
    const comment = await prisma.comment.delete({
        where: { commentIdx },
    })
    res.status(200).json(comment)
}
