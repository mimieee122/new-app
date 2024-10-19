import React from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import Button from '@/components/button'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

export default function Signup() {
    const router = useRouter()
    const signUpMutation = useMutation({
        mutationFn: async ({ nickname, password }: any) =>
            await axios.post('/api/signup', {
                nickname,
                password,
            }),
        onSuccess: () => {
            toast.success('회원가입이 완료되었습니다.')
            router.push('/')
        },
    })

    // const checkNicknameExists = async (nickname: string) => {
    //     const { data } = await axios.get(
    //         `/api/check-nickname?nickname=${nickname}`
    //     )
    //     return data.exists // true/false 반환
    // }

    const signUp = async (e: any) => {
        e.preventDefault()
        // const result = await checkNicknameExists(e.currentTarget.nickname.value)
        // if (result) {
        //     await window.location.reload()
        //     alert('이미 존재하는 아이디 입니다.')
        // } else {
        signUpMutation.mutate({
            nickname: e.currentTarget.nickname.value,
            password: e.currentTarget.password.value,
        })
    }

    return (
        <div
            className={`${'signUp-bg'} flex flex-row justify-center w-screen min-h-screen`}
        >
            <div className="flex flex-col gap-[50px]">
                <form
                    onSubmit={signUp}
                    className="flex flex-col  login border-black border-[2px] border-solid gap-[20px] justify-center items-center mt-[200px] w-[900px] h-[400px] text-black p-4 bg-white bg-opacity-40 rounded-xl"
                >
                    <p className="signIn text-[40px] text-center">
                        CREATE ACCOUNT
                    </p>
                    <label htmlFor="nickname">ID</label>
                    <input
                        type="text"
                        placeholder="ID"
                        id="nickname"
                        name="nickname"
                        className="text-center"
                    />
                    <label htmlFor="password">password</label>
                    <input
                        type="password"
                        placeholder="password"
                        id="password"
                        name="password"
                        className="text-center mb-[20px]"
                    />
                    <Button>회원가입</Button>
                </form>

                <div className="mt-[40px] login">
                    <Link href={'/'}>
                        <Button>HOME</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
