import type { GameRow, ListingRow } from "@/types";

export function mapListing(row: ListingRow) {
	return {
		...row,
		gameId: row.game_id,
		userId: row.user_id,
		discordInvite: row.discord_invite,
		createdAt: row.created_at,
	};
}

export function mapGame(row: GameRow) {
	return {
		...row,
		coverUrl: row.cover_url,
		releaseDate: row.release_date,
	};
}
