import { UploadedFileContextProvider } from "@/context/ContextProvider.jsx";

import "./globals.css";

export const metadata = {
	title: "AI STEM Solver",
	description: "AI problem solver for STEM",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="bg-white shadow-2xl border-solid border-2 min-w-screen max-w-screen h-screen dark:text-white">
				{
					<UploadedFileContextProvider>
						{children}
					</UploadedFileContextProvider>
				}
			</body>
		</html>
	);
}
