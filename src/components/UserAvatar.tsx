import { useState } from "react";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
	avatarUrl?: string | null;
	className?: string;
	fallbackClassName?: string;
	name?: string | null;
};

export default function UserAvatar({
	avatarUrl,
	className,
	fallbackClassName,
	name,
}: UserAvatarProps) {
	const [hasImageError, setHasImageError] = useState(false);
	const fallbackInitial = name?.trim().slice(0, 1).toUpperCase() || "?";

	if (avatarUrl && !hasImageError) {
		return (
			<img
				src={avatarUrl}
				className={className}
				alt={name ? `${name} avatar` : "Avatar"}
				referrerPolicy="no-referrer"
				onError={() => setHasImageError(true)}
			/>
		);
	}

	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center bg-white/5 font-bold text-brand-primary",
				className,
				fallbackClassName,
			)}
			aria-label={name ? `${name} avatar` : "Avatar"}
			role="img"
		>
			{fallbackInitial}
		</div>
	);
}
