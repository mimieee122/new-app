import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken' // jwt 직접 임포트

const prisma = new PrismaClient()

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { nickname, password } = req.body
        //console.log('🚀 ~ createUser ~ password:', password)
        //console.log('🚀 ~ createUser ~ name:', name)

        // if (!name || !password) {
        //     return res.status(400).json({
        //         message: '이름, 비밀번호 모두 작성하세요.',
        //     })
        // }

        // 비밀번호 해시화
        const hashedPassword = await hash(password, 10)
        //console.log('🚀 ~ createUser ~ hashedPassword:', hashedPassword)

        // 사용자 생성
        const user = await prisma.user.create({
            data: {
                nickname: nickname,
                password: hashedPassword,
            },
        })
        //console.log('🚀 ~ createUser ~ user:', user)

        // JWT 생성
        const token = sign(
            { idx: user.idx },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '10h',
            }
        )
        //console.log('🚀 ~ createUser ~ token:', token)

        res.status(200).json({ message: 'success', user, token })
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error)
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        })
    }
}
