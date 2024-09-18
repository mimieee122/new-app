import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useState } from 'react'
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

    // Fetching comments (only when a post is selected)
    // const { data: comments } = useQuery({
    //     queryKey: ['comments', currentPostIdx],
    //     enabled: !!currentPostIdx,
    //     queryFn: async () => {
    //         const response = await axios.get(`/api/${currentPostIdx}/comments`)
    //         return response.data
    //     },
    // })

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

        // const authorIdx = localStorage.getItem('authorIdx')
        // const idx = authorIdx ? Number(authorIdx) : null

        // if (idx === null) {
        //     alert('로그인 후 글을 작성할 수 있습니다.')
        //     return
        // }
        if (!title || !content || !nickname) {
            alert('제목과 내용, 닉네임을 입력해주세요.')
            return
        }

        createPostMutation.mutate({ nickname, title, content })
    }

    // Mutation for updating a post
    const updatePostMutation = useMutation({
        mutationFn: async (data: {
            postIdx: number
            title: string
            content: string
        }) => {
            const { postIdx } = data

            const idx = Number(postIdx)
            await axios.put(`/api/posts/${idx}`, data)
        },
        onSuccess: () => {
            setEditingPost(null)
            refetch() // Refetch posts after successful update
        },
        onError: (error: any) => {
            if (error.response && error.response.data) {
                alert(error.response.data.message)
            } else {
                alert('게시물 수정 중 오류가 발생했습니다.')
            }
        },
    })

    const handleUpdatePost = (e: any, postIdx: number) => {
        e.preventDefault()

        const title = e.target.title.value
        const content = e.target.content.value
        const idx = Number(postIdx)

        //** */

        if (!title || !content) {
            alert('제목, 내용을 모두 입력해주세요.')
            return
        }

        updatePostMutation.mutate({ postIdx: idx, title, content })
    }

    // Mutation for deleting a post
    const deletePostMutation = useMutation({
        mutationFn: async (postIdx: number) => {
            const idx = Number(postIdx)
            await axios.delete(`/api/posts/${idx}`, { data: { postIdx: idx } })
        },
        onSuccess: () => {
            refetch() // Refetch posts after successful deletion
        },
        onError: (error: any) => {
            if (error.response && error.response.data) {
                alert(error.response.data.message)
            } else {
                alert('게시물 삭제에 실패했습니다. 다시 시도해 주세요.')
            }
        },
    })

    // const deletePostMutation = useMutation({
    //     mutationFn: async (data: { idx: number }) => {
    //         await axios.delete(`/api/posts/${idx}`)
    //     },
    // })

    // Navigating to the home page
    // const homePage = () => {
    //     window.location.href = '/'
    // }

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

            {/* editingPost는 게시글의 ID(number)를 저장하거나, 현재 편집 중인 게시글이 없을 때는 null을 저장*/}

            {/* Display posts */}
            <div>
                {posts?.map((post: any) => (
                    <div key={post.idx}>
                        {editingPost === post.idx ? (
                            <form
                                onSubmit={(e) => handleUpdatePost(e, post.idx)}
                            >
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} // 상태 업데이트
                                    name="title"
                                    className="text-black"
                                    required
                                />
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)} // 상태 업데이트
                                    name="content"
                                    required
                                    className="text-black"
                                ></textarea>
                                <button type="submit">게시글 수정</button>
                                <button
                                    type="button"
                                    onClick={() => setEditingPost(null)}
                                >
                                    취소
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-row gap-[10px]">
                                <h2>ID : {post.nickname}</h2>
                                <h2>제목 : {post.title}</h2>
                                <p>내용 : {post.content}</p>
                                <button
                                    onClick={() => {
                                        setEditingPost(post.idx)
                                        setCurrentPostIdx(post.idx)
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                '정말로 이 게시물을 삭제하시겠습니까?'
                                            )
                                        ) {
                                            deletePostMutation.mutate(post.idx)
                                        }
                                    }}
                                >
                                    삭제
                                </button>
                                <Link href={`/post/${post.idx}`}>
                                    <Button>보기</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PostComponent
