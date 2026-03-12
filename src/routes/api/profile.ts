import { createFileRoute } from "@tanstack/react-router";
import { mapProfile } from "@/utils/mappers";
import { createSupabaseUserClient } from "@/utils/supabase";

export const Route = createFileRoute("/api/profile")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const authHeader = request.headers.get("authorization");
				if (!authHeader?.startsWith("Bearer ")) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

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
					.select("*")
					.eq("id", authData.user.id)
					.single();

				if (profileError) {
					return Response.json(
						{
							error: "Failed to fetch user profile",
						},
						{ status: 500 },
					);
				}

				return Response.json(mapProfile(profile));
			},
		},
	},
});
