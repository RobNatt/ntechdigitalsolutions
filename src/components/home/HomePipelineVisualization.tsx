import { Award, Bot, Database, MessageSquareText, PhoneCall } from "lucide-react";

const CYCLE_SECONDS = 6;

const NODES = [
  { icon: PhoneCall, label: "Call or Form" },
  { icon: Bot, label: "AI Receptionist" },
  { icon: Database, label: "CRM Entry" },
  { icon: MessageSquareText, label: "Confirms" },
  { icon: Award, label: "Booked / 5-Star" },
] as const;

const NODE_X = [60, 265, 470, 675, 880] as const;
const NODE_Y = 100;

/**
 * The homepage's signature moment: a live diagram of a lead moving through the actual system,
 * not a static graphic. A packet travels the path continuously (native SVG animateMotion — no
 * JS animation loop) while each node lights up in sync via a CSS keyframe timed to the same
 * cycle length. Respects prefers-reduced-motion (see globals.css: .pipeline-dot / .pipeline-node-pulse).
 * Always-dark background (matching the final-CTA band) so the glow reads clearly and the
 * homepage isn't all-white — see Section 9 polish notes.
 */
export function HomePipelineVisualization() {
  const pathD = `M ${NODE_X[0]} ${NODE_Y} L ${NODE_X[NODE_X.length - 1]} ${NODE_Y}`;

  return (
    <section className="border-t border-slate-800/80 bg-[#0f172a] py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-400">
            One connected system
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Watch a lead move through the system, live
          </h2>
        </div>

        <div className="mt-10 overflow-x-auto">
          <svg
            viewBox="0 0 940 200"
            className="mx-auto w-full min-w-[640px] max-w-4xl"
            role="img"
            aria-label="Diagram: a call or form entry travels through the AI receptionist, CRM entry, and confirmation steps, resolving as a booked appointment or 5-star review."
          >
            <path d={pathD} fill="none" className="stroke-slate-700" strokeWidth={2} strokeDasharray="6 6" />
            <path id="pipeline-travel-path" d={pathD} fill="none" stroke="none" />

            <circle r={7} className="pipeline-dot fill-sky-400">
              <animateMotion dur={`${CYCLE_SECONDS}s`} repeatCount="indefinite" rotate="auto">
                <mpath href="#pipeline-travel-path" />
              </animateMotion>
            </circle>

            {NODE_X.map((x, i) => (
              <g
                key={x}
                className="pipeline-node-pulse"
                style={{
                  transformOrigin: `${x}px ${NODE_Y}px`,
                  animationDelay: `${(i / NODE_X.length) * CYCLE_SECONDS}s`,
                }}
              >
                <circle cx={x} cy={NODE_Y} r={26} className="fill-slate-900 stroke-sky-800" strokeWidth={2} />
                <foreignObject x={x - 14} y={NODE_Y - 14} width={28} height={28}>
                  <NodeIcon index={i} />
                </foreignObject>
              </g>
            ))}
          </svg>

          <div
            className="mx-auto mt-4 grid w-full min-w-[640px] max-w-4xl text-center text-xs font-medium text-slate-400"
            style={{ gridTemplateColumns: `repeat(${NODES.length}, 1fr)` }}
            aria-hidden
          >
            {NODES.map((node) => (
              <span key={node.label}>{node.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NodeIcon({ index }: { index: number }) {
  const Icon = NODES[index].icon;
  return (
    <div className="flex h-full w-full items-center justify-center text-sky-400">
      <Icon className="h-[18px] w-[18px]" aria-hidden />
    </div>
  );
}
