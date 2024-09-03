import { verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'
import { JwtPayload } from 'jsonwebtoken' // ?

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
        payload = verify(token, process.env.SECRET_JWT as any)

        const { nickname } = payload as JwtPayload
        return res.status(200).json({
            status: 'success',
            message: '올바르게 토큰 제공 완료',
            nickname,
        })
    } catch {
        return res
            .status(401)
            .json({ status: 'fail', message: '토큰이 올바르지 않습니다.' })
    }
}
