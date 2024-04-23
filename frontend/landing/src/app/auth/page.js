"use client";

import { UserCircleIcon, LockClosedIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AWS from "aws-sdk";

AWS.config.update({
	accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
	region: process.env.NEXT_PUBLIC_COGNITO_REGION,
});

const Login = () => {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");

	const handleLogin = async () => {
		const auth = localStorage.getItem("AccessToken");
		if (auth) {
			location.assign("/");
		} else {
			let input = {
				AuthFlow: "USER_PASSWORD_AUTH",
				AuthParameters: {
					PASSWORD: password,
					USERNAME: username,
				},
				ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			};

			try {
			    const cognito = new AWS.CognitoIdentityServiceProvider()
	            let response =  await cognito.initiateAuth(input).promise();
			    localStorage.setItem('AccessToken', response.AuthenticationResult.AccessToken)
			    let url = localStorage.getItem('nextURL')

			    localStorage.removeItem('nextURL')

			    url ? location.assign(url) : location.assign('/')
			}catch (error) {
			    console.log(error)
			    toast.error('An error occurred! Please try again', {
			        position: 'top-left',
			        className: 'w-[70%] md:w-[800px] text-[8px] md:text-[12px]',
			    })
			}
		}
	};

	return (
		<div
			className={`min-h-[700px] w-screen md:p-14 md:h-[90%] flex justify-center items-center`}
		>
			<div
				className={`md:w-[30%] w-[90%] h-[400px] bg-slate-800 grid grid-row-3 place-items-center`}
			>
				<div
					className={`flex justify-center items-center text-white text-[32px] md:p-2`}
				>
					Login
				</div>
				<div
					className={`w-[70%] h-[30px] flex flex-col justify-center`}
				>
					<div className={`mb-5 w-full`}>
						<label
							htmlFor={"username"}
							className={`text-white w-[100px] justify-between flex items-center mb-2`}
						>
							<UserCircleIcon className={`w-4 h-4`} />
							Username:
						</label>
						<input
							id={"username"}
							className={`focus:outline-none p-2 w-full`}
							type={"text"}
							placeholder={"Enter your username..."}
							onChange={(event) =>
								setUsername(event.target.value)
							}
						/>
					</div>

					<div className={`mb-5 w-full`}>
						<label
							htmlFor={"password"}
							className={`text-white w-[100px] justify-between flex items-center mb-2`}
						>
							<LockClosedIcon className={`w-4 h-4`} />
							Password:
						</label>
						<input
							id={"password"}
							className={`focus:outline-none p-2 w-full`}
							type={"password"}
							placeholder={"Enter your password..."}
							onChange={(event) =>
								setPassword(event.target.value)
							}
						/>
					</div>
				</div>
				<div
					className={`h-10 w-[30%] flex justify-center items-center`}
				>
					<button
						onClick={handleLogin}
						className={`text-slate-800 bg-white cursor-pointer w-full hover:bg-slate-800 hover:text-white hover:border-white hover:border-2 h-full`}
					>
						Login
					</button>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default Login;
