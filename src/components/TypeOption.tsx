import { cn } from "@/lib/utils";

export default function TypeOption({
	icon,
	title,
	desc,
	active,
	onClick,
}: {
	icon: React.ReactNode;
	title: string;
	desc: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"glass-panel p-6 flex flex-col items-center text-center gap-4 transition-all hover:border-brand-primary group",
				active && "border-brand-primary bg-brand-primary/5",
			)}
		>
			<div
				className={cn(
					"text-gray-500 group-hover:text-brand-primary transition-colors",
					active && "text-brand-primary",
				)}
			>
				{icon}
			</div>
			<div>
				<h3 className="font-bold text-lg">{title}</h3>
				<p className="text-xs text-gray-500">{desc}</p>
			</div>
		</button>
	);
}
