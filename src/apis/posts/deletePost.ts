import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const deletePost = async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = parseCookies({ req })
    const token = cookies['token']

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' })
    }

    try {
        //토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token, process.env.SECRET_JWT as string) as {
            idx: number
        }

        const { authorIdx, postIdx } = req.body

        if (decoded.idx !== authorIdx) {
            return res
                .status(400)
                .json({ message: '게시물을 삭제할 권한이 없습니다' })
        }

        const post = await prisma.post.delete({
            where: { idx: postIdx },
        })
        res.status(201).json(post)
    } catch (error) {
        console.error('게시물 삭제 중 오류 발생:', error)
        return res.status(500).json({ message: '게시물 삭제에 실패했습니다.' })
    }
}
