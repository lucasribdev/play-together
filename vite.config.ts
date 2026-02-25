import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => {
	const isBuild = command === "build";

	return {
		plugins: [
			devtools({
				eventBusConfig: {
					port: Number(process.env.TANSTACK_DEVTOOLS_PORT ?? 42100),
				},
			}),
			nitro({ rollupConfig: { external: [/^@sentry\//] } }),
			tsconfigPaths({ projects: ["./tsconfig.json"] }),
			tailwindcss(),
			...(isBuild ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
			tanstackStart(),
			viteReact({
				babel: {
					plugins: ["babel-plugin-react-compiler"],
				},
			}),
		],
	};
});
