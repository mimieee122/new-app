import { NextApiRequest, NextApiResponse } from 'next'
import { getonePost } from '@/apis/posts/getPost'
import { deletePost } from '@/apis/posts/deletePost'
import { parseCookies } from 'nookies'
import { verify } from 'jsonwebtoken'

// API 핸들러 함수
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // 환경 변수 가져오기
    const secret = process.env.SECRET_JWT

    if (!secret) {
        return res.status(500).json({
            message: 'JWT_SECRET 환경 변수가 설정되지 않았습니다.',
        })
    }

    // 쿠키에서 토큰 가져오기
    const cookies = parseCookies({ req })
    const token = cookies['token']

    if (!token) {
        return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' })
    }

    try {
        // 토큰 검증
        const decoded = verify(token, secret) as any
        const authorIdx = decoded.authorIdx

        // 게시글 조회 (GET)
        if (req.method === 'GET') {
            const post = await getonePost(req, res, Number(req.query.idx))
            if (post === undefined) {
                return res
                    .status(404)
                    .json({ message: '게시글을 찾을 수 없습니다.' })
            }
            return res.status(200).json(post)
        }

        // 게시글 삭제 (DELETE)
        if (req.method === 'DELETE') {
            const post = await getonePost(req, res, Number(req.query.idx))
            if (post === undefined) {
                return res
                    .status(404)
                    .json({ message: '게시글을 찾을 수 없습니다.' })
            }
            // 권한 확인
            if (decoded.authorIdx !== authorIdx) {
                return res.status(403).json({ message: '권한이 없습니다.' })
            }
            await deletePost(req, res, Number(req.query.idx))
            return res.status(200).json({ message: '게시글이 삭제되었습니다.' })
        }

        // 올바르지 않은 메서드
        return res.status(405).json({ message: '지원하지 않는 메서드입니다.' })
    } catch (error) {
        console.error('Token verification or API handling failed:', error)
        return res.status(401).json({ message: '토큰이 올바르지 않습니다.' })
    }
}
