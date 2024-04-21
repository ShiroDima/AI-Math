"use client"

import ProductCard from "@/components/ProductCard";
import Product from "@/components/Product"
import Modal from "@/components/Modal";
import {useSearchParams} from "next/navigation";

let productDetails = [
	{
		name: "Word Search",
		imgSrc: "/images/thumbnail/word_search.png",
		shortDesc: 'AI powered word search web app',
		longDesc: "A webapp that uses AI to generate words suitable for different class ranges and then uses an algorithm to generate a word search grid.",
		exampleImg: ['/images/search/example_1.png', '/images/search/example_2.png', '/images/search/example_3.png'],
		hasApp: true
	},
	{
		name: "AI Stem Solver",
		imgSrc: "/images/thumbnail/ai_math.png",
		shortDesc: 'AI powered problem solver',
		longDesc: "A website that allows for users to query the system for solution to STEM problems and get back step by step solutions.\n" +
			"\n" +
			"It also allows the user to upload the questions as images and have the system provide solutions.",
		exampleImg: ['/images/aimath/example_1.png', '/images/aimath/example_2.png', '/images/aimath/example_3.png'],
		hasApp: true
	},
	{
		name: 'Voice Assistant',
		imgSrc: '/images/thumbnail/voice_assistant.png',
		shortDesc: 'AI powered voice assistant over calls',
		longDesc: 'A GPT powered voice assistant that responds to a call',
		exampleImg: [],
		hasApp: true
	},
	{
		name: 'YOLO & Temporal YOLO models',
		imgSrc: '/images/thumbnail/yolo.png',
		shortDesc: 'Deep Learning for Computer Vision',
		longDesc: `Engineering of various computer YOLO deep learning architectures. Some include:
					YOLO v5, YOLO v5 + ConvLSTM, YOLO v5 QRNN`,
		exampleImg: ['/images/yolo/example_1.png', '/images/yolo/example_2.png', '/images/yolo/example_3.png'],
		hasApp: false
	}
];

export default function Home() {
	const searchParams = useSearchParams()

	return (
		<div className="flex h-fit md:h-[90%] flex-col flex-col md:flex-row items-start justify-start p-14 gap-4 relative">
			{
				searchParams.get('app') && <Modal><Product product={productDetails[searchParams.get('app')]} /></Modal>
			}
			{productDetails.map((product, idx) => (
				<ProductCard
					key={idx}
					imgSrc={product.imgSrc}
					name={product.name}
					desc={product.shortDesc}
					index={idx}
				/>
			))}
		</div>
	);
}
