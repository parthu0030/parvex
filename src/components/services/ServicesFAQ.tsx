"use client";

import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FAQ } from "@/data/faq";
import { useReveal } from "@/hooks/useReveal";

/**
 * ServicesFAQ — common pre-sales questions, answered plainly.
 * Native <details> keeps it accessible and JavaScript-free.
 */
export function ServicesFAQ() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section className="py-24 md:py-32 bg-white" aria-labelledby="faq-heading">
      <Container>
        <div ref={ref} data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <span className="eyebrow">Questions</span>
            <h2
              id="faq-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-[34px] md:text-[44px]"
            >
              Good to know
              <span className="font-light italic text-[#6B6B6B]"> before we start.</span>
            </h2>
          </div>

          <div className="lg:col-span-8 border-t border-[#E0E0E0]">
            {FAQ.map((item) => (
              <details key={item.id} className="group border-b border-[#E0E0E0]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 md:py-7 text-[17px] md:text-[20px] font-medium text-[#0A0A0A] tracking-[-0.02em] [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:underline">
                  {item.question}
                  <span className="flex-shrink-0 w-9 h-9 rounded-full border border-[#D0D0D0] flex items-center justify-center transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                    <Plus size={16} />
                  </span>
                </summary>
                <p className="pb-7 pr-12 text-[15px] md:text-[16px] text-[#6B6B6B] leading-[1.75] max-w-[680px]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
