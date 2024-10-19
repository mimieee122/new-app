import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

export function useLogin() {
    const router = useRouter()
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('') // 내용 상태
    const me = useQuery({
        queryKey: ['me'],
        queryFn: async () => await axios.get('/api/me'),
    })
    const login = (e: any) => {
        e.preventDefault()
        if (me.isSuccess) {
            toast.error('이미 로그인 상태입니다.')
            return
        } else {
            loginMutation.mutate({
                nickname: e.currentTarget.nickname.value,
                password: e.currentTarget.password.value,
            })
        }
    }

    // mutation은 데이터를 변경하는 작업을 의미
    const loginMutation = useMutation({
        mutationFn: async ({
            nickname,
            password,
        }: {
            nickname: string
            password: string
        }) => {
            const response = await axios.post('/api/login', {
                nickname,
                password,
            })

            const { payload } = response.data
            const authorIdx = payload.idx

            if (!authorIdx || authorIdx === undefined) {
                console.error(
                    'Failed to set authorIdx: value is undefined or null'
                )
                throw new Error('로그인 실패: 유효하지 않은 데이터입니다.')
            }

            // localStorage.setItem('authorIdx', authorIdx)
            return payload
        },
        onSuccess: async () => {
            setNickname('') // ID 초기화
            setPassword('') // 비밀번호 초기화
            toast.success('로그인이 완료되었습니다.')
        },
        onError: (error: any) => {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message)
            }
        },
    })

    return {
        login,
        setNickname,
        nickname,
        setPassword,
        password,
    }
}
