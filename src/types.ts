export type ListingType = "LFG" | "SERVER" | "COMMUNITY";

export interface Game {
	id: string;
	name: string;
	coverUrl: string;
	genres: string[];
	releaseDate: string;
	website: string;
}

export interface GameRow {
	id: string;
	name: string;
	cover_url: string;
	genres: string[];
	release_date: string;
	website: string;
}

export interface User {
	id: string;
	name: string;
	avatar: string;
	favorites: string[]; // IDs of listings
	likedListings: string[]; // IDs of listings the user liked
}

export interface Listing {
	id: string;
	userId: string;
	gameId: string;
	type: ListingType;
	title: string;
	description?: string;
	ip?: string;
	tags?: string[];
	discordInvite?: string;
	views: number;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ListingRow {
	id: string;
	user_id: string;
	game_id: string;
	type: ListingType;
	title: string;
	description?: string;
	ip?: string;
	tags?: string[];
	discord_invite?: string;
	views: number;
	active: boolean;
	created_at: string;
	updated_at: string;
}
