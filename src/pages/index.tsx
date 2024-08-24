import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
// api 쏘아주는 라이브러리

export default function Home() {
    //*
    // const page = 2
    // const posts = useQuery({
    //     queryKey: ['posts', page], // 뒤에 데이터를 더 넣을 수 있음
    //     // 로딩 시간 감축 가능
    //     // = me 응답만 따로 담아 저장 담아둠
    //     queryFn: async () => await axios.get(`/api/posts?page=${page}`),
    //     // 실제 api 호출할 코드 적어달라
    // })

    // get 메소드 = useQuery
    // = 컴포넌트 실행할 때 바로 조회
    // 다른 메소드 = useMutation
    // = 작동을 시켜야만 api요청 보냄
    const me = useQuery({
        queryKey: ['me'], // 뒤에 데이터를 더 넣을 수 있음
        // = me 응답만 따로 담아 저장 담아둠
        queryFn: async () => await axios.get('/api/me'),
    })

    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post('/api/logout'),
    })
    const loginMutation = useMutation({
        mutationFn: async ({ name, password }: any) =>
            await axios.post('/api/login', {
                name,
                password,
            }),
    })
    const signUpMutation = useMutation({
        mutationFn: async ({ name, password }: any) =>
            await axios.post('/api/users', {
                name,
                password,
            }),
    })

    // console.log('🚀 ~ Home ~ me:', me)

    const login = (e: any) => {
        e.preventDefault()
        loginMutation.mutate({
            name: e.currentTarget.name.value,
            password: e.currentTarget.password.value,
        })
    }
    const signUp = (e: any) => {
        e.preventDefault()
        signUpMutation.mutate({
            name: e.currentTarget.name.value,
            password: e.currentTarget.password.value,
        })
    }
    const logout = () => {
        logoutMutation.mutate()
    }

    return (
        <div>
            <p></p>
            <form
                onSubmit={login}
                className="flex flex-col gap-2 w-96 text-black p-4 bg-gray-100 rounded-xl"
            >
                <p>로그인</p>
                <label htmlFor="name">name</label>
                <input type="text" placeholder="name" id="name" name="name" />
                <label htmlFor="password">password</label>
                <input
                    type="password"
                    placeholder="password"
                    id="password"
                    name="password"
                />
                <button type="submit">로그인</button>
            </form>

            <form
                onSubmit={signUp}
                className="flex flex-col gap-2 w-96 text-black p-4 bg-gray-100 rounded-xl"
            >
                <p>회원가입</p>
                <label htmlFor="name">name</label>
                <input type="text" placeholder="name" id="name" name="name" />
                <label htmlFor="password">password</label>
                <input
                    type="password"
                    placeholder="password"
                    id="password"
                    name="password"
                />
                <button type="submit">회원가입</button>
            </form>
        </div>
    )
}
