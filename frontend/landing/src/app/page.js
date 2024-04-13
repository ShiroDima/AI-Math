"use client"

import ProductCard from "@/components/ProductCard";
import Product from "@/components/Product"
import Modal from "@/components/Modal";
import Link from "next/link";
import {useSearchParams} from "next/navigation";

let productDetails = [
	{
		name: "Word Search",
		imgSrc: "/images/word_search.jpg",
		desc: "A webapp that uses AI to generate words suitable for different class ranges and then uses an algorithm to generate a word search grid.",
	},
	{
		name: "AI Stem Solver",
		imgSrc: "/images/ai_tutor.png",
		desc: "A website that allows for users to query the system for solution to STEM problems and get back step by step solutions.\n" +
			"\n" +
			"It also allows the user to upload the questions as images and have the system provide solutions.",
	},
	{
		name: 'Voice Assistant',
		imgSrc: '',
		desc: 'A GPT powered voice assistant that responds to a call'
	}
];

export default function Home() {
	const searchParams = useSearchParams()

	console.log(searchParams.get('app'))

	return (
		<div className="flex h-[90%] flex-col sm:flex-row items-start justify-start p-14 gap-4 relative">
			{
				searchParams.get('app') && <Modal><Product product={productDetails[searchParams.get('app')]} /></Modal>
			}
			{productDetails.map((product, idx) => (
				<ProductCard
					key={idx}
					imgSrc={product.imgSrc}
					name={product.name}
					desc={product.desc}
					index={idx}
				/>
			))}
		</div>
	);
}
