import { createFileRoute } from "@tanstack/react-router";
import { mapGame } from "@/utils/mappers";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/api/games")({
	server: {
		handlers: {
			GET: async () => {
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

				return Response.json(data.map(mapGame));
			},
		},
	},
});
