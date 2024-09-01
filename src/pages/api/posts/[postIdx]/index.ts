import { NextApiRequest, NextApiResponse } from 'next'
import { getonePost } from '@/apis/posts/getPost'
import { deletePost } from '@/apis/posts/deletePost'
import { parseCookies } from 'nookies'
import { verify } from 'jsonwebtoken'

// 굿

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const cookies = parseCookies({ req })
        const token = cookies['token']

        if (!token) {
            return res
                .status(400)
                .json({ message: '토큰이 제공되지 않았습니다.' })
        }

        const secret = process.env.JWT_SECRET

        if (!secret) {
            return res.status(400).json({
                message: 'JWT_SECRET 환경 변수가 설정되지 않았습니다.',
            })
        }

        try {
            const decoded = verify(token, secret) as any
            const userIdx = decoded.idx

            const post = (await getonePost(
                req,
                res,
                Number(req.query.idx)
            )) as any
            if (!post) {
                return res
                    .status(404)
                    .json({ message: '게시글을 찾을 수 없습니다.' })
            }

            if (post.authorIdx !== userIdx) {
                return res.status(403).json({ message: '권한이 없습니다.' })
            }

            if (req.method === 'GET') {
                return res.status(200).json(post)
            } else if (req.method === 'DELETE') {
                await deletePost(req, res, Number(req.query.idx))
                return res.status(204).end()
            } else {
                return res
                    .status(405)
                    .json({ message: '올바른 메소드가 아닙니다.' })
            }
        } catch (error) {
            return res
                .status(401)
                .json({ status: 'fail', message: '토큰이 올바르지 않습니다.' })
        }
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}
