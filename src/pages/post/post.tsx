import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/button'
import { parseCookies } from 'nookies'

const PostComponent = () => {
    const [isCreating, setIsCreating] = useState(false)
    const [editingPost, setEditingPost] = useState<number | null>(null)
    const [currentPostIdx, setCurrentPostIdx] = useState<string | null>(null)
    const [title, setTitle] = useState('') // 제목 상태
    const [content, setContent] = useState('') // 내용 상태

    // Fetching posts
    const { data: posts, refetch } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await axios.get('/api/posts')
            return response.data
        },
    })

    // Mutation for creating a post
    const createPostMutation = useMutation({
        mutationFn: async (data: {
            nickname: string
            title: string
            content: string
        }) => {
            try {
                await axios.post('/api/posts', data)
            } catch (error: any) {
                if (error.response && error.response.data) {
                    alert(error.response.data.message)
                } else {
                    alert('게시물 생성 중 오류가 발생했습니다.')
                }
                console.error('An error occurred:', error)
            }
        },
        onSuccess: () => {
            setIsCreating(false)
            refetch() // Refetch posts after successful creation
        },
    })

    const handleCreatePost = (e: any) => {
        e.preventDefault()

        const nickname = e.target.nickname.value
        const title = e.target.title.value
        const content = e.target.content.value

        if (!title || !content || !nickname) {
            alert('제목과 내용, 작성자를 입력해주세요.')
            return
        }

        createPostMutation.mutate({ nickname, title, content })
    }

    return (
        <div className={`${'post-bg'} w-screen min-h-screen`}>
            <div className="flex flex-col gap-[0px]">
                <Link href={'/'}>
                    <button
                        className="text-black mt-[2px] h-[40px] w-[100px] bg-white bg-opacity-40 rounded-xl font-extrabold text-[25px] mr-[200px]   "
                        type="button"
                    >
                        HOME
                    </button>
                </Link>
                <div className=" w-screen  h-[80px] bg-white  self-center flex flex-row justify-start bg-opacity-0 gap-[100px]">
                    <p className="signIn board text-[70px] ml-[40px] mt-[30px] underline self-center  text-center"></p>
                </div>
                <div className="mt-[50px]   flex flex-row justify-end w-full h-full gap-[30px]">
                    {/* Post creation form */}

                    <form
                        onSubmit={handleCreatePost}
                        className="flex flex-col text-center shadow-lg shadow-[0_0_10px_#000000] transition-shadow font-extrabold  border-[black] border-[4px]  w-[400px] h-[290px]   text-black  bg-[#028cc8] bg-opacity-80  rounded-3xl p-5 gap-[12px]"
                    >
                        <div className="index text-[black] mb-[0px]   text-[35px]">
                            WRITE
                        </div>
                        <label htmlFor="nickname"></label>
                        <input
                            className="text-black"
                            type="text"
                            id="nickname"
                            name="nickname"
                            placeholder="ID"
                            required
                        />
                        <label htmlFor="title"></label>
                        <input
                            className="text-black"
                            type="text"
                            id="title"
                            name="title"
                            placeholder="TITLE"
                            required
                        />
                        <label htmlFor="content"></label>
                        <textarea
                            className="text-black"
                            id="content"
                            name="content"
                            placeholder="CONTENTS"
                            required
                        ></textarea>
                        <button
                            className="text-[18px] font-extrabold self-center shadow-lg hover:shadow-[0_0_10px_white] transition-shadow text-black  w-[200px] h-[50px] bg-[white] bg-opacity-90 border-black border-[2.5px] rounded-md"
                            type="submit"
                        >
                            게시물 작성
                        </button>
                    </form>

                    {/* Display posts */}
                    <div className="index">
                        <div className="text-center write  text-white font-extrabold  border-t-black border-b-black border-t-4 border-b-4 mb-[15px]   bg-[black] w-[500px] bg-opacity-70  text-[30px]">
                            INDEX
                        </div>
                        {posts?.map((post: any) => (
                            <div
                                className="flex flex-row  justify-between w-[500px] h-[50px] text-black  bg-white  border-black border-[1px]  gap-[10px]"
                                key={post.idx}
                            >
                                <div className="flex flex-row gap-[5px] ml-[10px]">
                                    <h2>제목 : </h2>
                                    <h2 className=" text-[20px] font-bold">
                                        {post.title}
                                    </h2>
                                    <h2 className="underline">
                                        - 작성자 : {post.nickname}
                                    </h2>
                                </div>
                                {/* <p>내용 : {post.content}</p> */}
                                <Link href={`/post/${post.idx}`}>
                                    <button className="w-[100px] h-[40px] write shadow-lg hover:shadow-[0_0_10px_#028cc8] transition-shadow text-white font-extrabold m-1 bg-[#028cc8]  border-black rounded-md border-[2px]">
                                        보기
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostComponent
