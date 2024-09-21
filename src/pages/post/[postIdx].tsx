import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import Button from '@/components/button'

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
            // 캐시에서 해당 게시물 제거
            router.push('/post/post') // 목록 페이지로 리디렉션
        },
        onError: (error: any) => {
            if (error.response && error.response.data) {
                alert(error.response.data.message)
            } else {
                alert('게시물 삭제에 실패했습니다. 다시 시도해 주세요.')
            }
        },
    })

    // 게시물 수정 모드로 전환할 때 상태 업데이트
    useEffect(() => {
        if (editingPost === idx && post) {
            setTitle(post.title)
            setContent(post.content)
        }
    }, [editingPost, idx, post])

    // 게시물이 존재하지 않을 경우 처리
    if (!post) {
        return <div className="text-white">게시물이 존재하지 않습니다.</div>
    }

    return (
        <div
            className={`${'detail-bg'} w-screen min-h-screen  flex flex-col gap-[10px] justify-center items-center text-white`}
        >
            <div className="flex flex-row self-center pb-0 mb-0 mt-[20px] text-black font-extrabold gap-[10px]">
                <Link href={'/'}>
                    <Button>HOME</Button>
                </Link>
                <Link href={'/post/post'}>
                    <Button>뒤로가기</Button>
                </Link>
            </div>
            {editingPost === idx ? (
                <form
                    onSubmit={(e) => handleUpdatePost(e)}
                    className="text-black flex flex-col mt-[10px] p-2 items-center justify-between bg-white rounded-xl bg-opacity-70 w-[1000px] h-[400px] border-black border-[3px]"
                >
                    <div>
                        <p>제목 : </p>
                        <input
                            type="text"
                            onChange={(e) => setTitle(e.target.value)} // 상태 업데이트
                            value={title}
                            name="title"
                            className="now text-center underline text-[30px]"
                        />

                        <textarea
                            onChange={(e) => setContent(e.target.value)} // 상태 업데이트
                            value={content}
                            name="content"
                            className="flex flex-col text-center p-3 index gap-[15px] w-[500px] mt-[10px] h-[250px] border-black border-[1px]"
                        >
                            <p className="self-center index underline text-[25px]">
                                내용{' '}
                            </p>
                        </textarea>
                    </div>
                    <button type="submit">게시글 수정</button>
                    <button type="button" onClick={() => setEditingPost(null)}>
                        취소
                    </button>
                </form>
            ) : (
                <div className="text-black flex flex-col p-2 items-center mt-[10px] justify-between bg-white rounded-xl bg-opacity-70 w-[1000px] h-[400px] border-black border-[3px]">
                    <div>
                        <h2 className="now text-center underline text-[30px]">
                            제목 : {post.title}
                        </h2>
                        <p className="font-extrabold">
                            {' '}
                            → 작성자: {post.nickname}
                        </p>
                        <div className="flex flex-col text-center p-3 index gap-[15px] w-[500px] mt-[10px] h-[250px] border-black border-[1px]">
                            <p className="self-center index underline text-[25px]">
                                내용{' '}
                            </p>
                            <p className="text-[20px]">{post.content}</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-[20px]">
                        <button
                            className="w-[130px] h-[30px] font-extrabold bg-black text-white border-black border-[1px] rounded-md"
                            onClick={() => setEditingPost(idx)}
                        >
                            수정
                        </button>
                        <button
                            className="w-[130px] h-[30px] font-extrabold bg-black text-white border-black border-[1px] rounded-md"
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
                </div>
            )}
        </div>
    )
}
