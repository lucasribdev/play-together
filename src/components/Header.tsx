import { Link } from "@tanstack/react-router";
import { Gamepad2, PlusCircle, UserIcon } from "lucide-react";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border-dark bg-bg-dark/80 backdrop-blur-md">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<Link to="/" className="flex items-center gap-2">
						<div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
							<Gamepad2 className="text-black w-5 h-5" />
						</div>
						<span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
							JogaJunto
						</span>
					</Link>

					<div className="hidden md:flex items-center gap-6">
						<Link
							to="/"
							className="text-sm font-medium hover:text-brand-primary transition-colors"
						>
							Início
						</Link>
						<Link
							to="/games"
							className="text-sm font-medium hover:text-brand-primary transition-colors"
						>
							Jogos
						</Link>
						<Link
							to="/profile"
							className="text-sm font-medium hover:text-brand-primary transition-colors flex items-center gap-2"
						>
							<UserIcon className="w-4 h-4" /> Perfil
						</Link>
					</div>

					<div className="flex items-center gap-4">
						<Link
							to="/create-listing"
							className="btn-primary flex items-center gap-2 text-sm py-1.5"
						>
							<PlusCircle className="w-4 h-4" />
							<span className="hidden sm:inline">Criar Anúncio</span>
						</Link>
					</div>
				</div>
			</nav>
		</header>
	);
}
