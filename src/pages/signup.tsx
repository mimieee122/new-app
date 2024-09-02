import { useMutation } from '@tanstack/react-query'
// api 쏘아주는 라이브러리
import axios from 'axios'
import SignupCom from '@/components/signup_com'
import React from 'react'

function Signup() {
    const signUpMutation = useMutation({
        mutationFn: async ({ nickname, password }: any) =>
            await axios.post('/api/signup', {
                nickname,
                password,
            }),
    })

    // console.log('🚀 ~ Home ~ me:', me)

    const signUp = async (e: any) => {
        e.preventDefault()
        try {
            await signUpMutation.mutateAsync({
                nickname: e.currentTarget.nickname.value,
                password: e.currentTarget.password.value,
            })
            window.location.href = '/'
        } catch (error) {
            console.log('회원가입 실패', error)
        }
    }
    return (
        <div>
            <p></p>
            <form
                onSubmit={signUp}
                className="flex flex-col gap-2 w-96 text-black p-4 bg-gray-100 rounded-xl"
            >
                <SignupCom />
            </form>
        </div>
    )
}
export default Signup
