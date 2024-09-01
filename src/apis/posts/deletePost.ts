import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const deletePost = async (
    req: NextApiRequest,
    res: NextApiResponse,
    idx: number
) => {
    const post = await prisma.post.delete({
        where: { idx },
    })
    res.status(201).json(post)
}
