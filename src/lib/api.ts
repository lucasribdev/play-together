import type { CreateListingInput, Game, Listing, Profile } from "@/types";
import { supabase } from "@/utils/supabase";

export async function getGames(signal?: AbortSignal): Promise<Game[]> {
	const response = await fetch("/api/games", { signal });

	if (!response.ok) {
		throw new Error("Failed to fetch games");
	}

	return response.json() as Promise<Game[]>;
}

export async function getGameById(
	id: string,
	signal?: AbortSignal,
): Promise<Game> {
	const response = await fetch(`/api/games/${id}`, { signal });

	if (!response.ok) {
		throw new Error("Failed to fetch game");
	}

	return response.json() as Promise<Game>;
}

export async function getListings(signal?: AbortSignal): Promise<Listing[]> {
	const response = await fetch("/api/listings", { signal });

	if (!response.ok) {
		throw new Error("Failed to fetch listings");
	}

	return response.json() as Promise<Listing[]>;
}

export async function getListingsByGameId(
	id: string,
	signal?: AbortSignal,
): Promise<Listing[]> {
	const response = await fetch(
		`/api/listings?gameId=${encodeURIComponent(id)}`,
		{ signal },
	);

	if (!response.ok) {
		throw new Error("Failed to fetch listings");
	}

	return response.json() as Promise<Listing[]>;
}

export async function getListingsByUserId(
	id: string,
	signal?: AbortSignal,
): Promise<Listing[]> {
	const response = await fetch(
		`/api/listings?userId=${encodeURIComponent(id)}`,
		{ signal },
	);

	if (!response.ok) {
		throw new Error("Failed to fetch listings");
	}

	return response.json() as Promise<Listing[]>;
}

export async function getListingById(
	id: string,
	signal?: AbortSignal,
): Promise<Listing> {
	const response = await fetch(`/api/listings/${id}`, { signal });

	if (!response.ok) {
		throw new Error("Failed to fetch listing");
	}

	return response.json() as Promise<Listing>;
}

export async function getProfile(signal?: AbortSignal): Promise<Profile> {
	const { data } = await supabase.auth.getSession();
	const accessToken = data.session?.access_token;

	const response = await fetch("/api/profile", {
		signal,
		headers: accessToken
			? {
					Authorization: `Bearer ${accessToken}`,
				}
			: undefined,
	});

	if (!response.ok) {
		throw new Error("Failed to fetch profile");
	}

	return response.json() as Promise<Profile>;
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
