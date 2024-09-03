import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
// sign : jwt를 생성하는 함수
import { setCookie } from 'nookies'

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { nickname, password } = req.body

        if (!nickname || !password) {
            return res
                .status(400)
                .json({ message: '아이디, 비밀번호 작성 요망' })
        }

        const user = await prisma.user.findUnique({
            where: {
                nickname,
            },
        })

        // 아래 코드 없으니 user에 빨간 줄 뜸
        if (user === null) {
            return res
                .status(400)
                .json({ message: '닉네임에 해당하는 유저가 없습니다.' })
        }

        const hashedPassword = user.password
        const isCorrect = await compare(password, hashedPassword)

        if (!isCorrect) {
            return res
                .status(400)
                .json({ message: '비밀번호가 일치하지 않습니다.' })
        }

        const payload = {
            nickname: user.nickname,
            idx: user.idx,
            createAt: user.createdAt,
            updateAt: user.updatedAt,
        }

        const token = await sign(payload, process.env.SECRET_JWT as any, {
            expiresIn: '10h',
        })

        setCookie({ res }, 'token', token, {
            maxAge: 60 * 60, // 1 hour
            path: '/', // Cookie path
            httpOnly: true, // Cannot be accessed by JavaScript
            secure: false, // Only sent over HTTP
        })

        res.status(200).json({ message: 'success', payload })
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}

export default handler
