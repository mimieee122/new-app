import { verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'

export default function me(req: NextApiRequest, res: NextApiResponse) {
    const cookies = parseCookies({ req })
    const token = cookies['token']

    if (token === undefined) {
        return res
            .status(401)
            .json({ status: 'fail', message: '토큰이 없습니다.' })
    }
    let payload
    try {
        payload = verify(token, process.env.JWT_SECRET as any)
        return res
            .status(200)
            .json({ status: 'success', message: '올바르게 토큰 제공 완료' })
    } catch {
        return res
            .status(401)
            .json({ status: 'fail', message: '토큰이 올바르지 않습니다.' })
    }
    res.status(200).json({ status: 'success' })
}
