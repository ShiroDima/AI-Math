"use client"

import {ArrowNarrowRightIcon} from '@heroicons/react/outline'
import {useState} from "react";
import {ArrowNarrowLeftIcon} from "@heroicons/react/solid";


const ProductDescription = ({title, desc, exampleImg}) => {
    const [showExamples, setShowExamples] = useState(false)

    return (
        <div className={`flex flex-col gap-5 p-5 mt-1 md:mx-10 md:mt-5 md:p-10 text-white w-full md:max-w-[50%] ${showExamples ? 'h-full' : 'h-[60%]'}`}>
            <div className={`flex flex-col justify-center items-center w-full ${showExamples ? 'h-[90%]' : 'h-[60%]'}`}>
                <h1 className={`text-center w-full text-4xl mb-5 h-[20%]`}>{title}</h1>
                {
                    !showExamples && <div className={`my-1 text-xl w-fit flex flex-col items-center gap-5 justify-center`}>
                        <p id={'product-description'}>{desc}</p>
                        {
                            title.includes('Voice') && <audio controls className={`w-[90%] bg-white text-slate-800`} src={'/audio/voice_assistant_demo.wav'} />
                        }
                    </div>
                }
                {
                    showExamples && <div className={`flex gap-5 snap-x snap-mandatory w-[80%] overflow-x-scroll md:h-[80%]`}>
                        {exampleImg.map((imgSrc, idx) => {
                            return <img key={idx} alt={'product-example'} src={imgSrc} className={`snap-always snap-center bg-contain min-w-full min-h-full`}/>
                        })}
                    </div>
                }
            </div>
            <div className={`w-fit h-[20%]`}>
                <button
                    className={`flex hover:hover:text-green-500 items-center w-full py-5 h-fit`}
                    onClick={() => setShowExamples(prev => !prev)}
                >
                    {
                        exampleImg.length!==0 && (
                            !showExamples
                                ? <span className={'w-full flex items-center'}>Examples <ArrowNarrowRightIcon className={`w-10 h-4`} /></span>
                                : <span className={'w-full flex items-center'}>Description <ArrowNarrowLeftIcon className={`w-10 h-4`} /></span>
                        )
                    }
                </button>
            </div>

        </div>
    )
}

export default ProductDescription