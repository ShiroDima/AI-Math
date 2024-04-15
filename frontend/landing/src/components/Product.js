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
        URL = 'http://quantumai-expert-lb-499712256.eu-central-1.elb.amazonaws.com:7000'
        // sm:after:left-8 sm:after:bottom-0
    }
    console.log(URL)
    return (
        <div className={`max-w-full h-full max-h-full flex items-center flex-col md:flex-row m-2`}>
            <div
                className={`w-full md:w-[50%] h-[15%] md:h-[60%] relative md:after-content-[''] before-content-[''] 
                            before:border-b-white before:border-b-2 md:after:border-r-white before:w-[80%] md:after:h-[80%] md:after:border-r-2 
                            after:absolute before:absolute md:after:right-0 md:after:mt-0 before:left-8 before:bottom-0
                            flex items-center md:before:hidden
                `}>
                <div className={`w-full h-full p-2 md:p-10 flex gap-5 md:gap-0 my-2 
                                md:my-0 flex-row md:flex-col justify-around md:justify-center items-center`
                }>
                    <img alt={'app-image'} src={product.imgSrc} className={`bg-contain md:mb-20 md:w-[150px] md:h-[150px]`} width={50} height={70}/>
                    <button onClick={() => window.location.assign(URL)} className={`p-2 md:p-5 w-[50%] md:w-[80%] text-center bg-green-500 md:mt-22`}>View App</button>
                </div>
            </div>
            <ProductDescription title={product.name} desc={product.longDesc} />
        </div>
    )
}

export default Product