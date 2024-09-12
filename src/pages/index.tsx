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
            alert('로그인이 완료되었습니다.')
            window.location.reload()
            await me.refetch()
        },
    })

    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post('/api/logout'),
        onSuccess: async () => {
            setNickname('') // ID 초기화
            setPassword('') // 비밀번호 초기화

            alert('로그아웃이 완료되었습니다.')
            window.location.reload()
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
        <div className="flex flex-row justify-end gap-[100px] h-screen bg-blue-800 ">
            <div className="w-[750px] ml-[0px]"></div>
            <div className="blue text-black w-[800px] bg-black flex flex-col gap-[30px] justify-center items-center ">
                {/* <p className="text-white underline">
                    <span>현재 로그인된 유저의 아이디: </span>
                    <span>{nickname || '없음'}</span>
                </p> */}

                <div className="text-black login ">
                    {me.isSuccess ? (
                        <div className="flex flex-col justify-center items-center border-blue-700 border-[8px] text-center gap-[30px] w-96 text-black p-4 bg-gray-100 rounded-xl">
                            <p className="text-[40px] signIn text-blue-700">
                                로그인 성공!
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={login}
                            className="flex flex-col justify-center items-center border-blue-700 border-[8px] text-center gap-[30px] w-96 text-black p-4 bg-gray-100 rounded-xl"
                        >
                            <p className="text-[40px] signIn text-blue-700">
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

                            {/* <Button type="submit">로그인</Button> */}
                        </form>
                    )}
                </div>
                <Link href="/signup">
                    <button className="button" type="button">
                        회원가입
                    </button>
                </Link>

                <div className="flex flex-row w-[350px] gap-[5px] justify-center">
                    <button className="button" type="button" onClick={logout}>
                        로그아웃
                    </button>
                    <Link href="/post">
                        <button className="button" type="button">
                            게시판
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
