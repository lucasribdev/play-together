import type { Game, Listing, User } from "@/types";
import { supabase } from "@/utils/supabase";

export async function getGames(signal?: AbortSignal): Promise<Game[]> {
	const response = await fetch("/api/games", { signal });

	if (!response.ok) {
		throw new Error("Failed to fetch games");
	}

	return response.json() as Promise<Game[]>;
}

export async function getListings(signal?: AbortSignal): Promise<Listing[]> {
	const response = await fetch("/api/listings", { signal });

	if (!response.ok) {
		throw new Error("Failed to fetch listings");
	}

	return response.json() as Promise<Listing[]>;
}

export async function getUser(signal?: AbortSignal): Promise<User> {
	const { data } = await supabase.auth.getSession();
	const accessToken = data.session?.access_token;

	const response = await fetch("/api/user", {
		signal,
		headers: accessToken
			? {
					Authorization: `Bearer ${accessToken}`,
				}
			: undefined,
	});

	if (!response.ok) {
		throw new Error("Failed to fetch user");
	}

	return response.json() as Promise<User>;
}

export async function incrementListingViews(
	id: string,
	signal?: AbortSignal,
): Promise<number> {
	const response = await fetch(`/api/listings/${id}/views`, {
		method: "POST",
		signal,
	});

	if (!response.ok) {
		throw new Error("Failed to increment listing views");
	}

	const payload = (await response.json()) as { views: number };
	return payload.views;
}

type CreateListingInput = {
	gameId: string;
	type: "COMMUNITY" | "LFG" | "SERVER";
	title: string;
	description: string;
	discordInvite: string;
	ip?: string;
	tags: string[];
};

export async function createListing(
	input: CreateListingInput,
	accessToken: string,
	signal?: AbortSignal,
): Promise<Listing> {
	const response = await fetch("/api/listings", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(input),
		signal,
	});

	if (!response.ok) {
		throw new Error("Failed to create listing");
	}

	return response.json() as Promise<Listing>;
}
