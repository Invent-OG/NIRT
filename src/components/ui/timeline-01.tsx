"use client";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Timeline, {
	type TimelineItemData,
} from "@/components/ui/timeline-01-utils/timeline";

const timelineData: TimelineItemData[] = [
	{
		title: "Understand your requirements",
		description:
			"Review your electricity consumption, property details, objectives and budget.",
		date: "01",
		image: "/images/cta-consultation.webp",
		imageAlt: "An engineer and a homeowner reviewing a solar plan beside a solar array",
		imagePosition: "58% 32%",
	},
	{
		title: "Assess the site",
		description:
			"Evaluate roof suitability, available space, shading and relevant technical requirements.",
		date: "02",
		image: "/images/hero-homes.webp",
		imageAlt: "Homes with rooftop solar panels",
		imagePosition: "60% 62%",
	},
	{
		title: "Design the right solution",
		description:
			"Determine the proposed capacity, system configuration, equipment and generation assumptions.",
		date: "03",
		image: "/images/project-residential.webp",
		imageAlt: "Solar panels installed on the tiled roof of a home",
		imagePosition: "55% 65%",
	},
	{
		title: "Clarify the investment",
		description:
			"Present the quotation, scope, applicable subsidy information, payment terms and exclusions.",
		date: "04",
		image: "/images/project-solar-park.webp",
		imageAlt: "Aerial view of a large ground-mounted solar park with rows of panels",
		imagePosition: "50% 50%",
	},
	{
		title: "Install and commission",
		description:
			"Carry out the agreed installation, electrical checks and applicable utility or net-metering procedures.",
		date: "05",
		image: "/images/project-rooftop.webp",
		imageAlt: "Solar panel array installed across a large industrial rooftop",
		imagePosition: "50% 45%",
	},
	{
		title: "Handover and support",
		description:
			"Explain system operation, relevant warranties, documentation and the support available after installation.",
		date: "06",
		image: "/images/cta-consultation.webp",
		imageAlt: "NIRT engineers walking a homeowner through the completed solar installation",
		imagePosition: "38% 26%",
	},
];

export default function TimelineBlock01() {
	return (
		<section
			id="process"
			className="relative overflow-hidden bg-cloud py-16 sm:py-20 lg:py-24"
			aria-labelledby="process-heading"
		>
			<div className="mx-auto max-w-[1240px] px-5 md:px-8 lg:px-10">
				<div className="border-x border-border bg-white">
					<div className="border-b border-border px-6 py-10 md:px-10 md:py-16 lg:px-16 lg:py-20">
						<div className="max-w-2xl space-y-4">
							<Badge
								variant="outline"
								className="rounded-none px-3 py-1 font-normal"
							>
								The NIRT approach · 06 steps
							</Badge>
							<div className="space-y-3">
								<h2
									id="process-heading"
									className="font-display text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-[3.1rem] lg:text-[3.6rem]"
								>
									Six steps.{" "}
									<span className="text-green">No surprises.</span>
								</h2>
								<p className="max-w-[34rem] text-sm leading-relaxed text-muted-foreground md:text-base">
									From the first assessment to installation and handover, understand
									the steps, decisions and deliverables involved — with one team
									throughout.
								</p>
							</div>
						</div>
					</div>

					<div className="px-6 lg:px-0">
						<Timeline items={timelineData} />
					</div>

					<div className="flex flex-col gap-5 border-y border-border px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:px-10">
						<div>
							<p className="text-[12px] font-semibold text-foreground">
								Ready to start with step one?
							</p>
							<p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground">
								Book a free solar assessment in Salem and across Tamil Nadu.
							</p>
						</div>
						<a
							href="#estimate"
							className="btn-primary shrink-0 self-start !min-h-11 !px-5 !text-[10.5px] sm:self-auto"
						>
							Book a solar assessment
							<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
