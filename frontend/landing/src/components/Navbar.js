export default function Navbar() {
	return (
		<nav className="flex w-full justify-center md:justify-normal items-center p-2 h-[10%] bg-slate-800">
			<div className="w-[60%] pl-2 md:w-[100%] md:mr-2 flex justify-center text-white text-[18px] md:text-[30px] lg:text-[50px] font-bold">
				Quantum & Generative AI Portfolio
			</div>
			<div className="w-[40%] md:w-[20%] flex justify-end p-2">
				<button className="p-2 w-[100px] h-[50px] bg-white text-slate-800 rounded-lg hover:bg-slate-800 hover:text-white hover:border-white hover:border-2">
					Sign Out
				</button>
			</div>
		</nav>
	);
}
