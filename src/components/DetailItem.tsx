export default function DetailItem({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="flex gap-3">
			<div className="text-brand-primary mt-1">{icon}</div>
			<div>
				<p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
					{label}
				</p>
				<p className="text-sm text-gray-200">{value}</p>
			</div>
		</div>
	);
}
