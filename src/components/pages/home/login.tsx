import Button from '@/components/button'
import { useLogin } from './login.hook'

export function Login() {
    const { login, setNickname, nickname, setPassword, password } = useLogin()

    return (
        <form
            onSubmit={login}
            className=" flex flex-col border-black border-[2px] border-solid  justify-center items-center text-center gap-[30px] w-[600px] text-black p-4 bg-white bg-opacity-35 rounded-xl"
        >
            <p className="text-[40px] signIn text-[#5fbfe9]">SIGN IN</p>
            <label htmlFor="nickname">ID</label>
            <input
                type="text"
                onChange={(e) => setNickname(e.target.value)}
                id="name"
                name="nickname"
                value={nickname}
                className=" text-center border-black border-[1px]"
            />
            <label htmlFor="password">password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                id="password"
                name="password"
                className=" text-center border-black border-[1px]"
            />

            <Button>로그인</Button>
        </form>
    )
}
