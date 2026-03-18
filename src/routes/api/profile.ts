import { createFileRoute } from "@tanstack/react-router";
import { mapProfile } from "@/utils/mappers";
import { createSupabaseUserClient } from "@/utils/supabase";

async function getAuthenticatedProfile(request: Request) {
	const authHeader = request.headers.get("authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return {
			error: Response.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}

	const supabase = createSupabaseUserClient(authHeader);
	const { data: authData, error: authError } = await supabase.auth.getUser();

	if (authError || !authData.user) {
		return {
			error: Response.json(
				{
					error: "Unauthorized",
					message: authError?.message ?? "Invalid session",
				},
				{ status: 401 },
			),
		};
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", authData.user.id)
		.single();

	if (profileError) {
		return {
			error: Response.json(
				{
					error: "Failed to fetch user profile",
				},
				{ status: 500 },
			),
		};
	}

	const { count: likesCount, error: likesError } = await supabase
		.from("listing_likes")
		.select("*", { count: "exact", head: true })
		.eq("user_id", authData.user.id);

	if (likesError) {
		return {
			error: Response.json(
				{
					error: "Failed to fetch profile likes",
					message: likesError.message,
				},
				{ status: 500 },
			),
		};
	}

	return {
		data: {
			...mapProfile(profile),
			likesCount: likesCount ?? 0,
		},
	};
}

export const Route = createFileRoute("/api/profile")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const result = await getAuthenticatedProfile(request);
				if (result.error) {
					return result.error;
				}

				return Response.json(result.data);
			},
			POST: async ({ request }) => {
				const result = await getAuthenticatedProfile(request);
				if (result.error) {
					return result.error;
				}

				return Response.json(result.data);
			},
		},
	},
});
