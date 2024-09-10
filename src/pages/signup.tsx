import React from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

export default function Signup() {
    const signUpMutation = useMutation({
        mutationFn: async ({ nickname, password }: any) =>
            await axios.post('/api/signup', {
                nickname,
                password,
            }),
        onSuccess: () => {
            window.location.href = '/'
            alert('회원가입이 완료되었습니다.')
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

    const homePage = () => {
        window.location.href = '/'
    }

    return (
        <div>
            <div className="text-white mt-[40px]">
                <button type="button" onClick={homePage}>
                    HOME
                </button>
            </div>
            <form
                onSubmit={signUp}
                className="flex flex-col gap-2 mt-[50px] w-96 text-black p-4 bg-gray-100 rounded-xl"
            >
                <p>회원가입</p>
                <label htmlFor="nickname">ID</label>
                <input
                    type="text"
                    placeholder="nickname"
                    id="nickname"
                    name="nickname"
                />
                <label htmlFor="password">password</label>
                <input
                    type="password"
                    placeholder="password"
                    id="password"
                    name="password"
                />
                <button type="submit">회원가입</button>
            </form>
        </div>
    )
}
