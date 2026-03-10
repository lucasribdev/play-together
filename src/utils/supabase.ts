import { createClient } from "@supabase/supabase-js";

function createSupabaseClient(authHeader?: string) {
	return createClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_KEY,
		authHeader
			? {
					global: {
						headers: {
							Authorization: authHeader,
						},
					},
				}
			: undefined,
	);
}

export const supabase = createSupabaseClient();

export function createSupabaseUserClient(authHeader: string) {
	return createSupabaseClient(authHeader);
}
