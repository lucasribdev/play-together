const DISCORD_HOSTS = new Set([
	"discord.gg",
	"www.discord.gg",
	"discord.com",
	"www.discord.com",
	"ptb.discord.com",
	"canary.discord.com",
	"discordapp.com",
	"www.discordapp.com",
]);

function toUrl(value: string) {
	const trimmedValue = value.trim();
	if (!trimmedValue) return null;

	const normalizedValue = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmedValue)
		? trimmedValue
		: `https://${trimmedValue}`;

	try {
		return new URL(normalizedValue);
	} catch {
		return null;
	}
}

export function extractDiscordInviteCode(value?: string | null) {
	if (!value) return null;

	const url = toUrl(value);
	if (!url || !DISCORD_HOSTS.has(url.hostname.toLowerCase())) {
		return null;
	}

	const pathParts = url.pathname.split("/").filter(Boolean);
	const code =
		url.hostname.toLowerCase().endsWith("discord.gg") ||
		url.hostname.toLowerCase().endsWith("discordapp.com")
			? pathParts[0]
			: pathParts[0] === "invite"
				? pathParts[1]
				: null;

	if (!code || !/^[a-zA-Z0-9_-]{2,100}$/.test(code)) {
		return null;
	}

	return code;
}

export function isValidDiscordInvite(value: string) {
	return Boolean(extractDiscordInviteCode(value));
}

export function normalizeDiscordInvite(value: string) {
	const url = toUrl(value);
	const code = extractDiscordInviteCode(value);

	if (!url || !code) {
		return null;
	}

	return `https://discord.gg/${code}`;
}
