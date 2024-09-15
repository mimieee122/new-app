import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import Button from '@/components/button'

export default function Home() {
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('') // 내용 상태

    const me = useQuery({
        queryKey: ['me'],
        queryFn: async () => await axios.get('/api/me'),
    })

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
            localStorage.setItem('authorIdx', authorIdx)
            return response.data
        },
        onSuccess: async () => {
            window.location.reload()
            alert('로그인이 완료되었습니다.')
            await me.refetch()
        },
    })

    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post('/api/logout'),
        onSuccess: async () => {
            setNickname('') // ID 초기화
            setPassword('') // 비밀번호 초기화

            window.location.reload()
            alert('로그아웃이 완료되었습니다.')
            await me.refetch()
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

    // 쓰지 말기 !
    // const goSignupPage = () => {
    //     window.location.href = '/signup'
    // }

    // const goPostPage = () => {
    //     window.location.href = `/post`
    // }

    return (
        <div
            className={`${
                me.isSuccess ? 'logged-in-bg' : 'default-bg'
            } flex flex-row justify-center w-screen h-screen`}
        >
            <div className="blue text-black w-[1000px]  flex flex-col gap-[30px] justify-center items-center ">
                {/* <p className="text-white underline">
                    <span>우리의 유저 </span>
                    <span>{nickname || '없음'}</span>
                    <span>님 어서오세용</span>
                </p> */}

                <div className="text-black login ">
                    {me.isSuccess ? (
                        <div className=" flex flex-col justify-center items-center  border-[#5fbfe9] border-[1px] text-center gap-[30px] w-96 text-black p-4 bg-gray-100 bg-opacity-40 rounded-xl">
                            <p className="text-[40px] signIn text-black">
                                로그인 성공!
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={login}
                            className=" flex flex-col border-black border-[2px] border-solid  justify-center items-center text-center gap-[30px] w-[600px] text-black p-4 bg-white bg-opacity-35 rounded-xl"
                        >
                            <p className="text-[40px] signIn text-[#5fbfe9]">
                                SIGN IN
                            </p>
                            <label htmlFor="nickname">ID</label>
                            <input
                                type="text"
                                onChange={(e) => setNickname(e.target.value)}
                                id="name"
                                name="nickname"
                                value={nickname}
                                className=" text-center border-black border-[1px]"
                            />
                            <label htmlFor="password">password</label>
                            <input
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                id="password"
                                name="password"
                                className=" text-center border-black border-[1px]"
                            />

                            <Button>로그인</Button>
                        </form>
                    )}
                </div>
                <Link href="/signup">
                    <Button>회원가입</Button>
                </Link>

                <div className="flex flex-row w-[600px] gap-[5px] justify-center">
                    <Button onClick={logout}>로그아웃</Button>
                    <Link href="/post" className="post-bg">
                        <Button>게시판</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
