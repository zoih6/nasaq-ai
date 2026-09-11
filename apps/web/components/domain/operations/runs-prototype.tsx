"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleDollarSign, Clock3, Eye, Play, ShieldAlert } from "lucide-react";
import { localize, type Locale, type RunSummary } from "@nasaq/contracts";
import { CostValue, LibraryEmpty, LibraryToolbar, OperationsStats, RunStatusBadge } from "./shared";
import { useState } from "react";

export function RunsPrototype({ locale, runs }: { locale: Locale; runs: RunSummary[] }) {
  const ar = locale === "ar";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const DirectionArrow = ar ? ArrowLeft : ArrowRight;
  const normalized = query.trim().toLocaleLowerCase(locale);
  const visibleRuns = runs.filter((run) => {
    const matchesQuery = !normalized || `${localize(run.title, locale)} ${run.kind} ${run.id}`.toLocaleLowerCase(locale).includes(normalized);
    return matchesQuery && (filter === "all" || run.status === filter);
  });
  const spend = runs.reduce((sum, run) => sum + run.cost.amountMinor / 100, 0);

  return (
    <div className="ops-page runs-prototype">
      <header className="page-header ops-page-header">
        <div className="page-header__copy"><p className="page-eyebrow">{ar ? "المراقبة والتدقيق" : "Observe and audit"}</p><h1 className="page-title">{ar ? "التشغيلات" : "Runs"}</h1><p className="page-description">{ar ? "تابع الخطة والخطوات والتكلفة وبوابات الموافقة من سجل واحد غير مبهم." : "Follow plans, steps, cost, and approval gates from one unambiguous record."}</p></div>
        <Link className="button button--outline button--default" href={`/${locale}/app/flows`}><Play size={14} />{ar ? "تشغيل تدفق" : "Run a flow"}</Link>
      </header>

      <OperationsStats items={[
        { label: ar ? "قيد الموافقة" : "Awaiting approval", value: String(runs.filter((run) => run.status === "waiting_for_approval").length), detail: ar ? "متوقفة بأمان" : "Stopped safely", tone: "attention" },
        { label: ar ? "مكتملة" : "Completed", value: String(runs.filter((run) => run.status === "completed" || run.status === "completed_with_warnings").length), detail: ar ? "في هذه العينة" : "In this sample" },
        { label: ar ? "إجمالي التكلفة" : "Total cost", value: `$${spend.toFixed(2)}`, detail: ar ? "تكلفة فعلية تجريبية" : "Demo actual spend" },
        { label: ar ? "قيد العمل" : "In progress", value: String(runs.filter((run) => ["planning", "running"].includes(run.status)).length), detail: ar ? "تحديث مباشر" : "Live update" },
      ]} />

      <LibraryToolbar locale={locale} query={query} onQueryChange={setQuery} activeFilter={filter} onFilterChange={setFilter} resultCount={visibleRuns.length} filters={[
        { id: "all", label: ar ? "الكل" : "All" },
        { id: "waiting_for_approval", label: ar ? "ينتظر موافقة" : "Awaiting approval" },
        { id: "running", label: ar ? "يعمل" : "Running" },
        { id: "completed", label: ar ? "مكتمل" : "Completed" },
        { id: "completed_with_warnings", label: ar ? "بتحذير" : "With warning" },
      ]} />

      {visibleRuns.length ? <div className="runs-table-wrap"><table className="runs-table"><caption className="sr-only">{ar ? "سجل التشغيلات" : "Run history"}</caption><thead><tr><th>{ar ? "التشغيل" : "Run"}</th><th>{ar ? "الحالة" : "Status"}</th><th>{ar ? "النوع" : "Kind"}</th><th>{ar ? "آخر تحديث" : "Updated"}</th><th>{ar ? "التكلفة" : "Cost"}</th><th><span className="sr-only">{ar ? "إجراء" : "Action"}</span></th></tr></thead><tbody>{visibleRuns.map((run) => (
        <tr key={run.id}>
          <td data-label={ar ? "التشغيل" : "Run"}><Link className="run-name-cell" href={`/${locale}/app/runs/${run.id}`}><span className="run-name-cell__icon">{run.status === "waiting_for_approval" ? <ShieldAlert size={16} /> : <Play size={15} />}</span><span><strong>{localize(run.title, locale)}</strong><small className="mono">{run.id}</small></span></Link></td>
          <td data-label={ar ? "الحالة" : "Status"}><RunStatusBadge locale={locale} status={run.status} /></td>
          <td data-label={ar ? "النوع" : "Kind"}><span className="table-project">{run.kind === "flow" ? (ar ? "تدفق" : "Flow") : (ar ? "وكيل" : "Agent")}</span></td>
          <td data-label={ar ? "آخر تحديث" : "Updated"}><span className="table-muted"><Clock3 size={13} />{ar ? "منذ دقائق" : "Minutes ago"}</span></td>
          <td data-label={ar ? "التكلفة" : "Cost"}><span className="table-cost"><CircleDollarSign size={13} /><CostValue value={run.cost.amountMinor / 100} locale={locale} /></span></td>
          <td><Link className="table-open" href={`/${locale}/app/runs/${run.id}`} aria-label={ar ? `فتح ${localize(run.title, locale)}` : `Open ${localize(run.title, locale)}`}><Eye size={15} /><DirectionArrow size={13} /></Link></td>
        </tr>
      ))}</tbody></table></div> : <LibraryEmpty locale={locale} onReset={() => { setQuery(""); setFilter("all"); }} />}
    </div>
  );
}
