import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Check,
	Clock,
	Copy,
	Globe,
	Heart,
	Info,
	MessageSquare,
	Server,
	Shield,
	Target,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import DetailItem from "@/components/DetailItem";
import { getGames, getListings, getUser } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { CommunityListing, LFGListing, ServerListing } from "@/types";

export const Route = createFileRoute("/listing/$id")({
	loader: async ({ params }) => {
		return { id: params?.id };
	},
	component: ListingDetails,
});

function ListingDetails() {
	const [copied, setCopied] = useState(false);

	const { id } = Route.useLoaderData();

	const {
		data: games,
		isLoading: isGamesLoading,
		isError: isGamesError,
	} = useQuery({
		queryKey: ["games"],
		queryFn: ({ signal }) => getGames(signal),
	});

	const {
		data: mockListings,
		isLoading: isListingsLoading,
		isError: isListingsError,
	} = useQuery({
		queryKey: ["listings"],
		queryFn: ({ signal }) => getListings(signal),
	});

	const {
		data: user,
		isLoading: isUserLoading,
		isError: isUserError,
	} = useQuery({
		queryKey: ["user"],
		queryFn: ({ signal }) => getUser(signal),
	});

	const listing = mockListings?.find((l) => l.id === id);

	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);

	useEffect(() => {
		if (!listing) return;
		const likedIds = user?.likedListings ?? [];
		setIsLiked(likedIds.includes(listing.id));
		setLikesCount(listing.likes);
	}, [listing, user]);

	const game = games?.find((g) => g.id === listing?.gameId);

	if (!listing || !game) {
		return <div className="p-20 text-center">Anúncio não encontrado.</div>;
	}

	const handleLike = () => {
		if (isLiked) {
			setLikesCount((prev) => prev - 1);
			setIsLiked(false);
		} else {
			setLikesCount((prev) => prev + 1);
			setIsLiked(true);
		}
	};

	const handleCopyIP = () => {
		if ("ip" in listing && listing.ip) {
			navigator.clipboard.writeText(listing.ip);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
			<Link
				to={`/game/${game.id}`}
				className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors text-sm font-bold"
			>
				<ArrowLeft className="w-4 h-4" /> Voltar para {game.name}
			</Link>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2 space-y-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<span className="px-2 py-0.5 rounded text-[10px] font-bold border border-brand-primary/30 bg-brand-primary/10 text-brand-primary uppercase tracking-wider">
								{listing?.type}
							</span>
							<span className="text-gray-500 text-xs font-mono uppercase">
								Publicado em{" "}
								{new Date(listing?.createdAt).toLocaleDateString("pt-BR")}
							</span>
						</div>
						<h1 className="text-4xl font-bold tracking-tight">
							{listing?.title}
						</h1>
						<p className="text-gray-300 text-lg leading-relaxed">
							{listing?.description}
						</p>
					</div>

					<div className="glass-panel p-6 space-y-6">
						<h2 className="text-xl font-bold flex items-center gap-2">
							<Info className="w-5 h-5 text-brand-primary" /> Detalhes
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{listing?.type === "LFG" && (
								<>
									<DetailItem
										icon={<Clock />}
										label="Disponibilidade"
										value={(listing as LFGListing).availability}
									/>
									<DetailItem
										icon={<Target />}
										label="Estilo"
										value={(listing as LFGListing).style}
									/>
									<DetailItem
										icon={<Shield />}
										label="Objetivo"
										value={(listing as LFGListing).objective}
									/>
								</>
							)}
							{listing?.type === "SERVER" && (
								<>
									<DetailItem
										icon={<Globe />}
										label="Região"
										value={(listing as ServerListing).region}
									/>
									<DetailItem
										icon={<Server />}
										label="Tipo"
										value={(listing as ServerListing).serverType}
									/>
									<DetailItem
										icon={<Shield />}
										label="Regras"
										value={(listing as ServerListing).rules}
									/>
								</>
							)}
							{listing?.type === "COMMUNITY" && (
								<>
									<DetailItem
										icon={<Users />}
										label="Foco"
										value={(listing as CommunityListing).focus}
									/>
									<DetailItem
										icon={<Shield />}
										label="Requisitos"
										value={
											(listing as CommunityListing).requirements || "Nenhum"
										}
									/>
								</>
							)}
							<DetailItem
								icon={<Globe />}
								label="Idioma"
								value={listing?.language || ""}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="glass-panel p-6 space-y-6 sticky top-24">
						<h3 className="font-bold text-lg">Ações</h3>

						<div className="space-y-3">
							<button
								type="button"
								onClick={handleLike}
								className={cn(
									"w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold transition-all border",
									isLiked
										? "bg-red-500/10 border-red-500 text-red-500"
										: "bg-transparent border-gray-600 text-gray-400 hover:border-red-400 hover:text-red-400",
								)}
							>
								<Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
								{isLiked ? "Curtido" : "Curtir"} ({likesCount})
							</button>

							<a
								href={listing?.discord}
								target="_blank"
								rel="noopener noreferrer"
								className="btn-primary w-full flex items-center justify-center gap-2"
							>
								<MessageSquare className="w-5 h-5" /> Entrar no Discord
							</a>

							{"ip" in listing && listing.ip && (
								<button
									type="button"
									onClick={handleCopyIP}
									className="btn-secondary w-full flex items-center justify-center gap-2"
								>
									{copied ? (
										<Check className="w-5 h-5" />
									) : (
										<Copy className="w-5 h-5" />
									)}
									{copied ? "Copiado!" : "Copiar IP"}
								</button>
							)}
						</div>

						<div className="pt-6 border-t border-border-dark">
							<p className="text-xs text-gray-500 mb-4">Tags do anúncio</p>
							<div className="flex flex-wrap gap-2">
								{listing?.tags?.map((tag) => (
									<span
										key={tag}
										className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-400"
									>
										#{tag}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
