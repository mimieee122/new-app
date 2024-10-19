import { useMutation, useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import axios from 'axios'
import React from 'react'
import Button from '@/components/button'
import { toast } from 'react-toastify'
import { Login } from '@/components/pages/home/login'
import Image from 'next/image'
import { useRouter } from 'next/router'

// alert 없애기!

export default function Home() {
    const me = useQuery({
        queryKey: ['me'],
        queryFn: async () => await axios.get('/api/me'),
    })

    const router = useRouter()

    // mutation은 데이터를 변경하는 작업을 의미
    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post('/api/logout'),
        onSuccess: async () => {
            toast.success('로그아웃이 완료되었습니다.')
            window.location.reload()
        },
    })

    const logout = (e: any) => {
        e.preventDefault()
        if (me.isSuccess) {
            logoutMutation.mutate()
        } else {
            toast.error('로그인 상태가 아닙니다.')
        }
    }

    // 쓰지 말기 !
    const goSignupPage = () => {
        router.push('/signup')
    }

    const goPostPage = () => {
        router.push('/post/post')
    }

    return (
        <div
            className={`${
                me.isSuccess ? 'logged-in-bg' : ''
            } flex flex-row justify-center w-screen min-h-screen`}
        >
            <div className="absolute w-screen h-screen -z-10">
                <Image
                    src="/assets/images/bg.png"
                    fill // 부모 요소에 가득 차게 함
                    alt="디폴트 배경"
                    className="object-cover"
                />
            </div>
            <div className="blue text-black w-[1000px]  flex flex-col gap-[30px] justify-center items-center ">
                <div className="text-black login ">
                    {me.isSuccess ? (
                        <div className="flex  flex-col gap-[10px] contents-center  justify-center">
                            <div className=" flex flex-col justify-center items-center   border-gray-500 border-[3px] text-center gap-[30px] w-96 h-[50px] p-4 bg-white bg-opacity-70  rounded-xl">
                                <p className="text-black text-center now ">
                                    <span>현재 접속중인 유저 ID : </span>
                                    <span>{me.data?.data?.nickname}</span>
                                </p>
                            </div>
                            <div className=" flex flex-col justify-center items-center  border-[#3eb9ed] border-[5px] text-center gap-[30px] w-96 text-black p-4 bg-gray-100 bg-opacity-60 rounded-xl">
                                <p className="text-[40px] signIn text-black">
                                    로그인 성공
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Login />
                        </div>
                    )}
                </div>

                <Button onClick={goSignupPage}>회원가입</Button>

                <div className="flex flex-row w-[600px] gap-[5px] justify-center">
                    <Button onClick={logout}>로그아웃</Button>

                    <Button onClick={goPostPage}>게시판</Button>
                </div>
            </div>
        </div>
    )
}
