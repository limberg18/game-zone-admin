import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="p-6 space-y-6 max-w-[1600px] mx-auto">{children}</div>;
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  tone?: "primary" | "info" | "warning" | "success";
}) {
  const toneBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    info: "bg-info/10 text-info",
    warning: "bg-warning/15 text-warning-foreground",
    success: "bg-success/10 text-success",
  };
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {delta && <p className="text-xs text-success mt-1">{delta}</p>}
        </div>
        {icon && <div className={`h-10 w-10 rounded-lg grid place-items-center ${toneBg[tone]}`}>{icon}</div>}
      </div>
    </div>
  );
}
