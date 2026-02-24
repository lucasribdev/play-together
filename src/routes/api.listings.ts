import { createFileRoute } from "@tanstack/react-router";
import { mockListings } from "@/mocks/listings";

export const Route = createFileRoute("/api/listings")({
	server: {
		handlers: {
			GET: async () => {
				return Response.json(mockListings);
			},
		},
	},
});
