import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const deletePost = async (
    req: NextApiRequest,
    res: NextApiResponse,
    postIdx: number
) => {
    const cookies = parseCookies({ req })
    const token = cookies['token']

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' })
    }

    try {
        //토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token, process.env.SECRET_JWT as string) as {
            idx: number
            nickname: string
        }

        // ***********************************
        // const { authorIdx } = req.body
        // 위와 같은 코드는 해당 맥락에서 성립 X

        const posts = await prisma.post.findUnique({
            where: { idx: postIdx },
            select: {
                nickname: true,
            },
        })

        if (!posts) {
            return res
                .status(404)
                .json({ message: '게시물을 찾을 수 없습니다.' })
        }

        if (decoded.nickname !== posts.nickname) {
            return res
                .status(400)
                .json({ message: '게시물을 삭제할 권한이 없습니다' })
        }

        const post = await prisma.post.delete({
            where: { idx: postIdx },
        })
        res.status(200).json(post)
    } catch (error) {
        console.error('게시물 삭제 중 오류 발생:', error)
        return res.status(500).json({ message: '게시물 삭제에 실패했습니다.' })
    }
}
