"use client";

import { useRef } from "react";
import {
	motion,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface TimelineItemData {
	title: string;
	description: string;
	date: string;
	image?: string;
	imageAlt?: string;
	imagePosition?: string;
}

interface TimelineItemProps extends TimelineItemData {
	index: number;
}

function TimelineItem({
	title,
	description,
	date,
	image,
	imageAlt,
	imagePosition,
	index,
}: TimelineItemProps) {
	const isEven = index % 2 === 0;

	return (
		<div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-0">
			<div
				className={cn(
					"relative z-10 flex flex-col justify-center p-0 lg:p-8",
					isEven ? "lg:items-end lg:text-right" : "lg:order-2",
				)}
			>
				<div className="flex flex-col gap-3">
					<div className="space-y-2">
						<p className="font-sans text-lg font-normal text-muted-foreground md:text-xl">
							({date})
						</p>
						<h3 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl lg:text-4xl">
							{title}
						</h3>
					</div>
					<p className="max-w-[34rem] text-base leading-relaxed text-muted-foreground md:text-lg">
						{description}
					</p>
				</div>
			</div>

			<div
				className={cn(
					"relative z-10 flex items-center justify-center p-0 lg:p-8",
					isEven ? "lg:order-2" : "",
				)}
			>
				{image && (
					<div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-cloud">
						<img
							src={image}
							alt={imageAlt ?? title}
							loading="lazy"
							decoding="async"
							style={imagePosition ? { objectPosition: imagePosition } : undefined}
							className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 ease-out hover:scale-[1.03]"
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export interface TimelineProps {
	items: TimelineItemData[];
	className?: string;
}

export default function Timeline({ items, className }: TimelineProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start center", "end center"],
	});
	const scaleY = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});
	const markerTop = useTransform(scaleY, [0, 1], ["0%", "100%"]);

	return (
		<div ref={containerRef} className={cn("relative", className)}>
			<div
				className="absolute bottom-0 left-4 top-0 w-px bg-navy/15 lg:left-1/2 lg:-translate-x-1/2"
				aria-hidden="true"
			/>
			<div
				className="absolute bottom-0 left-4 top-0 w-px lg:left-1/2 lg:-translate-x-1/2"
				aria-hidden="true"
			>
				<motion.div
					style={reduceMotion ? { scaleY: 1, originY: 0 } : { scaleY, originY: 0 }}
					className="absolute inset-0 w-full bg-green"
				/>
				<motion.div
					style={reduceMotion ? { top: "100%" } : { top: markerTop }}
					className="absolute left-1/2 top-0 z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border-[3px] border-background bg-orange shadow-[0_0_0_1px_rgba(240,95,35,0.22)]"
				/>
			</div>

			<div className="flex flex-col gap-12 py-8 pl-10 pr-0 lg:gap-0 lg:px-0 lg:py-0">
				{items.map((item, index) => (
					<TimelineItem
						key={`${item.date}-${item.title}`}
						{...item}
						index={index}
					/>
				))}
			</div>
		</div>
	);
}
