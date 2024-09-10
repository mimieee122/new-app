import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function Home() {
    const me = useQuery({
        queryKey: ['me'],
        queryFn: async () => await axios.get('/api/me'),
    })

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
            localStorage.setItem('authorIdx', authorIdx)
            return response.data
        },
        onSuccess: async () => {
            await me.refetch()
            window.location.reload()
        },
    })

    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post('/api/logout'),
        onSuccess: async () => {
            await me.refetch()
            window.location.reload()
        },
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
        }
    }

    const logout = (e: any) => {
        e.preventDefault()
        if (me.isSuccess) {
            logoutMutation.mutate()
        } else {
            alert('로그인 상태가 아닙니다.')
        }
    }

    const goSignupPage = () => {
        window.location.href = '/signup'
    }

    const goPostPage = () => {
        window.location.href = '/post'
    }

    return (
        <div className="flex flex-col gap-[50px] justify-center mt-[40px]">
            <p className="text-white">
                <span>현재 로그인된 유저의 닉네임: </span>
                <span>{me.data?.data.nickname || '없음'}</span>
            </p>
            <div className="text-white flex flex-row gap-[30px]">
                <form
                    onSubmit={login}
                    className="flex flex-col gap-2 w-96 text-black p-4 bg-gray-100 rounded-xl"
                >
                    <p>로그인</p>
                    <label htmlFor="nickname">nickname</label>
                    <input
                        type="text"
                        placeholder="nickname"
                        id="name"
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
                <button type="button" onClick={goSignupPage}>
                    회원가입
                </button>
                <button type="button" onClick={goPostPage}>
                    게시판
                </button>
            </div>
        </div>
    )
}
