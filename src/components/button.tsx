import React from 'react'

// width: 350px;
//     height: 50px;
//     background-color: blue;
//     border: white 4px solid;
//     border-radius: 10px;

const Button = ({
    children,
    onClick,
}: {
    children: React.ReactNode
    //() => void는 TypeScript에서 리턴값이 없는 함수를 의미
    // () : 함수가 매개변수를 받지 않음을 의미
    onClick?: (e: any) => void
}) => {
    return (
        <button
            onClick={onClick}
            className="w-[200px] h-[50px] bg-[#5fbfe9] bg-opacity-50 border-black border-[2px] border-solid rounded-md"
        >
            {children}
        </button>
    )
}

export default Button
