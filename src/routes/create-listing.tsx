import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { MessageSquare, Server, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import TypeOption from "@/components/TypeOption";
import { getGames } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ListingType } from "@/types";

export const Route = createFileRoute("/create-listing")({
	component: RouteComponent,
});

function RouteComponent() {
	const [step, setStep] = useState(1);
	const [type, setType] = useState<ListingType | null>(null);
	const [selectedGame, setSelectedGame] = useState<string | null>(null);
	const navigate = useNavigate();
	const [searchParams] = useLocation().search
		? [new URLSearchParams(useLocation().search)]
		: [null];

	useEffect(() => {
		const gameId = searchParams?.get("game");
		if (gameId) setSelectedGame(gameId);
	}, [searchParams]);

	const {
		data: games,
		isLoading: isGamesLoading,
		isError: isGamesError,
	} = useQuery({
		queryKey: ["games"],
		queryFn: ({ signal }) => getGames(signal),
	});

	const handleFinish = () => {
		// Mock finish
		alert("Anúncio criado com sucesso! (Simulação)");
		navigate("/");
	};

	return (
		<div className="max-w-3xl mx-auto px-4 py-12">
			<div className="mb-12 space-y-4 text-center">
				<h1 className="text-4xl font-bold tracking-tight">
					Criar novo anúncio
				</h1>
				<div className="flex justify-center gap-4">
					{[1, 2, 3].map((s) => (
						<div
							key={s}
							className={cn(
								"w-12 h-1.5 rounded-full transition-all",
								step >= s ? "bg-brand-primary" : "bg-border-dark",
							)}
						/>
					))}
				</div>
			</div>

			<AnimatePresence mode="wait">
				{step === 1 && (
					<motion.div
						key="step1"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-6"
					>
						<h2 className="text-2xl font-bold text-center">
							O que você quer anunciar?
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<TypeOption
								icon={<Server className="w-8 h-8" />}
								title="Servidor"
								desc="Divulgue seu servidor multiplayer"
								active={type === "SERVER"}
								onClick={() => {
									setType("SERVER");
									setStep(2);
								}}
							/>
							<TypeOption
								icon={<Users className="w-8 h-8" />}
								title="Comunidade"
								desc="Encontre membros para sua guilda ou clã"
								active={type === "COMMUNITY"}
								onClick={() => {
									setType("COMMUNITY");
									setStep(2);
								}}
							/>
							<TypeOption
								icon={<MessageSquare className="w-8 h-8" />}
								title="LFG"
								desc="Procure um grupo para jogar agora"
								active={type === "LFG"}
								onClick={() => {
									setType("LFG");
									setStep(2);
								}}
							/>
						</div>
					</motion.div>
				)}

				{step === 2 && (
					<motion.div
						key="step2"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-6"
					>
						<h2 className="text-2xl font-bold text-center">Qual é o jogo?</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{games?.map((game) => (
								<button
									type="button"
									key={game.id}
									onClick={() => {
										setSelectedGame(game.id);
										setStep(3);
									}}
									className={cn(
										"glass-panel p-4 flex flex-col items-center gap-3 transition-all hover:border-brand-primary",
										selectedGame === game.id &&
											"border-brand-primary bg-brand-primary/5",
									)}
								>
									<img
										alt={`${game.name} cover`}
										src={game.image}
										className="w-12 h-12 rounded-lg object-cover"
										referrerPolicy="no-referrer"
									/>
									<span className="font-bold text-sm">{game.name}</span>
								</button>
							))}
						</div>
						<button
							type="button"
							onClick={() => setStep(1)}
							className="text-gray-500 hover:text-white text-sm font-bold block mx-auto"
						>
							Voltar
						</button>
					</motion.div>
				)}

				{step === 3 && (
					<motion.div
						key="step3"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-6"
					>
						<h2 className="text-2xl font-bold text-center">
							Preencha os detalhes
						</h2>
						<div className="glass-panel p-8 space-y-6">
							<div className="space-y-2">
								<label
									htmlFor="title"
									className="text-xs font-bold text-gray-500 uppercase"
								>
									Título do anúncio
								</label>
								<input
									name="title"
									type="text"
									placeholder="Ex: Servidor Hardcore PVP"
									className="w-full bg-bg-dark border border-border-dark rounded-lg p-3 focus:outline-none focus:border-brand-primary"
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="description"
									className="text-xs font-bold text-gray-500 uppercase"
								>
									Descrição
								</label>
								<textarea
									name="description"
									rows={4}
									placeholder="Conte mais sobre o que você está oferecendo..."
									className="w-full bg-bg-dark border border-border-dark rounded-lg p-3 focus:outline-none focus:border-brand-primary"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label
										htmlFor="discord"
										className="text-xs font-bold text-gray-500 uppercase"
									>
										Link do Discord
									</label>
									<input
										name="discord"
										type="text"
										placeholder="discord.gg/..."
										className="w-full bg-bg-dark border border-border-dark rounded-lg p-3 focus:outline-none focus:border-brand-primary"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="language"
										className="text-xs font-bold text-gray-500 uppercase"
									>
										Idioma
									</label>
									<select
										name="language"
										className="w-full bg-bg-dark border border-border-dark rounded-lg p-3 focus:outline-none focus:border-brand-primary"
									>
										<option>Português</option>
										<option>Inglês</option>
										<option>Espanhol</option>
									</select>
								</div>
							</div>
							<button
								type="button"
								onClick={handleFinish}
								className="btn-primary w-full py-4 text-lg"
							>
								Publicar Anúncio
							</button>
						</div>
						<button
							type="button"
							onClick={() => setStep(2)}
							className="text-gray-500 hover:text-white text-sm font-bold block mx-auto"
						>
							Voltar
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
