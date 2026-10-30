"use client";

import React, { type FC, type ElementType } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type AnimationType = "text" | "word" | "character" | "line";
type AnimationVariant =
	| "fadeIn"
	| "blurIn"
	| "blurInUp"
	| "blurInDown"
	| "slideUp"
	| "slideDown"
	| "slideLeft"
	| "slideRight"
	| "scaleUp"
	| "scaleDown";

interface TextAnimateProps {
	text?: string;
	children?: React.ReactNode;
	className?: string;
	segmentClassName?: string;
	delay?: number;
	duration?: number;
	variants?: {
		container?: Variants;
		item?: Variants;
	};
	as?: ElementType;
	by?: AnimationType;
	startOnView?: boolean;
	once?: boolean;
	animation?: AnimationVariant;
}

const defaultItemAnimationVariants: Record<
	AnimationVariant,
	{ container: Variants; item: Variants }
> = {
	fadeIn: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { opacity: 0 },
			show: (i: { duration: number }) => ({
				opacity: 1,
				transition: { duration: i.duration },
			}),
		},
	},
	blurIn: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { opacity: 0, filter: "blur(10px)" },
			show: (i: { duration: number }) => ({
				opacity: 1,
				filter: "blur(0px)",
				transition: { duration: i.duration },
			}),
		},
	},
	blurInUp: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
			show: (i: { duration: number }) => ({
				opacity: 1,
				filter: "blur(0px)",
				y: 0,
				transition: {
					y: { duration: i.duration },
					opacity: { duration: i.duration },
					filter: { duration: i.duration },
				},
			}),
		},
	},
	blurInDown: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
			show: (i: { duration: number }) => ({
				opacity: 1,
				filter: "blur(0px)",
				y: 0,
				transition: {
					y: { duration: i.duration },
					opacity: { duration: i.duration },
					filter: { duration: i.duration },
				},
			}),
		},
	},
	slideUp: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { y: 20, opacity: 0 },
			show: (i: { duration: number }) => ({
				y: 0,
				opacity: 1,
				transition: { duration: i.duration },
			}),
		},
	},
	slideDown: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { y: -20, opacity: 0 },
			show: (i: { duration: number }) => ({
				y: 0,
				opacity: 1,
				transition: { duration: i.duration },
			}),
		},
	},
	slideLeft: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { x: 20, opacity: 0 },
			show: (i: { duration: number }) => ({
				x: 0,
				opacity: 1,
				transition: { duration: i.duration },
			}),
		},
	},
	slideRight: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { x: -20, opacity: 0 },
			show: (i: { duration: number }) => ({
				x: 0,
				opacity: 1,
				transition: { duration: i.duration },
			}),
		},
	},
	scaleUp: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { scale: 0.5, opacity: 0 },
			show: (i: { duration: number }) => ({
				scale: 1,
				opacity: 1,
				transition: { duration: i.duration },
			}),
		},
	},
	scaleDown: {
		container: {
			hidden: { opacity: 0 },
			show: (i: { delay: number; stagger: number }) => ({
				opacity: 1,
				transition: { staggerChildren: i.stagger, delayChildren: i.delay },
			}),
		},
		item: {
			hidden: { scale: 1.5, opacity: 0 },
			show: (i: { duration: number }) => ({
				scale: 1,
				opacity: 1,
				transition: { duration: i.duration },
			}),
		},
	},
};

function extractText(node: React.ReactNode): string {
	if (node === null || node === undefined || typeof node === "boolean") {
		return "";
	}
	if (typeof node === "string") {
		return node;
	}
	if (typeof node === "number") {
		return String(node);
	}
	if (Array.isArray(node)) {
		return node.map(extractText).join("");
	}
	if (React.isValidElement(node)) {
		return extractText((node.props as any)?.children);
	}
	if (typeof node === "object") {
		const obj = node as any;
		if (typeof obj.default === "function") {
			try {
				return extractText(obj.default());
			} catch {
				return "";
			}
		}
		if (obj.props?.children) {
			return extractText(obj.props.children);
		}
	}
	return "";
}

export const TextAnimate: FC<TextAnimateProps> = ({
	text,
	children,
	className,
	segmentClassName,
	delay = 0,
	duration = 0.35,
	variants,
	as: Component = "span",
	by = "character",
	startOnView = true,
	once = true,
	animation = "blurInUp",
	...props
}) => {
	const MotionComponent = motion.create(Component);

	const textContent = React.useMemo(() => {
		if (text && typeof text === "string") return text.trim();
		const extracted = extractText(children).trim();
		if (extracted && extracted !== "[object Object]") {
			return extracted;
		}
		return "";
	}, [text, children]);

	if (!textContent) {
		return <>{children}</>;
	}

	const stagger = by === "character" ? 0.025 : by === "word" ? 0.08 : 0.15;
	const currentVariants = defaultItemAnimationVariants[animation] || defaultItemAnimationVariants.blurInUp;

	const containerVariants = variants?.container || currentVariants.container;
	const itemVariants = variants?.item || currentVariants.item;

	let segments: React.ReactNode[] = [];

	if (by === "character") {
		const words = textContent.split(" ");
		segments = words.map((word, wordIndex) => (
			<span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
				{word.split("").map((char, charIndex) => (
					<motion.span
						key={`char-${wordIndex}-${charIndex}`}
						variants={itemVariants as Variants}
						custom={{ duration }}
						className={cn("inline-block", segmentClassName)}
					>
						{char}
					</motion.span>
				))}
				{wordIndex < words.length - 1 && (
					<span className="inline-block">&nbsp;</span>
				)}
			</span>
		));
	} else if (by === "word") {
		const words = textContent.split(" ");
		segments = words.map((word, i) => (
			<motion.span
				key={`word-${i}`}
				variants={itemVariants as Variants}
				custom={{ duration }}
				className={cn("inline-block", segmentClassName)}
			>
				{word}
				{i < words.length - 1 && "\u00A0"}
			</motion.span>
		));
	} else if (by === "line") {
		const lines = textContent.split("\n");
		segments = lines.map((line, i) => (
			<motion.span
				key={`line-${i}`}
				variants={itemVariants as Variants}
				custom={{ duration }}
				className={cn("block", segmentClassName)}
			>
				{line}
			</motion.span>
		));
	} else {
		segments = [
			<motion.span
				key="text"
				variants={itemVariants as Variants}
				custom={{ duration }}
				className={cn("inline-block", segmentClassName)}
			>
				{textContent}
			</motion.span>,
		];
	}

	return (
		<MotionComponent
			data-slot="text-animate"
			initial="hidden"
			animate={startOnView ? undefined : "show"}
			whileInView={startOnView ? "show" : undefined}
			viewport={{ once }}
			variants={containerVariants as Variants}
			custom={{ delay, stagger }}
			className={cn("inline-block", className)}
			{...props}
		>
			{segments}
		</MotionComponent>
	);
};

export default TextAnimate;
