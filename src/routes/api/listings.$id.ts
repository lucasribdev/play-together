import { createFileRoute } from "@tanstack/react-router";
import { mapListing } from "@/utils/mappers";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/api/listings/$id")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const { data, error } = await supabase
					.from("listings")
					.select("*, game:games(*)")
					.eq("id", params.id)
					.single();

				if (error) {
					return Response.json(
						{
							error: "Failed to fetch listing",
						},
						{ status: 500 },
					);
				}

				return Response.json(mapListing(data));
			},
		},
	},
});
