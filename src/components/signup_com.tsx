// 로그인 화면 UI/UX

import React from 'react'

const SignupCom = () => {
    return (
        <div className="flex flex-col gap-[5px]">
            <p>회원가입</p>
            <label htmlFor="nickname">nickname</label>
            <input type="text" placeholder="nickname" id="nickname" />
            <label htmlFor="password">password</label>
            <input
                type="password"
                placeholder="password"
                id="password"
                name="password"
            />
            <button type="submit">회원가입</button>
        </div>
    )
}

export default SignupCom
