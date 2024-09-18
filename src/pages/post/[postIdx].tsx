// pages/post/[postIdx].tsx
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function PostDetail() {
    const router = useRouter()
    const { postIdx } = router.query // URL에서 postIdx 가져오기
    const idx = Number(postIdx)

    // 게시물 데이터 가져오기
    const {
        data: post,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['post', idx],
        queryFn: async () => {
            const response = await axios.get(`/api/posts/${idx}`)
            return response.data
        },
        enabled: !!idx, // idx가 유효할 때만 쿼리 실행
    })

    // 로딩 상태 처리
    if (isLoading) {
        return <p>로딩 중...</p>
    }

    // 에러 상태 처리
    if (isError) {
        return (
            <p>
                오류 발생:{' '}
                {error instanceof Error ? error.message : '알 수 없는 오류'}
            </p>
        )
    }

    // 데이터를 구조 분해 할당 (post가 null일 수 있으므로 기본값 설정)
    const {
        title = '제목 없음',
        content = '내용 없음',
        nickname = '익명',
    } = post || {}

    return (
        <div className="text-white">
            <h2>제목: {title}</h2>
            <p>내용: {content}</p>
            <p>작성자: {nickname}</p>
        </div>
    )
}
