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
