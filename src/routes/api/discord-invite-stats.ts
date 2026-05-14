import { createFileRoute } from "@tanstack/react-router";
import type { DiscordInviteStats } from "@/types";
import { supabase } from "@/utils/supabase";

type DiscordInviteStatsRow = {
	invite_code: string;
	approximate_presence_count: number | null;
	approximate_member_count: number | null;
	fetched_at: string | null;
	next_fetch_after: string | null;
	invalid_at: string | null;
};

type DiscordInviteResponse = {
	approximate_member_count?: number;
	approximate_presence_count?: number;
};

const cacheTtlMs = 5 * 60 * 1000;
const invalidTtlMs = 60 * 60 * 1000;
const maxDiscordFetchConcurrency = 4;
const maxCodesPerRequest = 50;

export const Route = createFileRoute("/api/discord-invite-stats")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const inviteCodes = parseInviteCodes(url.searchParams.get("codes"));

				if (inviteCodes.length === 0) {
					return Response.json({});
				}

				const { data, error } = await supabase
					.from("discord_invite_stats")
					.select(
						"invite_code, approximate_presence_count, approximate_member_count, fetched_at, next_fetch_after, invalid_at",
					)
					.in("invite_code", inviteCodes);

				if (error) {
					const liveRows = new Map<string, DiscordInviteStatsRow>();
					const refreshedRows = await refreshDiscordInviteStatsBatch(
						inviteCodes.map((inviteCode) => ({ inviteCode })),
					);
					for (const row of refreshedRows) {
						liveRows.set(row.invite_code, row);
					}

					return Response.json(
						Object.fromEntries(
							inviteCodes.map((inviteCode) => [
								inviteCode,
								mapDiscordInviteStatsRow(inviteCode, liveRows.get(inviteCode)),
							]),
						),
						{
							headers: {
								"X-Discord-Stats-Cache": "unavailable",
								"X-Discord-Stats-Cache-Error": error.code ?? "unknown",
								"X-Discord-Stats-Refreshed": String(refreshedRows.length),
								"X-Discord-Stats-Total": String(inviteCodes.length),
							},
						},
					);
				}

				const now = new Date();
				const cachedRows = new Map(
					((data ?? []) as DiscordInviteStatsRow[]).map((row) => [
						row.invite_code,
						row,
					]),
				);

				const invitesToRefresh: Array<{
					cachedRow?: DiscordInviteStatsRow;
					inviteCode: string;
				}> = [];

				for (const inviteCode of inviteCodes) {
					const cachedRow = cachedRows.get(inviteCode);
					if (!shouldRefreshInviteStats(cachedRow, now)) continue;

					invitesToRefresh.push({
						inviteCode,
						cachedRow,
					});
				}

				const refreshedRows =
					await refreshDiscordInviteStatsBatch(invitesToRefresh);
				for (const updatedRow of refreshedRows) {
					cachedRows.set(updatedRow.invite_code, updatedRow);
				}

				return Response.json(
					Object.fromEntries(
						inviteCodes.map((inviteCode) => [
							inviteCode,
							mapDiscordInviteStatsRow(inviteCode, cachedRows.get(inviteCode)),
						]),
					),
					{
						headers: {
							"X-Discord-Stats-Cache": getCacheHeaderValue(
								inviteCodes.length,
								refreshedRows.length,
							),
							"X-Discord-Stats-Refreshed": String(refreshedRows.length),
							"X-Discord-Stats-Total": String(inviteCodes.length),
						},
					},
				);
			},
		},
	},
});

function getCacheHeaderValue(totalCount: number, refreshedCount: number) {
	if (refreshedCount === 0) return "hit";
	if (refreshedCount === totalCount) return "miss";
	return "partial";
}

async function refreshDiscordInviteStatsBatch(
	items: Array<{ cachedRow?: DiscordInviteStatsRow; inviteCode: string }>,
) {
	const rows: DiscordInviteStatsRow[] = [];

	for (
		let index = 0;
		index < items.length;
		index += maxDiscordFetchConcurrency
	) {
		const batch = items.slice(index, index + maxDiscordFetchConcurrency);
		const batchRows = await Promise.all(
			batch.map(({ cachedRow, inviteCode }) =>
				refreshDiscordInviteStats(inviteCode, cachedRow),
			),
		);
		rows.push(...batchRows);
	}

	return rows;
}

function parseInviteCodes(value: string | null) {
	if (!value) return [];

	return Array.from(
		new Set(
			value
				.split(",")
				.map((code) => code.trim())
				.filter((code) => /^[a-zA-Z0-9_-]{2,100}$/.test(code)),
		),
	).slice(0, maxCodesPerRequest);
}

function addMs(value: Date, ms: number) {
	return new Date(value.getTime() + ms).toISOString();
}

function shouldRefreshInviteStats(
	row: DiscordInviteStatsRow | undefined,
	now: Date,
) {
	if (!row) return true;

	if (row.next_fetch_after && new Date(row.next_fetch_after) > now) {
		return false;
	}

	if (!row.fetched_at) return true;

	return now.getTime() - new Date(row.fetched_at).getTime() > cacheTtlMs;
}

async function refreshDiscordInviteStats(
	inviteCode: string,
	cachedRow?: DiscordInviteStatsRow,
): Promise<DiscordInviteStatsRow> {
	const now = new Date();

	try {
		const response = await fetch(
			`https://discord.com/api/v10/invites/${encodeURIComponent(
				inviteCode,
			)}?with_counts=true`,
			{
				headers: {
					Accept: "application/json",
				},
			},
		);

		if (response.ok) {
			const payload = (await response.json()) as DiscordInviteResponse;
			const updatedRow = {
				invite_code: inviteCode,
				approximate_presence_count:
					typeof payload.approximate_presence_count === "number"
						? payload.approximate_presence_count
						: null,
				approximate_member_count:
					typeof payload.approximate_member_count === "number"
						? payload.approximate_member_count
						: null,
				fetched_at: now.toISOString(),
				next_fetch_after: addMs(now, cacheTtlMs),
				invalid_at: null,
			};

			await upsertDiscordInviteStats(inviteCode, "success", updatedRow);
			return updatedRow;
		}

		if (response.status === 404) {
			const updatedRow = {
				invite_code: inviteCode,
				approximate_presence_count: null,
				approximate_member_count: null,
				fetched_at: now.toISOString(),
				next_fetch_after: addMs(now, invalidTtlMs),
				invalid_at: now.toISOString(),
			};

			await upsertDiscordInviteStats(inviteCode, "invalid", updatedRow);
			return updatedRow;
		}

		const retryAfter = await getRetryAfterMs(response);
		const nextFetchAfter = addMs(now, retryAfter ?? cacheTtlMs);
		await upsertDiscordInviteStats(inviteCode, "error", {
			invite_code: inviteCode,
			approximate_presence_count: cachedRow?.approximate_presence_count ?? null,
			approximate_member_count: cachedRow?.approximate_member_count ?? null,
			fetched_at: cachedRow?.fetched_at ?? null,
			next_fetch_after: nextFetchAfter,
			invalid_at: cachedRow?.invalid_at ?? null,
		});

		return {
			invite_code: inviteCode,
			approximate_presence_count: cachedRow?.approximate_presence_count ?? null,
			approximate_member_count: cachedRow?.approximate_member_count ?? null,
			fetched_at: cachedRow?.fetched_at ?? null,
			next_fetch_after: nextFetchAfter,
			invalid_at: cachedRow?.invalid_at ?? null,
		};
	} catch {
		const nextFetchAfter = addMs(now, cacheTtlMs);
		await upsertDiscordInviteStats(inviteCode, "error", {
			invite_code: inviteCode,
			approximate_presence_count: cachedRow?.approximate_presence_count ?? null,
			approximate_member_count: cachedRow?.approximate_member_count ?? null,
			fetched_at: cachedRow?.fetched_at ?? null,
			next_fetch_after: nextFetchAfter,
			invalid_at: cachedRow?.invalid_at ?? null,
		});

		return {
			invite_code: inviteCode,
			approximate_presence_count: cachedRow?.approximate_presence_count ?? null,
			approximate_member_count: cachedRow?.approximate_member_count ?? null,
			fetched_at: cachedRow?.fetched_at ?? null,
			next_fetch_after: nextFetchAfter,
			invalid_at: cachedRow?.invalid_at ?? null,
		};
	}
}

async function getRetryAfterMs(response: Response) {
	const retryAfterHeader = response.headers.get("retry-after");
	if (retryAfterHeader) {
		const retryAfterSeconds = Number(retryAfterHeader);
		if (Number.isFinite(retryAfterSeconds)) {
			return retryAfterSeconds * 1000;
		}
	}

	if (response.status !== 429) return null;

	try {
		const payload = (await response.json()) as { retry_after?: number };
		return typeof payload.retry_after === "number"
			? payload.retry_after * 1000
			: null;
	} catch {
		return null;
	}
}

async function upsertDiscordInviteStats(
	inviteCode: string,
	status: "success" | "invalid" | "error",
	row: DiscordInviteStatsRow,
) {
	const { error } = await supabase.rpc("upsert_discord_invite_stats", {
		p_invite_code: inviteCode,
		p_status: status,
		p_approximate_presence_count: row.approximate_presence_count,
		p_approximate_member_count: row.approximate_member_count,
		p_fetched_at: row.fetched_at,
		p_next_fetch_after: row.next_fetch_after,
		p_invalid_at: row.invalid_at,
	});

	if (error) {
		console.warn("Failed to persist Discord invite stats", {
			code: error.code,
			inviteCode,
			message: error.message,
		});
	}
}

function mapDiscordInviteStatsRow(
	inviteCode: string,
	row?: DiscordInviteStatsRow,
): DiscordInviteStats {
	return {
		inviteCode,
		approximatePresenceCount: row?.approximate_presence_count ?? null,
		approximateMemberCount: row?.approximate_member_count ?? null,
		fetchedAt: row?.fetched_at ?? null,
		invalidAt: row?.invalid_at ?? null,
	};
}
