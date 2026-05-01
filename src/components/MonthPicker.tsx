import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

interface MonthPickerProps {
  value: string; // formato "YYYY-MM"
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export function MonthPicker({ value, onChange, className, id }: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [year, month] = value.split("-").map(Number);
  const [viewYear, setViewYear] = React.useState(year || new Date().getFullYear());

  React.useEffect(() => {
    if (year) setViewYear(year);
  }, [year]);

  const label = year && month ? `${MESES[month - 1]} ${year}` : "Selecione";

  function select(m: number) {
    const v = `${viewYear}-${String(m).padStart(2, "0")}`;
    onChange(v);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn("min-w-[172px] justify-start text-left font-normal", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => setViewYear((y) => y - 1)}>
            ‹
          </Button>
          <div className="text-sm font-semibold">{viewYear}</div>
          <Button variant="ghost" size="sm" onClick={() => setViewYear((y) => y + 1)}>
            ›
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {MESES_CURTOS.map((nome, i) => {
            const m = i + 1;
            const isSelected = viewYear === year && m === month;
            return (
              <Button
                key={m}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className="h-9 w-16"
                onClick={() => select(m)}
              >
                {nome}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
