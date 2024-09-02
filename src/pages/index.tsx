import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function Home() {
    const me = useQuery({
        queryKey: ['me'],
        queryFn: async () => await axios.get('/api/me'),
    })
    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post('/api/logout'),
    })
    const loginMutation = useMutation({
        mutationFn: async ({ nickname, password }: any) =>
            await axios.post('/api/login', {
                nickname,
                password,
            }),
    })
    const signUpMutation = useMutation({
        mutationFn: async ({ nickname, password }: any) =>
            await axios.post('/api/signup', {
                nickname,
                password,
            }),
    })

    const login = (e: any) => {
        e.preventDefault()
        if (me.isSuccess) {
            alert('이미 로그인 상태입니다.')
            return
        } else {
            loginMutation.mutate({
                nickname: e.currentTarget.nickname.value,
                password: e.currentTarget.password.value,
            })
            me.refetch()
        }
    }
    const signUp = (e: any) => {
        e.preventDefault()
        if (e.currentTarget.nickname.value !== null) {
            alert('이미 존재하는 아이디 입니다.')
        } else {
            signUpMutation.mutate({
                nickname: e.currentTarget.nickname.value,
                password: e.currentTarget.password.value,
            })
        }
    }
    const logout = (e: any) => {
        e.preventDefault()
        if (me.isSuccess) {
            logoutMutation.mutate()
            me.refetch()
            window.location.href = '/'
        }
    }

    return (
        <div className="text-white">
            <p>
                <span>현재 로그인된 유저의 닉네임: </span>
                <span>{me.data?.data.nickname}</span>
            </p>
            <form
                onSubmit={login}
                className="flex flex-col gap-2 w-96 text-black p-4 bg-gray-100 rounded-xl"
            >
                <p>로그인</p>
                <label htmlFor="nickname">nickname</label>
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
                <button type="submit">로그인</button>
            </form>
            <button type="button" onClick={logout}>
                로그아웃
            </button>
            <form
                onSubmit={signUp}
                className="flex flex-col gap-2 w-96 text-black p-4 bg-gray-100 rounded-xl"
            >
                <p>회원가입</p>
                <label htmlFor="nickname">nickname</label>
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
            <p>abc</p>
        </div>
    )
}
