// complete

// * 쿠키는 도메인별로 저장
// 쿠키는 한 번에 모든 트래픽 움직임 ---> 필요할 때만 쓴다 *

// < me api >
import type { NextApiRequest, NextApiResponse } from 'next'
//import { Jwt } from 'jsonwebtoken'

const jwt = require('jsonwebtoken')

const secretKey = process.env.JWT_SECRET

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.cookies // 쿠키에서 (이름이 토큰인) 쿠키를 뺀 것
    if (token == undefined) {
        return res
            .status(401)
            .json({ status: 'fall', message: '토큰이 없습니다.' })
    }

    let payload
    try {
        payload = jwt.verify(token, secretKey)
        return res.status(200).json({ status: 'success', payload })
    } catch {
        return res.status(401).json({ status: 'fail' })
    }
}
