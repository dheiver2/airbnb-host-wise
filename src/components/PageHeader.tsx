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
      className="flex flex-col gap-4 border-b border-border bg-gradient-subtle px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">{actions}</div>}
    </div>
  );
});
