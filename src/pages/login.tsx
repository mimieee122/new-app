import { useMutation, useQuery } from '@tanstack/react-query'
// api 쏘아주는 라이브러리
import axios from 'axios'
import LoginCom from '@/components/login_com'
import React from 'react'

function Login() {
    const loginMutation = useMutation({
        mutationFn: async ({ nickname, password }: any) =>
            await axios.post('/api/login', { nickname, password }),
        onSuccess: () => {
            window.location.href = '/' // 로그인 성공 후 홈으로 리디렉션
        },
        onError: (error) => {
            console.log('로그인 실패', error)
        },
    })
    const login = async (e: any) => {
        e.preventDefault()
        const nickname = e.currentTarget.nickname.value
        const password = e.currentTarget.password.value

        try {
            await loginMutation.mutateAsync({ nickname, password })
        } catch (error) {
            console.log('로그인 실패', error)
        }
    }
    return (
        <div>
            <p></p>
            <form
                onSubmit={login}
                className="flex flex-col gap-2 w-96 text-black p-4 bg-gray-100 rounded-xl"
            >
                <LoginCom />
            </form>
        </div>
    )
}

export default Login
