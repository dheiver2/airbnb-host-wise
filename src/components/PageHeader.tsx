import { forwardRef, ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader = forwardRef<HTMLDivElement, Props>(function PageHeader(
  { title, description, actions },
  ref,
) {
  return (
    <div
      ref={ref}
      className="flex flex-col gap-2 border-b border-border bg-gradient-subtle px-6 py-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
});
