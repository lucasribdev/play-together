import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, PlusCircle } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { useAuth } from "@/hooks/use-auth";
import { getGames, getListings, getUser } from "@/lib/api";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
	const { session } = useAuth();

	const meta = session?.user?.user_metadata ?? {};
	const displayName =
		meta.full_name ||
		meta.name ||
		meta.custom_claims?.global_name ||
		session?.user?.email ||
		"Jogador";
	const avatarUrl = meta.avatar_url || meta.picture || meta.image_url;
	const memberSince = session?.user?.created_at
		? new Intl.DateTimeFormat("pt-BR", {
				month: "long",
				year: "numeric",
			}).format(new Date(session.user.created_at))
		: null;

	const { data: user, isLoading: isUserLoading } = useQuery({
		queryKey: ["user"],
		queryFn: ({ signal }) => getUser(signal),
		enabled: !!session,
	});

	const { data: games } = useQuery({
		queryKey: ["games"],
		queryFn: ({ signal }) => getGames(signal),
	});

	const { data: listings, isLoading: isListingsLoading } = useQuery({
		queryKey: ["listings"],
		queryFn: ({ signal }) => getListings(signal),
	});

	const favoriteIds = user?.favorites ?? [];
	const myListings = listings?.filter((l) => l.userId === user?.id);
	const favoriteListings = listings?.filter((l) => favoriteIds.includes(l.id));

	if (!session) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-16">
				<div className="glass-panel p-10 text-center space-y-4">
					<h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
					<p className="text-gray-400">Faça login para acessar seu perfil.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
			<div className="flex flex-col md:flex-row items-center gap-8 glass-panel p-8">
				{avatarUrl ? (
					<img
						src={avatarUrl}
						alt={displayName}
						className="w-32 h-32 rounded-3xl border-4 border-brand-primary/20"
						referrerPolicy="no-referrer"
					/>
				) : (
					<div className="w-32 h-32 rounded-3xl border-4 border-brand-primary/20 bg-white/5 flex items-center justify-center text-3xl font-bold">
						{displayName.slice(0, 1).toUpperCase()}
					</div>
				)}
				<div className="text-center md:text-left space-y-2">
					<h1 className="text-4xl font-bold tracking-tight">{displayName}</h1>
					{memberSince && (
						<p className="text-gray-500">Membro desde {memberSince}</p>
					)}

					<div className="flex gap-4 pt-4">
						<div className="text-center">
							<p className="text-2xl font-bold text-brand-primary">
								{isListingsLoading ? "—" : (myListings?.length ?? 0)}
							</p>
							<p className="text-[10px] text-gray-500 uppercase font-bold">
								Anúncios
							</p>
						</div>
						<div className="text-center">
							<p className="text-2xl font-bold text-brand-primary">
								{isUserLoading || isListingsLoading
									? "—"
									: (favoriteListings?.length ?? 0)}
							</p>
							<p className="text-[10px] text-gray-500 uppercase font-bold">
								Favoritos
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<section className="space-y-6">
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<PlusCircle className="text-brand-primary" /> Meus Anúncios
					</h2>
					<div className="space-y-4">
						{myListings?.map((l) => (
							<ListingCard
								key={l.id}
								listing={l}
								game={games?.find((g) => g.id === l.gameId)}
							/>
						))}
						{myListings?.length === 0 && (
							<p className="text-gray-500 text-center py-10 glass-panel">
								Você ainda não criou nenhum anúncio.
							</p>
						)}
					</div>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<Heart className="text-red-500" /> Favoritos
					</h2>
					<div className="space-y-4">
						{favoriteListings?.map((l) => (
							<ListingCard
								key={l.id}
								listing={l}
								game={games?.find((g) => g.id === l.gameId)}
							/>
						))}
						{favoriteListings?.length === 0 && (
							<p className="text-gray-500 text-center py-10 glass-panel">
								Você ainda não favoritou nenhum anúncio.
							</p>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
