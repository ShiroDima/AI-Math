"use client";

import Link from "next/link";

export default function ProductCard({ imgSrc, name, desc, index, hasApp }) {
	let URL = name.includes("search")
		? "https://word-search.dywno4kca4mbu.amplifyapp.com"
		: "https://ai-math.dywno4kca4mbu.amplifyapp.com/";

	function handleClick() {
		console.info("Clicked on Word Search");
		window.location.assign(URL);
	}

	return (
		<div
			className="bg-slate-800 w-[250px] h-[450px] text-white flex flex-col cursor-pointer"
		>
			<div className={`h-[90%]`}>
				<div className="border-b-2 border-b-white m-2 px-2 pt-2 pb-5 h-[60%]">
					<img
						src={imgSrc}
						alt="product image"
						className="bg-white h-full"
						width={250}
						height={150}
					/>
				</div>
				<div className="p-4 h-[40%] flex flex-col gap-5">
					<span className="text-[20px] cursor-default">{name}</span>
					<p className="text-[12px]">{desc}</p>
				</div>
			</div>
			<div className={'flex justify-center items-center h-[10%] bg-white text-slate-800 hover:bg-slate-800 hover:text-white hover:border-white hover:border-2'}>
				<Link href={`/?app=${index}`}>Learn More</Link>
			</div>
		</div>
	);
}
