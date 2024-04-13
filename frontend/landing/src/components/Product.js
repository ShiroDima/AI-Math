"use client"

import {useRouter} from 'next/navigation'
import ProductDescription from "@/components/ProductDescription";

const Product = ({ product }) => {

    let URL;
    if(product.name.includes('AI')){
        URL = 'https://ai-math.dywno4kca4mbu.amplifyapp.com'
    }else if(product.name.includes('Search')){
        URL = 'https://word-search.dywno4kca4mbu.amplifyapp.com'
    }else {
        URL = 'http://quantumai-expert-lb-499712256.eu-central-1.elb.amazonaws.com:7000'
    }
    console.log(URL)
    return (
        <div className={`w-full h-full max-h-full flex`}>
            <div className={`w-[50%] h-[100%] relative after-content-[''] after:border-r-white after:h-[80%] after:border-r-2 after:absolute after:right-0 after:top-20 after:margin-x-10`}>
                <div className={`w-full h-full p-10 flex flex-col justify-center items-center`}>
                    <img alt={'app-image'} src={product.imgSrc} className={`bg-contain mb-10`} width={350} height={400}/>
                    <button onClick={() => window.location.assign(URL)} className={`p-5 w-[80%] text-center bg-green-500 mt-32`}>View App</button>
                </div>
            </div>
            <ProductDescription title={product.name} desc={product.desc} />
        </div>
    )
}

export default Product