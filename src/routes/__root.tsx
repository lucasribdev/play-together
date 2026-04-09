import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Gamepad2 } from "lucide-react";
import BackToTop from "@/components/BackToTop";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { buildPageHead } from "@/lib/metadata";
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
			...buildPageHead().meta,
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: NotFound,
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
					<AuthProvider>
						<div className="min-h-screen flex flex-col">
							<Header />
							<main className="flex-grow">{children}</main>
							<BackToTop />
							<Toaster />
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
					</AuthProvider>
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

function NotFound() {
	return (
		<div className="max-w-3xl mx-auto px-4 py-24">
			<div className="glass-panel p-10 text-center space-y-4">
				<p className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase">
					404
				</p>
				<h1 className="text-3xl font-bold tracking-tight">
					Pagina nao encontrada
				</h1>
				<p className="text-gray-400">
					O link pode estar incorreto ou o conteudo nao existe mais.
				</p>
				<div>
					<Link to="/" className="btn-primary inline-flex">
						Voltar para a home
					</Link>
				</div>
			</div>
		</div>
	);
}
