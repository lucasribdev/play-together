export type ListingType = "LFG" | "SERVER" | "COMMUNITY";

export interface Game {
	id: string;
	name: string;
	image: string;
	description: string;
	tags: string[];
}

export interface User {
	id: string;
	name: string;
	avatar: string;
	favorites: string[]; // IDs of listings
	likedListings: string[]; // IDs of listings the user liked
}

export interface BaseListing {
	id: string;
	type: ListingType;
	gameId: string;
	userId: string;
	title: string;
	description: string;
	language: string;
	createdAt: string;
	tags: string[];
	views: number;
	likes: number;
}

export interface LFGListing extends BaseListing {
	type: "LFG";
	availability: string;
	style: "Casual" | "Hardcore";
	objective: string;
	discord: string;
}

export interface ServerListing extends BaseListing {
	type: "SERVER";
	region: string;
	serverType: "PVP" | "PVE" | "RP" | "Modded" | "Vanilla";
	discord: string;
	ip?: string;
	rules: string;
}

export interface CommunityListing extends BaseListing {
	type: "COMMUNITY";
	focus: "Guild" | "Clan" | "Geral";
	discord: string;
	requirements?: string;
}

export type Listing = LFGListing | ServerListing | CommunityListing;
