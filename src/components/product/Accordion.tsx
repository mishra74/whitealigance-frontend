"use client";

import { useState, type ReactNode } from "react";

interface AccordionItem {
  title: string;
  content: ReactNode;
}

export default function Accordion({
  items,
  defaultOpenIndex = 0,
}: {
  items: AccordionItem[];
  defaultOpenIndex?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.title} className="border-b border-cream">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between py-5 text-left text-[0.85rem] font-semibold tracking-[0.02em]"
            >
              {item.title}
              <span
                className={`text-soft-gold transition-transform duration-300 ease-fabric ${
                  open ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden text-[0.88rem] text-warm-gray transition-[max-height] duration-[400ms] ease-fabric ${
                open ? "max-h-96 pb-5" : "max-h-0"
              }`}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
