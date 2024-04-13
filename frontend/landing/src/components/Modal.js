"use client"

import {useRouter} from "next/navigation";

const Modal = ({ children }) => {
    const router = useRouter()

    return (
        <div className={`w-[100%] h-[100%] bg-transparent backdrop-blur-2xl absolute flex justify-center items-center top-0 left-0`} onClick={() => router.push('/')}>
            <div className={`z-50 w-[60%] h-[80%] filter-none bg-slate-800 rounded-2xl`}>
                {children}
            </div>
        </div>
    )
}

export default Modal