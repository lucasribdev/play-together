import { createFileRoute } from "@tanstack/react-router";
import type { Listing } from "@/types";
import { createSupabaseUserClient, supabase } from "@/utils/supabase";

type ListingRow = {
	id: string;
	user_id: string;
	game_id: string;
	listing_type: "community" | "lfg" | "server";
	title: string;
	description: string | null;
	tags: string[] | null;
	ip: string | null;
	discord_invite: string | null;
	views: number | null;
	created_at: string;
};

const LISTING_TYPE_MAP = {
	community: "COMMUNITY",
	lfg: "LFG",
	server: "SERVER",
} as const;

const APP_TO_DB_LISTING_TYPE_MAP = {
	COMMUNITY: "community",
	LFG: "lfg",
	SERVER: "server",
} as const;

type CreateListingPayload = {
	gameId: string;
	type: "COMMUNITY" | "LFG" | "SERVER";
	title: string;
	description: string;
	discordInvite: string;
	ip?: string;
	tags?: string[];
};

function normalizeString(value: unknown) {
	return typeof value === "string" ? value.trim() : "";
}

function normalizeTags(tags: unknown) {
	if (!Array.isArray(tags)) {
		return [];
	}

	return tags
		.filter((tag): tag is string => typeof tag === "string")
		.map((tag) => tag.trim())
		.filter(Boolean);
}

function validateCreateListingPayload(body: Partial<CreateListingPayload>) {
	const gameId = normalizeString(body.gameId);
	const type = normalizeString(body.type).toUpperCase();
	const title = normalizeString(body.title);
	const description = normalizeString(body.description);
	const discordInvite = normalizeString(body.discordInvite);
	const ip = normalizeString(body.ip);
	const tags = normalizeTags(body.tags);

	if (!gameId || !type || !title || !description || !discordInvite) {
		return { error: "Missing required listing fields" } as const;
	}

	if (!(type in APP_TO_DB_LISTING_TYPE_MAP)) {
		return { error: "Invalid listing type" } as const;
	}

	if (type === "SERVER" && !ip) {
		return { error: "IP is required for server listings" } as const;
	}

	if (type !== "SERVER" && ip) {
		return { error: "IP is only allowed for server listings" } as const;
	}

	return {
		data: {
			gameId,
			type: type as keyof typeof APP_TO_DB_LISTING_TYPE_MAP,
			title,
			description,
			discordInvite,
			ip: type === "SERVER" ? ip : null,
			tags,
		},
	} as const;
}

function mapListing(row: ListingRow): Listing {
	const common = {
		id: row.id,
		gameId: row.game_id,
		userId: row.user_id,
		title: row.title,
		description: row.description ?? "",
		language: "Português",
		createdAt: row.created_at,
		tags: row.tags ?? [],
		views: row.views ?? 0,
		likes: 0,
	};

	const type = LISTING_TYPE_MAP[row.listing_type];

	if (type === "LFG") {
		return {
			...common,
			type,
			availability: "Não informado",
			style: "Casual",
			objective: "Não informado",
			discord: row.discord_invite ?? "",
		};
	}

	if (type === "SERVER") {
		return {
			...common,
			type,
			region: "Não informado",
			serverType: "Vanilla",
			discord: row.discord_invite ?? "",
			rules: "Não informado",
			ip: row.ip ?? undefined,
		};
	}

	return {
		...common,
		type,
		focus: "Geral",
		discord: row.discord_invite ?? "",
		requirements: "Não informado",
	};
}

export const Route = createFileRoute("/api/listings")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const url = new URL(request.url);
					const gameId = url.searchParams.get("gameId")?.trim();
					const type = url.searchParams.get("type")?.trim().toUpperCase();
					const tags = url.searchParams
						.getAll("tags")
						.flatMap((value) => value.split(","))
						.map((value) => value.trim())
						.filter(Boolean);

					let query = supabase
						.from("listings")
						.select(
							"id, user_id, game_id, listing_type, title, description, tags, ip, discord_invite, views, created_at",
						)
						.eq("active", true)
						.order("created_at", { ascending: false });

					if (gameId) {
						query = query.eq("game_id", gameId);
					}

					if (type) {
						const listingType =
							APP_TO_DB_LISTING_TYPE_MAP[
								type as keyof typeof APP_TO_DB_LISTING_TYPE_MAP
							];

						if (!listingType) {
							return Response.json(
								{ error: "Invalid listing type filter" },
								{ status: 400 },
							);
						}

						query = query.eq("listing_type", listingType);
					}

					if (tags.length > 0) {
						query = query.overlaps("tags", tags);
					}

					const { data, error } = await query;

					if (error) {
						return Response.json(
							{
								error: "Failed to fetch listings",
							},
							{ status: 500 },
						);
					}

					const payload = (data ?? []).map((row) =>
						mapListing(row as ListingRow),
					);
					return Response.json(payload);
				} catch (error) {
					const message =
						error instanceof Error ? error.message : "Unexpected error";

					return Response.json(
						{ error: "Failed to fetch listings", message },
						{ status: 500 },
					);
				}
			},
			POST: async ({ request }) => {
				const authHeader = request.headers.get("authorization");
				if (!authHeader?.startsWith("Bearer ")) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				try {
					const body = (await request.json()) as Partial<CreateListingPayload>;
					const validation = validateCreateListingPayload(body);

					if ("error" in validation) {
						return Response.json({ error: validation.error }, { status: 400 });
					}

					const supabaseWithUser = createSupabaseUserClient(authHeader);

					const { data: authData, error: authError } =
						await supabaseWithUser.auth.getUser();

					if (authError || !authData.user) {
						return Response.json(
							{
								error: "Unauthorized",
								message: authError?.message ?? "Invalid session",
							},
							{ status: 401 },
						);
					}

					const listingType = APP_TO_DB_LISTING_TYPE_MAP[validation.data.type];

					const { data, error } = await supabaseWithUser
						.from("listings")
						.insert({
							user_id: authData.user.id,
							game_id: validation.data.gameId,
							listing_type: listingType,
							title: validation.data.title,
							description: validation.data.description,
							discord_invite: validation.data.discordInvite,
							ip: validation.data.ip,
							tags: validation.data.tags,
							active: true,
						})
						.select(
							"id, user_id, game_id, listing_type, title, description, tags, ip, discord_invite, views, created_at",
						)
						.single();

					if (error) {
						const isPermissionError =
							error.code === "42501" ||
							error.message.toLowerCase().includes("rls");
						const isConstraintError =
							error.code?.startsWith("23") ||
							error.message.toLowerCase().includes("foreign key");

						return Response.json(
							{
								error: "Failed to create listing",
							},
							{
								status: isPermissionError ? 403 : isConstraintError ? 400 : 500,
							},
						);
					}

					return Response.json(mapListing(data as ListingRow), { status: 201 });
				} catch (error) {
					const message =
						error instanceof Error ? error.message : "Unexpected error";

					return Response.json(
						{ error: "Failed to create listing", message },
						{ status: 500 },
					);
				}
			},
		},
	},
});
