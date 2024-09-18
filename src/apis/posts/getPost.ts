import { Prisma, PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const geteveryPost = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const posts = await prisma.post.findMany({})

        res.status(200).json(posts)
    } catch {
        res.status(500).json({ message: 'error' })
    }
}

export const getonePost = async (
    req: NextApiRequest,
    res: NextApiResponse,
    postIdx: number
) => {
    try {
        const post = await prisma.post.findUnique({
            where: { idx: postIdx },
        })
        return res.status(200).json(post)
    } catch {
        res.status(500).json({ message: 'error' })
    }
}
