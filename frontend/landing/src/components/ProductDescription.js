"use client"

import {ArrowNarrowRightIcon} from '@heroicons/react/outline'
import {useEffect, useState} from "react";
import {ArrowNarrowLeftIcon} from "@heroicons/react/solid";


const ProductDescription = ({title, desc}) => {
    const [showExamples, setShowExamples] = useState(false)

    return (
        <div className={`flex flex-col gap-5 p-5 mt-1 md:mx-10 md:mt-5 md:p-10 text-white w-full md:max-w-[50%] ${showExamples ? 'h-full' : 'h-[60%]'}`}>
            <div className={`w-full ${showExamples ? 'h-[70%]' : 'h-[60%]'}`}>
                <h1 className={`text-center w-full text-4xl mb-5 h-[20%]`}>{title}</h1>
                {
                    !showExamples && <div className={`my-1 text-xl`}>
                        <p id={'product-description'}>{desc}</p>
                    </div>
                }
                {
                    showExamples && <div className={`flex gap-5 snap-x snap-mandatory w-full overflow-x-scroll md:h-[80%]`}>
                        <img alt={'product-example'} src={'/images/aimath/example_1.png'} className={`snap-always snap-center bg-contain min-w-full min-h-full`}/>
                        <img alt={'product-example'} src={'/images/aimath/example_2.png'} className={`snap-always snap-center bg-contain min-w-full min-h-full`}/>
                        <img alt={'product-example'} src={'/images/aimath/example_3.png'} className={`snap-always snap-center bg-contain min-w-full min-h-full`}/>
                    </div>
                }
            </div>
            <div className={`w-fit h-[20%]`}>
                <button
                    className={`flex hover:hover:text-green-500 items-center w-full py-5 h-fit`}
                    onClick={() => setShowExamples(prev => !prev)}
                >
                    {
                        !showExamples
                            ? <span className={'w-full flex items-center'}>Examples <ArrowNarrowRightIcon className={`w-10 h-4`} /></span>
                            : <span className={'w-full flex items-center'}>Description <ArrowNarrowLeftIcon className={`w-10 h-4`} /></span>
                    }
                </button>
            </div>

        </div>
    )
}

export default ProductDescription