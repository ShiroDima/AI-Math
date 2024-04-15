"use client"

import {useRouter} from "next/navigation";

const Modal = ({ children }) => {
    const router = useRouter()

    return (
        <div
            id={'overlay'}
            className={`w-screen h-screen md:w-[100%] md:h-full bg-transparent backdrop-blur-2xl absolute flex 
                        justify-center items-start md:items-center mt-5 md:mt-0 md:items-center md:top-0 left-0`
            }
            onClick={(event) => {
                if(event.target?.id==='overlay') router.push('/')
            }}>
            <div className={`z-50 w-[90%] max-h-[90%] h-fit md:w-[80%] md:h-[80%] md:max-h-full filter-none bg-slate-800 rounded-2xl`}>
                {children}
            </div>
        </div>
    )
}

export default Modal