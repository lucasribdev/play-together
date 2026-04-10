import type { ListingType } from "@/types";

export const getTypeText = (type: ListingType) => {
	switch (type) {
		case "LFG":
			return "Procurando Grupo";
		case "SERVER":
			return "Servidor";
		case "COMMUNITY":
			return "Comunidade";
	}
};

export const getTypeStyles = (type: ListingType) => {
	switch (type) {
		case "LFG":
			return "bg-purple-500/10 text-purple-400 border-purple-500/20";
		case "SERVER":
			return "bg-blue-500/10 text-blue-400 border-blue-500/20";
		case "COMMUNITY":
			return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
	}
};
