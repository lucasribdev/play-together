import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/api/listings/$id/views")({
	server: {
		handlers: {
			POST: async ({ params }) => {
				const { data, error } = await supabase.rpc("increment_listing_views", {
					p_listing_id: params.id,
				});

				if (error) {
					return new Response(
						JSON.stringify({ error: "Failed to increment listing views" }),
						{ status: 500 },
					);
				}

				return Response.json({ views: data ?? 0 });
			},
		},
	},
});
