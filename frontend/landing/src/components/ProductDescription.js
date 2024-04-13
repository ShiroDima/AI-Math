const ProductDescription = ({title, desc}) => {
    return (
        <div className={'flex flex-col mx-10 mt-5 p-10 text-white max-w-[50%]'}>
            <h1 className={`text-center w-full text-4xl mb-5`}>{title}</h1>
            <div className={`my-5 text-xl`}>
                <p>{desc}</p>
            </div>
            <div className={`flex gap-5 snap-x snap-mandatory overflow-x-scroll h-[600px]`}>
                <img alt={'product-example'} src={'/images/aimath/example_1.png'} className={`bg-contain`} width={250} height={150}/>
                <img alt={'product-example'} src={'/images/aimath/example_2.png'} className={`bg-contain`} width={250} height={150}/>
                <img alt={'product-example'} src={'/images/aimath/example_3.png'} className={`bg-contain`} width={250} height={150}/>
            </div>
        </div>
    )
}

export default ProductDescription