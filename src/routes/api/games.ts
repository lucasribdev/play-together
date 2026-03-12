import { createFileRoute } from "@tanstack/react-router";
import type { Game } from "@/types";
import { supabase } from "@/utils/supabase";

type GameRow = {
	id: string;
	name: string;
	cover_url: string | null;
	genres: string[] | null;
	release_date: string | null;
	website: string | null;
};

export const Route = createFileRoute("/api/games")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const { data, error } = await supabase
						.from("games")
						.select("id, name, cover_url, genres, release_date, website")
						.order("name");

					if (error) {
						return Response.json(
							{
								error: "Failed to fetch games",
							},
							{ status: 500 },
						);
					}

					const payload: Game[] = (data ?? []).map((game: GameRow) => ({
						id: game.id,
						name: game.name,
						image: game.cover_url ?? "",
						tags: game.genres ?? [],
						released: game.release_date ?? null,
						website: game.website ?? "",
					}));

					return Response.json(payload);
				} catch (error) {
					const message =
						error instanceof Error ? error.message : "Unexpected error";

					return Response.json(
						{ error: "Failed to fetch games", message },
						{ status: 500 },
					);
				}
			},
		},
	},
});
