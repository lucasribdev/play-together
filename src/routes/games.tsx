import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games")({
	component: GamesLayout,
});

function GamesLayout() {
	return <Outlet />;
}
