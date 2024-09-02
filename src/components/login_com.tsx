// 로그인 화면 UI/UX

import React from 'react'

const LoginCom = () => {
    return (
        <div className="flex flex-col gap-[5px]">
            <p>로그인</p>
            <label htmlFor="nickname">nickname</label>
            <input
                type="text"
                placeholder="nickname"
                id="nickname"
                name="nickname"
            />
            <label htmlFor="password">password</label>
            <input
                type="password"
                placeholder="password"
                id="password"
                name="password"
            />
            <button type="submit">확인</button>
        </div>
    )
}

export default LoginCom
