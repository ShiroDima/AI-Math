// "use client";
import { useEffect, useRef } from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// eslint-disable-next-line react/prop-types
const Message = ({ data }) => {
	/*
    props
      - data : the data stating if this is an AI's response on
      - showDetails : it means that do we need to show the message sender's details
  */
	const textRef = useRef(null);
	// console.log(data.data)
	const isUser = data.role === "User";
	const bg = isUser ? "bg-white" : "bg-white";

	function formatText() {
		console.info(textRef.current)
		if(isUser){
			textRef.current.innerHTML = data.data;
		}else{
			let text = "";
			data.data.split("\n").forEach((str) => {
				text += str + " <br> ";
			});
			let html = <div
				id={'ai-response'}
				className={`w-full px-1 md:grid-cols-1 items-start ${bg} md:px-2 outline-none text-left text-black leading-loose`}

			>
				{text}
			</div>

			textRef.current.innerHTML = html;
		}
	}

	// Displaying the message text
	useEffect(() => {
		// console.log(katex.renderToString(data.data))
		if (isUser) {
			textRef.current.innerHTML = data.data;
		}else{
			let text = "";
			data.data.split("\n").forEach((str) => {
				text += str + " <br> ";
			});
			textRef.current.innerHTML = text;
		}

	}, [isUser, data, textRef]);

	// Typesetting the latex with Katex
	useEffect(() => {
		renderMathInElement(document.body, {
			// customised options
			// • auto-render specific keys, e.g.:
			delimiters: [
				{ left: "$$", right: "$$", display: true },
				{ left: "$", right: "$", display: false },
				{ left: "\\(", right: "\\)", display: false },
				{ left: "\\[", right: "\\]", display: true },
			],
			// • rendering keys, e.g.:
			throwOnError: false,
		});
		// });
	});

	return (
		<div
			className={`w-full ${bg} min-w-[340px] ${
				!isUser ? "mb-5" : "mb-1"
			} shadow-lg border-solid border-2 ${!isUser && data.data==="" ? "min-h-36" : "h-fit"}`}
		>
			<section className={`w-full h-full max-h-fit p-2 flex`}>
				<div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-slate-900 flex justify-center items-center">
					{data.role}
				</div>
				<div className={`sm:w-[50%] w-full md:w-[90%] ml-1 md:ml-5 md:col-span-11`}>
					<div
						id={'ai-response'}
						className={`w-full px-1 md:grid-cols-1 items-start ${bg} ${!isUser && data.data==="" ? "hidden" : ""} md:px-2 outline-none text-left text-black leading-loose`}
						ref={textRef}
					>
					</div>
					{!isUser && data.data==="" ? <Skeleton duration={2} inline={true} containerClassName={"h-full"} className={"h-full"} /> : null}
				</div>

			</section>

		</div>
	);
};

export default Message;
