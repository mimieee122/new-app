import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const deletePost = async (
    req: NextApiRequest,
    res: NextApiResponse,
    idx?: number
) => {
    if (idx === undefined) {
        const post = await prisma.post.deleteMany({})
        res.status(201).json(post)
    } else {
        const post = await prisma.post.delete({
            where: { idx: idx },
        })
        res.status(201).json(post)
    }
}
