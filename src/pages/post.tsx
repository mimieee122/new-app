import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

const PostComponent = () => {
    const [editingPost, setEditingPost] = useState<string | null>(null)
    const [editingComment, setEditingComment] = useState<{
        postIdx: string
        commentIdx: string
    } | null>(null)
    const [currentPostIdx, setCurrentPostIdx] = useState<string | null>(null)

    // 게시글 생성/수정/삭제 Mutation
    const postMutation = useMutation({
        mutationFn: async ({
            method,
            data,
        }: {
            method: string
            data?: any
        }) => {
            if (method === 'PUT') {
                await axios.put(`/api/posts/${data.idx}`, data)
            } else if (method === 'POST') {
                await axios.post('/api/posts', data)
            } else if (method === 'DELETE') {
                await axios.delete(`/api/posts/${data.idx}`)
            } else {
                throw new Error('지원하지 않는 메서드입니다.')
            }
        },
        onSuccess: () => {
            // queryClient.invalidateQueries(['posts'])
            // if (currentPostIdx) {
            //     queryClient.invalidateQueries(['comments', currentPostIdx])
            // }
            window.location.reload()
        },
        onError: (error) => {
            alert('게시글 작업 중 오류가 발생했습니다.')
            console.error(error)
        },
    })

    // 댓글 생성/수정/삭제 Mutation
    const commentMutation = useMutation({
        mutationFn: async ({
            method,
            postIdx,
            data,
        }: {
            method: string
            postIdx: string
            data?: any
        }) => {
            let response

            if (method === 'POST') {
                response = await axios.post(
                    `/api/${postIdx}/comments`,
                    data,
                    data.authorIdx
                )
            } else if (method === 'PUT') {
                response = await axios.put(
                    `/api/${postIdx}/comments/${data.idx}`,
                    data
                )
            } else if (method === 'DELETE') {
                response = await axios.delete(
                    `/api/${postIdx}/comments/${data.idx}`
                )
            } else {
                throw new Error('지원하지 않는 메서드입니다.')
            }

            return response.data
        },
        onSuccess: () => {
            // if (currentPostIdx) {
            //     queryClient.invalidateQueries(['comments', currentPostIdx])
            // }
            window.location.reload()
        },
        onError: (error) => {
            alert('댓글 작업 중 오류가 발생했습니다.')
            console.error(error)
        },
    })

    // 게시물 조회 Query
    const { data: posts } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await axios.get('/api/posts')
            return response.data
        },
    })

    // 댓글 조회 Query
    const { data: comments } = useQuery({
        queryKey: ['comments', currentPostIdx],
        enabled: !!currentPostIdx,
        queryFn: async () => {
            if (!currentPostIdx) return []
            const response = await axios.get(`/api/${currentPostIdx}/comments`)
            return response.data
        },
    })
    // 여기에요 여기 ㅠㅠ
    const handleCreatePost = (e: any) => {
        e.preventDefault()

        const title = e.target.title.value
        const content = e.target.content.value
        const authorIdx = localStorage.getItem('authorIdx')
        const idx = Number(authorIdx)

        if (!title || !content) {
            alert('제목과 내용을 입력해주세요.')
            return
        }

        // if (!authorIdx || authorIdx === 'undefined') {
        //     alert('Author ID is missing or invalid. Please log in again.')
        //     return
        // }

        postMutation.mutate({
            method: 'POST',
            data: {
                title,
                content,
                authorIdx: idx,
            },
        })
    }

    const handleUpdatePost = (e: any, postIdx: string) => {
        e.preventDefault()

        const title = e.target.title.value
        const content = e.target.content.value

        postMutation.mutate({
            method: 'PUT',
            data: { idx: postIdx, title, content },
        })

        setEditingPost(null)
    }

    const handleDeletePost = (postIdx: string) => {
        postMutation.mutate({
            method: 'DELETE',
            data: { idx: postIdx },
        })
    }

    const handleCreateComment = (e: any, postIdx: string) => {
        e.preventDefault()

        const content = e.target.comment.value
        const authorIdx = e.target.comment.value

        if (!content) {
            alert('댓글을 입력해주세요.')
            return
        }

        commentMutation.mutate({
            method: 'POST',
            postIdx,

            data: { content, authorIdx },
        })
    }

    const handleUpdateComment = (
        e: any,
        postIdx: string,
        commentIdx: string
    ) => {
        e.preventDefault()

        const content = e.target.content.value

        commentMutation.mutate({
            method: 'PUT',
            postIdx,
            data: { idx: commentIdx, content },
        })

        setEditingComment(null)
    }

    const handleDeleteComment = (postIdx: string, commentIdx: string) => {
        commentMutation.mutate({
            method: 'DELETE',
            postIdx,
            data: { idx: commentIdx },
        })
    }

    const homePage = () => {
        window.location.href = '/'
    }

    return (
        <div className="text-white">
            <button type="button" onClick={homePage}>
                HOME
            </button>
            {/* 게시글 작성 폼 */}
            <form onSubmit={handleCreatePost}>
                <label htmlFor="title">제목</label>
                <input
                    className="text-black"
                    type="text"
                    id="title"
                    name="title"
                />

                <label htmlFor="content">내용</label>
                <textarea
                    className="text-black"
                    id="content"
                    name="content"
                ></textarea>

                <button type="submit">게시글 작성</button>
            </form>

            {/* 게시글 목록 및 삭제, 수정 */}
            <div>
                {posts?.map((post: any) => (
                    <div key={post.idx}>
                        {editingPost === post.idx ? (
                            <form
                                onSubmit={(e) => handleUpdatePost(e, post.idx)}
                            >
                                <input
                                    type="text"
                                    defaultValue={post.title}
                                    name="title"
                                />
                                <textarea
                                    defaultValue={post.content}
                                    name="content"
                                ></textarea>
                                <button type="submit">게시글 수정</button>
                                <button onClick={() => setEditingPost(null)}>
                                    취소
                                </button>
                            </form>
                        ) : (
                            <>
                                <h2>{post.title}</h2>
                                <p>{post.content}</p>
                                <button
                                    onClick={() => {
                                        setEditingPost(post.idx)
                                        setCurrentPostIdx(post.idx)
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.idx)}
                                >
                                    삭제
                                </button>
                            </>
                        )}

                        {/* 댓글 작성 폼 */}
                        <form
                            onSubmit={(e) => handleCreateComment(e, post.idx)}
                        >
                            <label htmlFor={`comment-${post.Idx}`}>댓글</label>
                            <input
                                type="text"
                                id={`comment-${post.Idx}`}
                                name="comment"
                            />
                            <button type="submit">댓글 작성</button>
                        </form>

                        {/* 댓글 목록 및 수정, 삭제 */}
                        <div>
                            {comments?.map((comment: any) => (
                                <div key={comment.idx}>
                                    {editingComment?.commentIdx ===
                                        comment.idx &&
                                    editingComment?.postIdx === post.idx ? (
                                        <form
                                            onSubmit={(e) =>
                                                handleUpdateComment(
                                                    e,
                                                    post.Idx,
                                                    comment.Idx
                                                )
                                            }
                                        >
                                            <input
                                                type="text"
                                                defaultValue={comment.content}
                                                name="content"
                                            />
                                            <button type="submit">
                                                댓글 수정
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingComment(null)
                                                }
                                            >
                                                취소
                                            </button>
                                        </form>
                                    ) : (
                                        <>
                                            <p>{comment.content}</p>
                                            <button
                                                onClick={() =>
                                                    setEditingComment({
                                                        postIdx: post.Idx,
                                                        commentIdx: comment.Idx,
                                                    })
                                                }
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        post.Idx,
                                                        comment.Idx
                                                    )
                                                }
                                            >
                                                삭제
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PostComponent
