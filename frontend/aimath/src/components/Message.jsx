// "use client";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import renderMathInElement from "katex/contrib/auto-render";
import rehypeSanitize from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Remark } from 'react-remark'
import { CharacterTextSplitter } from 'langchain/text_splitter'


const splitter = new CharacterTextSplitter({
	chunkSize: 7,
	chunkOverlap: 0,
	separator: ' '
})

const streamText = async function* (text) {
	const output = await splitter.createDocuments([text]);
	for(const out of output){
		yield out.pageContent;
	}
}

const streamGenerator = async (text, setLabel) => {
	for await (const t of streamText(text)){
		console.info(t)
		setLabel(prev => prev + ' ' + t)
		await new Promise(resolve => setTimeout(resolve, 200));
	}
}

// eslint-disable-next-line react/prop-types
const Message = ({ data }) => {
	/*
    props
      - data : the data stating if this is an AI's response on
      - showDetails : it means that do we need to show the message sender's details
  */
	const [text, setText] = useState('');
	// console.log(data.data)
	const isUser = data.role === "User";
	const bg = isUser ? "bg-white" : "bg-white";

	// // Typesetting the latex with Katex
	// useEffect(() => {
	// 	!isUser ? (async () => await streamGenerator(data.data, setText))() : setText(data.data)
	// }, [data]);

	return (
		<div
			className={`w-full ${bg} md:min-w-[340px] ${
				!isUser ? "mb-5" : "mb-1"
			} shadow-lg border-solid border-2 ${
				!isUser && data.data === "" ? "min-h-36" : "h-fit"
			}`}
		>
			<section
				className={`w-full h-full max-h-fit p-2 text-[10px] md:text-[15px] flex`}
			>
				<div className="w-[30px] p-2 md:p-0 h-[30px] md:w-[50px] md:h-[50px] bg-slate-900 flex justify-center items-center">
					{data.role}
				</div>
				<div
					className={`sm:w-[50%] w-full md:w-[90%] ml-1 md:ml-5 md:col-span-11`}
				>
					{
						data.data === "" ? (
							<Skeleton
								duration={2}
								count={isUser ? 1 : 5}
								inline={true}
								containerClassName={"h-full"}
							/>
						) : (
							<div
								id={"content"}
								className={`w-full px-1 md:grid-cols-1 items-start ${bg} ${
									!isUser && data.data === "" ? "hidden" : ""
								} md:px-2 outline-none text-left text-black leading-loose flex flex-col items-start text-wrap`}
							>
								<Remark
									remarkPlugins={[remarkMath]}
									remarkToRehypeOptions={{allowDangerousHtml: true}}
									rehypePlugins={[rehypeSanitize, rehypeKatex]}
									rehypeReactOptions={{
										components: {
											div: (props) => <div className='text-left ' {...props} />,
										}
									}}
								>
									{data.data}
								</Remark>
							</div>
						)
					}
				</div>
			</section>
		</div>
	);
};

export default Message;
