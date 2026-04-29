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
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (!id.includes("node_modules")) {
							return;
						}

						if (
							id.includes("/react/") ||
							id.includes("/react-dom/") ||
							id.includes("/scheduler/")
						) {
							return "vendor-react";
						}

						if (id.includes("/@tanstack/")) {
							return "vendor-tanstack";
						}

						if (id.includes("/@supabase/")) {
							return "vendor-supabase";
						}

						if (id.includes("/motion/")) {
							return "vendor-motion";
						}

						if (
							id.includes("/lucide-react/") ||
							id.includes("/radix-ui/") ||
							id.includes("/sonner/")
						) {
							return "vendor-ui";
						}
					},
				},
			},
		},
	};
});
