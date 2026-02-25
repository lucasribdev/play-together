import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import GameCard from "@/components/GameCard";
import { getGames } from "@/lib/api";

export const Route = createFileRoute("/games")({ component: Games });

function Games() {
	const {
		data: games,
		isLoading: isGamesLoading,
		isError: isGamesError,
	} = useQuery({
		queryKey: ["games"],
		queryFn: ({ signal }) => getGames(signal),
	});

	return (
		<div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
			<h1 className="text-4xl font-bold tracking-tight">Explorar Jogos</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{games?.map((game) => (
					<GameCard key={game.id} game={game} />
				))}
			</div>
		</div>
	);
}
