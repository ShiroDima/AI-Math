import { useState, useEffect, useRef } from "react";
import Image from 'next/image'
import Message from "@/components/Message.jsx";
import Thumbnail from "@/components/Thumbnail.jsx"
import axios from "axios";
import {
	PaperAirplaneIcon,
} from "@heroicons/react/solid";
import {BounceLoader} from "react-spinners";
import {PhotographIcon} from "@heroicons/react/outline"

import { useUploadedFileContext } from "@/context/UploadedFileContext.js";


const ChatRoom = () => {
	// to get the messages and store it here
	const [messages, setMessages] = useState([]);
	// Current input field value
	const [text, setText] = useState("");

	// is send button enabled or not
	const [sendButton, setSendButton] = useState(false);

	// Uploaded files
	const { uploadedFiles, addFile, addFileCloud, uploadedFilesCloud } =
		useUploadedFileContext();

	// current uploaded file name
	const [fileName, setFileName] = useState("");
	// Show Files
	const [isUploading, setIsUploading] = useState(false);

	// dummy reference just to scroll
	const dummy = useRef(null);
	// to send the message through ctrl+enter
	const formRef = useRef(null);
	const messageInputRef = useRef(null);

	// useEffect(() => {
	// 	setMessages([{role: "User", data: "Integral of 2x?"}, {role: "AI", data: ""}])
	// }, [])

	// Scroll every time as we send the messages
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	/* function just to scroll to the bottom to the dummy div */
	function scrollToBottom() {
		dummy.current.scrollIntoView({ behavior: "smooth" });
	}

	// It send the message to the API for processing
	async function sendMessage(event) {
		event.preventDefault();
		setText("");
		// messageInputRef.current.style.height = "100%";

		setSendButton(false);

		// Checking if text or image is empty then don't send the message
		if (!text) return null;

		// setMessages((prevState) => [
		// 	...prevState,
		// 	{ role: "User", data: text },
		// ]);

		// let data = JSON.stringify({
		// 	question: text,
		// 	image_link:
		// 		uploadedFilesCloud.length !== 0
		// 			? uploadedFilesCloud.map((file) => file.url)
		// 			: null,
		// });

		console.log(
			JSON.stringify({
				question: text,
				image_links:
					uploadedFilesCloud.length !== 0
						? uploadedFilesCloud.map((file) => file.url)
						: null,
			})
		);

		let config = {
			method: "post",
			url: `${process.env.NEXT_PUBLIC_API_URL}/solve`,
			headers: {
				"Content-Type": "application/json",
				'Authorization': `eyJraWQiOiIzMExoR1YrMnYwZVRpcHMyUFZid3F1d1FYSHdKS3JaYnRLSnhcL2hGMEs4ND0iLCJhbGciOiJSUzI1NiJ9.eyJvcmlnaW5fanRpIjoiNmM0NjE0MzctZjAzOC00Y2E1LTlhNzItODA4NTUyNDg2YjNkIiwic3ViIjoiNDE5ZjkzOGQtNTNhNy00MjI1LTlhNmEtZTIxNDczYjYwMTA1IiwiYXVkIjoiMWRjcDI0aGo3a3BvY3VxbGllZm1yYWE5amQiLCJldmVudF9pZCI6ImMwNjlhMTNiLTQ2NjgtNGU0ZC1iZmNhLWU2NjY0ZTcwOTU1YSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzEyNzg1ODk3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV9xcFBxSk54R2oiLCJjb2duaXRvOnVzZXJuYW1lIjoic2hpcm9kaW1hIiwiZXhwIjoxNzEyODcyMjk3LCJpYXQiOjE3MTI3ODU4OTcsImp0aSI6IjlhNDIwMjBmLTExNjgtNGVjYS1hOWIyLWE5Y2YxMmZkNzZjMCJ9.MLtEWkviepPOK5_qe1-JqbyZROr4iRjB1Ow55sRd_GLzVo3Mv-3R5wWlFXrmoIsFknEhDSEl9F_Pd2_8t4mjWB9G5YVY2Uh517sPRZGvKzQW-mFCyLYlCyVzL23GPG2fBHDPsClUmqxpB1pEWdcwfdYNM202FUlfVq90IFa_2GVeP_KrRVWkmaNmcVsYuGPB_I4aiyTCaFwCtudmz79htyN9yeeH7FFUkHMkAq9PSQETzuzzz-w0qmXWIj4GS-dItQ14io3mlho8a8390Gf2OoQzXsRxW8ng-xfAH5W8wjOErs3ca_YRVACSAR97LQfixMNQ8CgepQQIi8h1AMpiyQ`
			},
			data: JSON.stringify({
				question: text,
				image_links:
					uploadedFilesCloud.length !== 0
						? uploadedFilesCloud.map((file) => file.url)
						: null,
			}),
		};

		let formatConfig = {
			method: "post",
			url: "http://localhost:5000/format",
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				question: text,
				image_link: null,
			}),
		};

		axios(formatConfig)
			.then((response) => {
				setMessages((prevState) => [
					...prevState,
					{ role: "User", data: response.data },
					{ role: "AI", data: "" }
				]);
			})
			.finally(() => {
				axios(config)
					.then(function (response) {
						console.log(response.data);
						response.status === 200
							? setMessages((prevState) => prevState.map((item, idx) => {
								if(idx===prevState.length-1){
									return {...item, data: response.data.answer_content}
								}
								return item
							}))
							: null;
					})
					.finally(() => {
						setSendButton(false);
						scrollToBottom();
					})
					.catch(function (error) {
						console.log(error);
					});
			})
			.catch((error) => console.log(error));
	}

	function uploadImage(formData, file) {
		// console.log(process.env.NEXT_PUBLIC_API_URL)
		//
		const headers = {
			// 'Content-Type': 'multipart/form-data',
			'Authorization': `eyJraWQiOiIzMExoR1YrMnYwZVRpcHMyUFZid3F1d1FYSHdKS3JaYnRLSnhcL2hGMEs4ND0iLCJhbGciOiJSUzI1NiJ9.eyJvcmlnaW5fanRpIjoiNmM0NjE0MzctZjAzOC00Y2E1LTlhNzItODA4NTUyNDg2YjNkIiwic3ViIjoiNDE5ZjkzOGQtNTNhNy00MjI1LTlhNmEtZTIxNDczYjYwMTA1IiwiYXVkIjoiMWRjcDI0aGo3a3BvY3VxbGllZm1yYWE5amQiLCJldmVudF9pZCI6ImMwNjlhMTNiLTQ2NjgtNGU0ZC1iZmNhLWU2NjY0ZTcwOTU1YSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzEyNzg1ODk3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV9xcFBxSk54R2oiLCJjb2duaXRvOnVzZXJuYW1lIjoic2hpcm9kaW1hIiwiZXhwIjoxNzEyODcyMjk3LCJpYXQiOjE3MTI3ODU4OTcsImp0aSI6IjlhNDIwMjBmLTExNjgtNGVjYS1hOWIyLWE5Y2YxMmZkNzZjMCJ9.MLtEWkviepPOK5_qe1-JqbyZROr4iRjB1Ow55sRd_GLzVo3Mv-3R5wWlFXrmoIsFknEhDSEl9F_Pd2_8t4mjWB9G5YVY2Uh517sPRZGvKzQW-mFCyLYlCyVzL23GPG2fBHDPsClUmqxpB1pEWdcwfdYNM202FUlfVq90IFa_2GVeP_KrRVWkmaNmcVsYuGPB_I4aiyTCaFwCtudmz79htyN9yeeH7FFUkHMkAq9PSQETzuzzz-w0qmXWIj4GS-dItQ14io3mlho8a8390Gf2OoQzXsRxW8ng-xfAH5W8wjOErs3ca_YRVACSAR97LQfixMNQ8CgepQQIi8h1AMpiyQ`
		}

		let url = `${process.env.NEXT_PUBLIC_API_URL}/image/upload`

		axios
			.put(url, formData, { headers })
			.then(function (response) {
				console.log(response.data);
				addFileCloud(response.data);
				addFile(file);
			})
			.finally(() => {
				document.getElementById('custom-file-picker').value = ""
				setIsUploading(prev => !prev)
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	function handleDragIn() {
		formRef.current.style.borderColor = "#2B6992";
	}

	function handleDragOut() {
		formRef.current.style.borderColor = "#F4F4F5";
	}

	function handleDrop(event) {
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			for (let i = 0; i < event.dataTransfer.files["length"]; i++) {
				let formData = new FormData();

				formData.append("image_file", event.dataTransfer.files[i]);

				uploadImage(formData, event.dataTransfer.files[i]);
			}
		}
	}

	return (
		<div className="flex flex-col w-full gap-0 h-screen relative lg:mx-auto lg:my-0 ">
			{/* main Chat content */}
			<div className="flex flex-col px-12 overflow-x-hidden scrollbar-hide h-[90%] w-full max-w-[1500px] mx-auto pb-4">
				{messages &&
					messages.map((message, i) => {
						return (
							<Message
								key={i}
								// showDetails={showDetails}
								data={message}
							/>
						);
					})}

				{/* Dummy div onScrollBottom we scroll to here */}
				<div ref={dummy}></div>
			</div>

			{/* input form */}
			<div className="min-w-[300px] md:w-[60%] lg:w-[70%] xl:w-[40%] sm:w-[90%] flex my-5 fixed bottom-[10px] xl:left-[30%] lg:left-[14%] md:left-[10%] left-[5%]">
				<form
					ref={formRef}
					className={`sticky w-full bottom-0 z-50 bg-zinc-100 dark:text-black ${uploadedFilesCloud.length !== 0 ? 'h-36 max-h-36' : 'h-16'} flex flex-col border-solid border-2 shadow-2xl rounded-lg relative`}
					onSubmit={sendMessage}
					onDragEnter={handleDragIn}
					onDrop={(event) => handleDrop(event)}
					onDragLeave={handleDragOut}
					// onDragOver={handleDragIn} flex justify-start p-2 w-full bg-slate-200
				>
					<div className={`${uploadedFilesCloud.length !== 0 ? 'bg-zinc-100 flex w-full gap-4 p-2 justify-start h-[55%]' : 'hidden'}`}>
						{
							uploadedFilesCloud.map((file, idx) => <Thumbnail key={idx} imgSrc={file.url} fileName={file.name} />)
						}
					</div>
					<div className={`flex w-full ${uploadedFilesCloud.length !== 0 ? 'items-center h-[40%]' : 'h-full'}`}>
						<div className={"flex flex-row items-center h-full w-[5%]"}>
							<input
								className={"p-2"}
								id="custom-file-picker"
								type={"file"}
								onChange={(event) => {
									setIsUploading(true)
									setFileName(event.target.files[0].name);
									let formData = new FormData();
									formData.append(
										"image_file",
										event.target.files[0]
									);

									uploadImage(
										formData,
										event.target.files[0]
									);

									// setIsUploading(prev => !prev)
								}}
								hidden
								accept={"image/png, image/jpeg"}
							/>
							<label
								htmlFor="custom-file-picker"
								className={"p-2 bg-none cursor-pointer"}
							>
								{(isUploading && <BounceLoader size={20} color={"#000"} />)}
								{!isUploading && <PhotographIcon className={`w-6 h-6`} />}
							</label>
						</div>

						<textarea
							ref={messageInputRef}
							type="text"
							// onInput={(event) => {
							// 	event.target.style.height = "100%";
							// 	event.target.style.height =
							// 		event.target.scrollHeight + "px";
							// }}
							placeholder="Type your question..."
							value={text}
							onChange={(event) => {
								setText(event.target.value);
								setSendButton(true);
							}}
							// flex resize-none items-start max-w-full w-full h-10 lg:max-w-screen-md p-2 placeholder-black text-black outline-none resize-none scrollbar-hide bg-transparent
							className={`bg-zinc-100 block w-[87%] resize-none h-full rounded-l-lg outline-none scrollbar-hide text-left ${uploadedFilesCloud.length !==0 ? 'py-4' : 'py-5'} px-1`}
						>

						</textarea>

						<div className={"flex h-full items-center justify-center w-[5%]"}>
							<div className={"flex flex-row items-center h-full"}>
								<button
									className={`p-2 ${
										!text
											? "text-black"
											: "bg-green-600 text-black"
									} ${
										sendButton
											? "cursor-pointer"
											: "cursor-not-allowed"
									} rounded-2xl flex items-center`}
									type="submit"
									onClick={sendMessage}
								>
									<PaperAirplaneIcon
										className={`w-5 h-5 rotate-90`}
									/>
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ChatRoom;
