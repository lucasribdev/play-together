import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, PlusCircle } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { getGames, getListings, getUser } from "@/lib/api";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
	const {
		data: user,
		isLoading: isUserLoading,
		isError: isUserError,
	} = useQuery({
		queryKey: ["user"],
		queryFn: ({ signal }) => getUser(signal),
	});

	const {
		data: games,
		isLoading: isGamesLoading,
		isError: isGamesError,
	} = useQuery({
		queryKey: ["games"],
		queryFn: ({ signal }) => getGames(signal),
	});

	const {
		data: listings,
		isLoading: isListingsLoading,
		isError: isListingsError,
	} = useQuery({
		queryKey: ["listings"],
		queryFn: ({ signal }) => getListings(signal),
	});

	const favoriteIds = user?.favorites ?? [];
	const myListings = listings?.filter((l) => l.userId === user?.id);
	const favoriteListings = listings?.filter((l) => favoriteIds.includes(l.id));

	return (
		<div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
			<div className="flex flex-col md:flex-row items-center gap-8 glass-panel p-8">
				<img
					src={user?.avatar}
					alt={user?.name}
					className="w-32 h-32 rounded-3xl border-4 border-brand-primary/20"
					referrerPolicy="no-referrer"
				/>
				<div className="text-center md:text-left space-y-2">
					<h1 className="text-4xl font-bold tracking-tight">{user?.name}</h1>
					<p className="text-gray-500">Membro desde Fevereiro de 2024</p>
					<div className="flex gap-4 pt-4">
						<div className="text-center">
							<p className="text-2xl font-bold text-brand-primary">
								{myListings?.length}
							</p>
							<p className="text-[10px] text-gray-500 uppercase font-bold">
								Anúncios
							</p>
						</div>
						<div className="text-center">
							<p className="text-2xl font-bold text-brand-primary">
								{favoriteListings?.length}
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
