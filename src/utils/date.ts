const relativeTimeUnits = [
	{ unit: "ano", seconds: 60 * 60 * 24 * 365 },
	{ unit: "mes", seconds: 60 * 60 * 24 * 30 },
	{ unit: "d", seconds: 60 * 60 * 24 },
	{ unit: "h", seconds: 60 * 60 },
	{ unit: "min", seconds: 60 },
] as const;

export function formatPostedAt(dateValue: string | Date) {
	const date = new Date(dateValue);
	const timestamp = date.getTime();

	if (Number.isNaN(timestamp)) {
		return "";
	}

	const diffInSeconds = Math.max(
		0,
		Math.floor((Date.now() - timestamp) / 1000),
	);

	if (diffInSeconds < 60) {
		return "postado agora";
	}

	const matchedUnit = relativeTimeUnits.find(
		({ seconds }) => diffInSeconds >= seconds,
	);

	if (!matchedUnit) {
		return "postado agora";
	}

	const value = Math.floor(diffInSeconds / matchedUnit.seconds);

	if (matchedUnit.unit === "mes") {
		return `postado há ${value} ${value === 1 ? "mês" : "meses"}`;
	}

	if (matchedUnit.unit === "ano") {
		return `postado há ${value} ${value === 1 ? "ano" : "anos"}`;
	}

	return `postado há ${value}${matchedUnit.unit}`;
}
