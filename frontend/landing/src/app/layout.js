import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";



const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Amazing Quantum & Generative AI Applications",
	description: "Portfolio website showcasing applications with quantum and generative AI.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.className} bg-slate-500 min-h-screen h-fit md:h-screen`}>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
