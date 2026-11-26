import { ProcessTimeline, type ProcessStep } from "@/components/ui/ProcessTimeline";

// Local to this section — mirrors how FutureWork.tsx keeps a short,
// page-specific list inline rather than in /data.
const PROCESS_STEPS: ProcessStep[] = [
  { id: "discovery", label: "Discovery", description: "A focused conversation about your goals, audience and constraints. You get a clear scope and estimate." },
  { id: "strategy", label: "Strategy", description: "We map structure, content and the right technology before anything is designed or built." },
  { id: "design", label: "Design & Production", description: "Interfaces, identity or shoots take shape — shared early, refined together at each milestone." },
  { id: "development", label: "Build", description: "Clean, tested, production-ready engineering and post-production, reviewed in stages." },
  { id: "launch", label: "Launch & Support", description: "We ship, measure what matters and stay close for what comes next." },
];

/**
 * ServicesProcess — "How We Work" section for the Services page.
 * Renders the shared ProcessTimeline with this page's steps.
 */
export function ServicesProcess() {
  return (
    <ProcessTimeline
      id="process"
      eyebrow="How We Work"
      title="A process built for clarity."
      steps={PROCESS_STEPS}
      tone="muted"
    />
  );
}
