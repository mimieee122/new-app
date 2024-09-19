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
            alert('제목과 내용, 닉네임을 입력해주세요.')
            return
        }

        createPostMutation.mutate({ nickname, title, content })
    }

    return (
        <div className="text-white flex flex-col gap-[10px]">
            <Link href={'/'}>
                <button type="button">HOME</button>
            </Link>

            {/* Post creation form */}
            <form onSubmit={handleCreatePost}>
                <label htmlFor="nickname">ID</label>
                <input
                    className="text-black"
                    type="text"
                    id="nickname"
                    name="nickname"
                    required
                />
                <label htmlFor="title">제목</label>
                <input
                    className="text-black"
                    type="text"
                    id="title"
                    name="title"
                    required
                />
                <label htmlFor="content">내용</label>
                <textarea
                    className="text-black"
                    id="content"
                    name="content"
                    required
                ></textarea>
                <button type="submit">게시글 작성</button>
            </form>

            {/* Display posts */}
            <div>
                {posts?.map((post: any) => (
                    <div className="flex flex-row gap-[10px]" key={post.idx}>
                        <h2>ID : {post.nickname}</h2>
                        <h2>제목 : {post.title}</h2>
                        <p>내용 : {post.content}</p>
                        <Link href={`/post/${post.idx}`}>
                            <Button>보기</Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PostComponent
