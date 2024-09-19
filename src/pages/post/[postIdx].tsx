import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'

export default function PostDetail() {
    const router = useRouter()
    const { postIdx } = router.query // URL에서 postIdx 가져오기
    const idx = Number(postIdx)

    const [editingPost, setEditingPost] = useState<number | null>(null)
    const [title, setTitle] = useState<string>('') // 수정된 상태 선언
    const [content, setContent] = useState<string>('') // 수정된 상태 선언

    // 게시물 데이터 가져오기
    const { data: post, refetch } = useQuery({
        queryKey: ['post', idx],
        queryFn: async () => {
            const response = await axios.get(`/api/posts/${idx}`)
            return response.data
        },
        enabled: !!idx, // idx가 유효할 때만 쿼리 실행
    })

    // Mutation for updating a post
    const updatePostMutation = useMutation({
        mutationFn: async (data: { title: string; content: string }) => {
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

    const handleUpdatePost = (e: any) => {
        e.preventDefault()

        if (!title || !content) {
            alert('제목, 내용을 모두 입력해주세요.')
            return
        }

        updatePostMutation.mutate({ title, content })
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

    // 데이터를 구조 분해 할당 (post가 null일 수 있으므로 기본값 설정)
    const {
        title: postTitle = '제목 없음',
        content: postContent = '내용 없음',
        nickname = '익명',
    } = post || {}

    // 수정 모드로 전환할 때 상태 업데이트
    useEffect(() => {
        if (editingPost === idx) {
            setTitle(postTitle)
            setContent(postContent)
        }
    }, [editingPost, idx, postTitle, postContent])

    return (
        <div>
            {editingPost === idx ? (
                <form onSubmit={(e) => handleUpdatePost(e)}>
                    <input
                        type="text"
                        onChange={(e) => setTitle(e.target.value)} // 상태 업데이트
                        value={title}
                        name="title"
                        className="text-black"
                        required
                    />
                    <textarea
                        onChange={(e) => setContent(e.target.value)} // 상태 업데이트
                        value={content}
                        name="content"
                        required
                        className="text-black"
                    ></textarea>
                    <button type="submit">게시글 수정</button>
                    <button type="button" onClick={() => setEditingPost(null)}>
                        취소
                    </button>
                </form>
            ) : (
                <div className="text-white">
                    <h2>제목: {postTitle}</h2>
                    <p>내용: {postContent}</p>
                    <p>작성자: {nickname}</p>
                    <button onClick={() => setEditingPost(idx)}>수정</button>
                    <button
                        onClick={() => {
                            if (
                                window.confirm(
                                    '정말로 이 게시물을 삭제하시겠습니까?'
                                )
                            ) {
                                deletePostMutation.mutate(idx)
                            }
                        }}
                    >
                        삭제
                    </button>
                </div>
            )}
        </div>
    )
}
