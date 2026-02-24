import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Gamepad2 } from "lucide-react";
import Header from "@/components/Header";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "JogaJunto",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR">
			<head>
				<HeadContent />
			</head>
			<body>
				<TanStackQueryProvider>
					<div className="min-h-screen flex flex-col">
						<Header />
						<main className="flex-grow">{children}</main>
						<footer className="border-t border-border-dark py-12 mt-20">
							<div className="max-w-7xl mx-auto px-4 text-center space-y-4">
								<div className="flex items-center justify-center gap-2">
									<div className="w-6 h-6 bg-brand-primary rounded flex items-center justify-center">
										<Gamepad2 className="text-black w-4 h-4" />
									</div>
									<span className="text-lg font-bold tracking-tighter">
										JogaJunto
									</span>
								</div>
								<p className="text-gray-500 text-sm">
									&copy; 2026 JogaJunto. Feito para jogadores, por jogadores.
								</p>
							</div>
						</footer>
					</div>
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				</TanStackQueryProvider>
				<Scripts />
			</body>
		</html>
	);
}
