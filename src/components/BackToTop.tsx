import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function BackToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const toggleVisible = () => {
			const scrolled = document.documentElement.scrollTop;
			if (scrolled > 500) {
				setVisible(true);
			} else if (scrolled <= 500) {
				setVisible(false);
			}
		};
		window.addEventListener("scroll", toggleVisible);
		return () => window.removeEventListener("scroll", toggleVisible);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<AnimatePresence>
			{visible && (
				<motion.button
					initial={{ opacity: 0, scale: 0.8, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.8, y: 20 }}
					onClick={scrollToTop}
					className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full btn-primary text-white shadow-lg shadow-brand-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
				>
					<ChevronRight className="w-6 h-6 -rotate-90" />
				</motion.button>
			)}
		</AnimatePresence>
	);
}
