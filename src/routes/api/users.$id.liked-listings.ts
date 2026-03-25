import { createFileRoute } from "@tanstack/react-router";
import type { ListingByIdRpcRow, ListingLikesRow } from "@/types";
import { mapListingByIdRpc } from "@/utils/mappers";
import { createSupabaseUserClient, supabase } from "@/utils/supabase";

export const Route = createFileRoute("/api/users/$id/liked-listings")({
	server: {
		handlers: {
			GET: async ({ params, request }) => {
				const url = new URL(request.url);
				const limit = Number(url.searchParams.get("limit") ?? 12);
				const offset = Number(url.searchParams.get("offset") ?? 0);

				const authHeader = request.headers.get("authorization");
				const supabaseClient = authHeader
					? createSupabaseUserClient(authHeader)
					: supabase;

				const { data: likes, error: likesError } = await supabaseClient
					.from("listing_likes")
					.select("listing_id, created_at")
					.eq("user_id", params.id)
					.order("created_at", { ascending: false })
					.range(offset, offset + limit - 1);

				if (likesError) {
					return Response.json(
						{ error: "Failed to fetch liked listings" },
						{ status: 500 },
					);
				}

				const likedListings = (likes ?? []) as Pick<
					ListingLikesRow,
					"listing_id" | "created_at"
				>[];

				if (likedListings.length === 0) {
					return Response.json([]);
				}

				const listingResults = await Promise.all(
					likedListings.map(async ({ listing_id }) => {
						const { data, error } = await supabaseClient
							.rpc("get_listing_by_id", {
								p_listing_id: listing_id,
							})
							.maybeSingle();

						if (error || !data) {
							throw new Error(error?.message ?? "Listing not found");
						}

						return mapListingByIdRpc(data as ListingByIdRpcRow);
					}),
				);

				return Response.json(listingResults);
			},
		},
	},
});
