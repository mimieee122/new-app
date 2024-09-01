import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { geteveryPost } from './../../../apis/posts/getPost'
import { createPost } from '@/apis/posts/createPost'
import { parseCookies } from 'nookies'
import { verify } from 'jsonwebtoken'

// 굿

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cookies = parseCookies({ req })
    const token = cookies['token']

    try {
        if (!token) {
            return res
                .status(401)
                .json({ message: '토큰이 제공되지 않았습니다.' })
        }

        const secret = process.env.SECRET_JWT as any
        try {
            const decoded = verify(token, secret) as any
            const authorIdx = decoded.idx

            if (req.method == 'GET') {
                await geteveryPost(req, res)
            } else if (req.method == 'PUT') {
                await createPost(req, res, authorIdx)
            } else {
                res.status(400).json({
                    message: '지원하지 않는 메서드입니다.',
                })
            }
        } catch {
            return res
                .status(401)
                .json({ status: 'fail', message: '토큰이 올바르지 않습니다.' })
        }
    } catch {
        res.status(500).json({ message: '서버 오류 발생' })
    }
}
