import type { GameRow, ListingRow, ProfileRow } from "@/types";

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

export function mapProfile(row: ProfileRow) {
	return {
		...row,
		fullName: row.full_name,
		avatarUrl: row.avatar_url,
		createdAt: row.created_at,
	};
}
