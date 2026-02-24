import type { Game, Listing, User } from "@/types";

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
	const response = await fetch("/api/user", { signal });

	if (!response.ok) {
		throw new Error("Failed to fetch user");
	}

	return response.json() as Promise<User>;
}
