import { verify } from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'

const me = (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = parseCookies({ req })
    const token = cookies['token']

    if (cookies === undefined) {
        return res.status(400).json({ message: '토큰이 없습니다.' })
    }

    let payload

    try {
        payload = verify(token, process.env.SECRET_KEY as any)
    } catch {
        return res.status(401).json({ message: '토큰이 올바르지 않습니다/' })
    }

    res.status(200).json({ status: 'success' })
}

export default me
