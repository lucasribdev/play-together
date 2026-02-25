import { createFileRoute } from "@tanstack/react-router";
import { mockGames } from "@/mocks/games";

export const Route = createFileRoute("/api/games")({
	server: {
		handlers: {
			GET: async () => {
				return Response.json(mockGames);
			},
		},
	},
});
