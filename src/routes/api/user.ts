import { createFileRoute } from "@tanstack/react-router";
import type { User } from "@/types";
import { createSupabaseUserClient } from "@/utils/supabase";

type ProfileRow = {
	id: string;
	username: string | null;
	full_name: string | null;
	avatar_url: string | null;
};

export const Route = createFileRoute("/api/user")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const authHeader = request.headers.get("authorization");
				if (!authHeader?.startsWith("Bearer ")) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				try {
					const supabase = createSupabaseUserClient(authHeader);

					const { data: authData, error: authError } =
						await supabase.auth.getUser();

					if (authError || !authData.user) {
						return Response.json(
							{
								error: "Unauthorized",
								message: authError?.message ?? "Invalid session",
							},
							{ status: 401 },
						);
					}

					const { data: profile, error: profileError } = await supabase
						.from("profiles")
						.select("id, username, full_name, avatar_url")
						.eq("id", authData.user.id)
						.maybeSingle();

					if (profileError) {
						return Response.json(
							{
								error: "Failed to fetch user profile",
							},
							{ status: 500 },
						);
					}

					const profileRow = profile as ProfileRow | null;
					const meta = authData.user.user_metadata ?? {};

					const payload: User = {
						id: authData.user.id,
						name:
							profileRow?.full_name ||
							profileRow?.username ||
							meta.full_name ||
							meta.name ||
							authData.user.email ||
							"Jogador",
						avatar:
							profileRow?.avatar_url || meta.avatar_url || meta.picture || "",
						favorites: [],
						likedListings: [],
					};

					return Response.json(payload);
				} catch (error) {
					const message =
						error instanceof Error ? error.message : "Unexpected error";

					return Response.json(
						{ error: "Failed to fetch user", message },
						{ status: 500 },
					);
				}
			},
		},
	},
});
