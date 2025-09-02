import React from "react";

export default function ElevatedCard({ title, subtitle, rightSlot, children }) {
  return (
    <section className="w-full">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-neutral-200/70 dark:border-neutral-800/60">
        {(title || subtitle || rightSlot) && (
          <header className="px-5 sm:px-6 py-4 border-b border-neutral-200/70 dark:border-neutral-800/60 flex items-center justify-between">
            <div>
              {title && (
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {rightSlot}
          </header>
        )}
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </section>
  );
}
