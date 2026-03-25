import { createFileRoute } from "@tanstack/react-router";
import { mapGame } from "@/utils/mappers";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/api/games")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const { searchParams } = new URL(request.url);
				const limitParam = searchParams.get("limit");
				const limit = limitParam ? Number(limitParam) : undefined;

				let query = supabase
					.from("games")
					.select("id, name, cover_url, genres, release_date, website")
					.order("name");

				if (limit && !Number.isNaN(limit)) {
					query = query.limit(limit);
				}

				const { data, error } = await query;

				if (error) {
					return Response.json(
						{ error: "Failed to fetch games" },
						{ status: 500 },
					);
				}

				return Response.json(data.map(mapGame));
			},
		},
	},
});
