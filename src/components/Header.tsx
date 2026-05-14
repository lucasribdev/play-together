import { Link, useNavigate } from "@tanstack/react-router";
import { Gamepad2, LogIn, PlusCircle, UserIcon } from "lucide-react";
import { useAuthPrompt } from "@/components/AuthPromptModal";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
	const { isSessionLoading, session } = useAuth();
	const { openAuthPrompt } = useAuthPrompt();

	const navigate = useNavigate();
	const profileFullName = session?.user.user_metadata.full_name;

	const handleDiscordLogin = () => {
		openAuthPrompt({
			title: "Entrar",
			description: "Entre ou cadastre-se com Discord para usar o Templo.",
			redirectTo: "/",
		});
	};

	const handleCreateListing = () => {
		if (session) {
			navigate({ to: "/create-listing" });
			return;
		}

		openAuthPrompt({
			title: "Criar anúncio",
			description: "Você precisa estar autenticado para criar um anúncio.",
			redirectTo: "/create-listing",
		});
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border-dark bg-bg-dark/80 backdrop-blur-md">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<Link to="/" className="flex items-center gap-2">
						<div className="w-8 h-8 flex items-center justify-center">
							<Gamepad2 className="text-brand-primary w-7 h-7" />
						</div>
						<span className="font-display text-xl font-bold tracking-wider text-white">
							TEMPLO
						</span>
					</Link>

					<div className="flex items-center gap-4 min-w-[220px] justify-end">
						{isSessionLoading ? (
							<div className="h-8 w-[160px] rounded-md bg-white/5 animate-pulse" />
						) : !session ? (
							<>
								<button
									type="button"
									onClick={handleCreateListing}
									className="btn-primary flex items-center gap-2 text-sm py-1.5"
								>
									<PlusCircle className="w-4 h-4" />
									<span className="hidden sm:inline">Criar Anúncio</span>
								</button>
								<button
									type="button"
									onClick={handleDiscordLogin}
									className="text-sm font-medium hover:text-brand-primary transition-colors flex items-center gap-2"
								>
									<LogIn className="w-4 h-4" /> Entrar com Discord
								</button>
							</>
						) : (
							<>
								<button
									type="button"
									onClick={handleCreateListing}
									className="btn-primary flex items-center gap-2 text-sm py-1.5"
								>
									<PlusCircle className="w-4 h-4" />
									<span className="hidden sm:inline">Criar Anúncio</span>
								</button>
								<Link
									to="/profile/$profileFullName"
									params={{ profileFullName }}
									className="text-sm font-medium text-gray-300 hover:text-brand-primary transition-colors flex items-center gap-2"
								>
									<UserIcon className="w-4 h-4" /> Perfil
								</Link>
							</>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
