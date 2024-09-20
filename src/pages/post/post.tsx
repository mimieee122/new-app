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
        <div className={`${'post-bg'} w-screen h-screen`}>
            <div className="">
                <div className="h-[25px]"></div>
                <div className=" w-screen  h-[80px] bg-white  self-center flex flex-row justify-center bg-opacity-40 gap-[100px]">
                    <p className="signIn text-[50px] self-center text-center">
                        BOARD
                    </p>
                </div>
                <div className="mt-[30px]   flex flex-row justify-center w-full h-full gap-[30px]">
                    {/* Post creation form */}
                    <form
                        onSubmit={handleCreatePost}
                        className="flex flex-col text-center font-extrabold border-white border-[0px]  w-[400px] h-[300px]   text-white  bg-[black] bg-opacity-70  rounded-3xl p-5 gap-[12px]"
                    >
                        <div className="write text-[30px]">WRITE</div>
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
                            className="text-[18px] self-center text-black  w-[300px] h-[50px] bg-white bg-opacity-60 border-white border-[2px] rounded-md"
                            type="submit"
                        >
                            게시물 작성
                        </button>
                    </form>

                    {/* Display posts */}
                    <div className="board">
                        <div className="text-center text-black font-extrabold  border-t-black border-b-black border-t-4 border-b-4 mb-[15px]   bg-[#30a4d6] w-[600px] bg-opacity-80  text-[30px]">
                            INDEX
                        </div>
                        {posts?.map((post: any) => (
                            <div
                                className="flex flex-row bg-opacity-70 justify-between w-[600px] h-[50px] text-black  bg-white  border-black border-[1px]  gap-[10px]"
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
                                    <Button>보기</Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <Link href={'/'}>
                    <button
                        className="text-white font-extrabold text-[20px] mr-[50px] mt-[100px] "
                        type="button"
                    >
                        HOME
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default PostComponent
