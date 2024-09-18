import { NextApiRequest, NextApiResponse } from 'next'
import { getonePost } from '@/apis/posts/getPost'
import { deletePost } from '@/apis/posts/deletePost'
import { parseCookies } from 'nookies'
import { verify } from 'jsonwebtoken'
import { updatePost } from '@/apis/posts/updatePost'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const secret = process.env.SECRET_JWT

    if (!secret) {
        console.error('JWT_SECRET is not defined.')
        return res.status(500).json({
            message: 'JWT_SECRET 환경 변수가 설정되지 않았습니다.',
        })
    }

    try {
        // *** req.query.postIdx 라고 썼어야함 !!!!**************
        const postIdx = Number(req.query.postIdx)

        if (req.method === 'GET') {
            const post = await getonePost(req, res, postIdx)
            if (post === null) {
                return res
                    .status(404)
                    .json({ message: '게시물을 찾을 수 없습니다.' })
            }
            return res.status(202).json(post)
        } else if (req.method === 'PUT') {
            const post = await updatePost(req, res)
            if (post === null) {
                return res
                    .status(404)
                    .json({ message: '게시물을 찾을 수 없습니다.' })
            }
            return res.status(200).json(post)
        } else if (req.method === 'DELETE') {
            const post = await deletePost(req, res, postIdx)
            if (post === null) {
                return res
                    .status(404)
                    .json({ message: '게시물을 찾을 수 없습니다.' })
            }
            return res.status(200).json({ message: '게시글이 삭제되었습니다.' })
        } else {
            return res
                .status(405)
                .json({ message: '허용되지 않은 메서드입니다.' })
        }
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: '토큰이 만료되었습니다.' })
        }
        console.error('API error:', error)
        return res.status(401).json({ message: '토큰 검증에 실패했습니다.' })
    }
}
