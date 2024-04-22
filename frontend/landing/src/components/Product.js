"use client"

import {useRouter} from 'next/navigation'
import ProductDescription from "@/components/ProductDescription";

const Product = ({ product }) => {
    let URL;
    if(product.name.includes('AI')){
        URL = 'https://ai-math.quantumai.expert'
    }else if(product.name.includes('Search')){
        URL = 'https://word-search.quantumai.expert'
    }else {
        URL = 'https://apps.quantumai.expert:7000'
        // sm:after:left-8 sm:after:bottom-0
    }

    const handleView = () => {
        const auth = localStorage.getItem('AccessToken')
        if(auth) {
            location.replace(URL)
        }else{
            localStorage.setItem('nextURL', URL)
            location.replace('/auth')
        }
    }

    return (
        <div className={`max-w-full h-full max-h-full flex items-center flex-col md:flex-row m-2`}>
            <div
                className={`w-full md:w-[50%] h-[15%] md:h-[60%] relative md:after-content-[''] before-content-[''] 
                            before:border-b-white before:border-b-2 md:after:border-r-white before:w-[80%] md:after:h-[95%] md:after:border-r-2 
                            after:absolute before:absolute md:after:right-0 md:after:mt-0 before:left-8 before:bottom-0
                            flex items-center md:before:hidden
                `}>
                <div className={`w-full h-full p-2 md:p-10 flex gap-5 md:gap-0 my-2 
                                md:my-0 flex-row md:flex-col justify-around md:justify-center items-center`
                }>
                    <img alt={'app-image'} src={product.imgSrc} className={`bg-contain md:mb-16 ${product.hasApp ? 'md:w-[150px] md:h-[150px]' : 'md:w-[250px] md:h-[250px]'}`} width={50} height={70}/>
                    {product.hasApp && <button onClick={handleView}
                                               className={`p-2 md:p-5 w-[50%] md:w-[80%] text-center bg-white text-slate-800  hover:bg-slate-800 hover:text-white hover:border-white hover:border-2`}>
                                            View App
                                        </button>
                    }
                </div>
            </div>
            <ProductDescription title={product.name} desc={product.longDesc} exampleImg={product.exampleImg} />
        </div>
    )
}

export default Product