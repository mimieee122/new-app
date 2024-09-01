import { NextApiRequest, NextApiResponse } from 'next'
import { getComment } from '@/apis/comments/getComment'
import { updateComment } from '@/apis/comments/updateComment'
import { deleteComment } from '@/apis/comments/deleteComment'
import { parseCookies } from 'nookies'
import { verify } from 'jsonwebtoken'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cookies = parseCookies({ req })
    const token = cookies['token']

    if (!token) {
        return res.status(400).json({ message: '토큰이 제공되지 않았습니다.' })
    }

    const secret = process.env.SECRET_JWT as any

    try {
        const decoded = verify(token, secret) as any
        const commentIdx = decoded.idx

        if (req.method == 'GET') {
            await getComment(req, res, commentIdx)
        } else if (req.method == 'PUT') {
            await updateComment(req, res, commentIdx)
        } else if (req.method == 'DELETE') {
            await deleteComment(req, res, commentIdx)
        }
    } catch {
        return res.status(400).json({ message: '토큰이 올바르지 않습니다.' })
    }
}
