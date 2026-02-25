import { createFileRoute } from "@tanstack/react-router";
import { mockUser } from "@/mocks/user";

export const Route = createFileRoute("/api/user")({
	server: {
		handlers: {
			GET: async () => {
				return Response.json(mockUser);
			},
		},
	},
});
