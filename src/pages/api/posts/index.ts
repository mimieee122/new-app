import { NextApiRequest, NextApiResponse } from 'next'
import { geteveryPost } from '@/apis/posts/getPost'
import { createPost } from '@/apis/posts/createPost'
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
        return res
            .status(500)
            .json({ message: 'JWT_SECRET 환경 변수가 설정되지 않았습니다.' })
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

        // GET 요청: 모든 게시글 가져오기
        if (req.method === 'GET') {
            await geteveryPost(req, res)
            return // GET 요청에 대해 더 이상의 처리가 필요 없으므로 반환
        }

        // POST 요청: 게시글 생성
        else if (req.method === 'POST') {
            await createPost(req, res)
            return // POST 요청에 대해 더 이상의 처리가 필요 없으므로 반환
        }

        // 지원하지 않는 메서드
        return res.status(405).json({ message: '지원하지 않는 메서드입니다.' })
    } catch (error) {
        console.error('토큰 검증 중 오류 발생:', error)
        return res.status(401).json({ message: '토큰이 올바르지 않습니다.' })
    }
}
