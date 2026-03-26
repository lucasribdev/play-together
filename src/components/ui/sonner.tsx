import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from "lucide-react";
import type * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "@/lib/utils";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme="dark"
			className="toaster group"
			position="bottom-right"
			expand
			closeButton
			offset={20}
			mobileOffset={16}
			visibleToasts={4}
			icons={{
				success: <CircleCheckIcon className="size-4 text-emerald-300" />,
				info: <InfoIcon className="size-4 text-sky-300" />,
				warning: <TriangleAlertIcon className="size-4 text-amber-300" />,
				error: <OctagonXIcon className="size-4 text-rose-300" />,
				loading: (
					<Loader2Icon className="size-4 animate-spin text-brand-primary" />
				),
			}}
			toastOptions={{
				unstyled: true,
				classNames: {
					toast: cn(
						"group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl",
						"border border-white/10 bg-card-dark/90 p-4 pr-12 text-gray-100 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl",
						"before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent",
					),
					content: "flex-1 space-y-1",
					title: "text-sm font-semibold tracking-tight text-white",
					description: "text-sm leading-5 text-gray-400",
					icon: "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner shadow-black/20",
					closeButton:
						"absolute right-3 top-3 flex size-7 items-center justify-center rounded-full border border-white/10 bg-black/20 text-gray-400 transition-colors hover:bg-white/10 hover:text-white",
					actionButton:
						"inline-flex h-8 items-center justify-center rounded-lg bg-brand-primary px-3 text-xs font-bold text-black transition-all hover:brightness-110",
					cancelButton:
						"inline-flex h-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-gray-200 transition-colors hover:bg-white/10",
					success:
						"border-emerald-400/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_40%),rgba(21,21,24,0.92)]",
					info: "border-sky-400/20 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_40%),rgba(21,21,24,0.92)]",
					warning:
						"border-amber-400/20 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_40%),rgba(21,21,24,0.92)]",
					error:
						"border-rose-400/20 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.18),transparent_40%),rgba(21,21,24,0.92)]",
					loading:
						"border-brand-primary/20 bg-[radial-gradient(circle_at_top_left,rgba(0,255,136,0.14),transparent_40%),rgba(21,21,24,0.92)]",
					default:
						"bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.12),transparent_40%),rgba(21,21,24,0.92)]",
				},
			}}
			style={
				{
					"--normal-bg": "rgba(21, 21, 24, 0.92)",
					"--normal-text": "rgb(243 244 246)",
					"--normal-border": "rgba(255, 255, 255, 0.1)",
					"--border-radius": "1rem",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
