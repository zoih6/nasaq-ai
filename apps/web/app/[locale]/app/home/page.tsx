import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ArrowLeft, Bot, ChevronRight, CircleDollarSign, FolderKanban, MessageSquareText, ShieldCheck, Workflow } from "lucide-react";
import { Badge, SectionHeading } from "@nasaq/ui";
import { localize, type Locale, type RunStatus } from "@nasaq/contracts";
import { getDictionary, isLocale } from "@nasaq/i18n";
import { getHomeSnapshot } from "@/lib/data/home";

const statusTone: Record<RunStatus, "neutral" | "info" | "success" | "warning" | "danger" | "brand"> = {
  queued: "neutral",
  planning: "info",
  running: "brand",
  waiting_for_input: "warning",
  waiting_for_approval: "warning",
  completed: "success",
  completed_with_warnings: "warning",
  failed_retryable: "danger",
  cancelled: "neutral",
};

function formatMoney(amountMinor: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(amountMinor / 100);
}

function relativeTime(date: string, locale: Locale) {
  const minutes = Math.max(1, Math.round((Date.parse("2026-09-11T08:45:00.000Z") - Date.parse(date)) / 60000));
  return new Intl.RelativeTimeFormat(locale === "ar" ? "ar" : "en", { numeric: "auto" }).format(-minutes, "minute");
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const d = getDictionary(locale);
  const data = await getHomeSnapshot();
  const base = `/${locale}/app`;

  return (
    <div>
      <header className="page-header">
        <div className="page-header__copy">
          <p className="page-eyebrow">{d.home.eyebrow}</p>
          <h1 className="page-title">{d.home.greeting}</h1>
          <p className="page-description">{d.home.intro}</p>
        </div>
        <div className="quick-actions" aria-label={locale === "ar" ? "إجراءات البدء" : "Start actions"}>
          <Link className="button button--primary button--default action-link" href={`${base}/chat`}><MessageSquareText size={16} />{d.home.newChat}</Link>
          <Link className="button button--outline button--default action-link" href={`${base}/agents`}><Bot size={16} />{d.home.runAgent}</Link>
          <Link className="button button--outline button--default action-link" href={`${base}/flows`}><Workflow size={16} />{d.home.createFlow}</Link>
        </div>
      </header>

      <div className="operations-grid">
        <section className="panel" aria-labelledby="active-runs-title">
          <div className="panel__header"><div><h2 id="active-runs-title">{d.home.activeRuns}</h2><p>{d.home.activeRunsHint}</p></div><Link className="text-link" href={`${base}/runs`}>{d.common.viewAll}<ArrowLeft size={13} /></Link></div>
          <div className="run-list">
            {data.activeRuns.map((run) => {
              const Icon = run.kind === "agent" ? Bot : Workflow;
              return (
                <Link className="run-row" href={`${base}/runs`} key={run.id}>
                  <span className="run-main"><span className="run-icon"><Icon size={16} /></span><span className="run-copy"><strong>{localize(run.title, locale)}</strong><span>{relativeTime(run.updatedAt, locale)}</span></span></span>
                  <span className="progress-cell"><span className="progress-track"><span className="progress-value" style={{ width: `${run.progress ?? 0}%` }} /></span><span>{run.progress ?? 0}%</span></span>
                  <span><Badge tone={statusTone[run.status]}>{d.status[run.status]}</Badge></span>
                  <span className="run-cost">{formatMoney(run.cost.amountMinor, run.cost.currency, locale)}</span>
                  <ChevronRight className="row-arrow" size={15} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>

        <div className="stack">
          <section aria-labelledby="approvals-title">
            <SectionHeading title={d.home.approvals} description={d.home.approvalsHint} />
            {data.approvals.map((approval) => (
              <article className="approval-card" key={approval.id}>
                <div className="approval-card__top"><Badge tone="warning"><ShieldCheck size={11} />{locale === "ar" ? "أثر خارجي" : "External action"}</Badge><span className="mono">18:00</span></div>
                <h3>{localize(approval.title, locale)}</h3>
                <p>{locale === "ar" ? "لن يُرسل شيء قبل مراجعة المستلمين والمحتوى." : "Nothing will be sent before you review recipients and content."}</p>
                <div className="approval-card__actions"><Link className="approval-button" href={`${base}/runs`}>{d.home.approvalAction}</Link><Link className="approval-button approval-secondary" href={`${base}/runs`}>{d.common.details}</Link></div>
              </article>
            ))}
          </section>

          <section className="panel balance-panel" aria-labelledby="balance-title">
            <div className="balance-top"><div><span id="balance-title" className="balance-label">{d.home.balance}</span><strong className="balance-number">{formatMoney(data.balance.available.amountMinor, data.balance.available.currency, locale)}</strong></div><span className="payer-mark">BYOK + CREDITS</span></div>
            <div className="budget-track" role="progressbar" aria-label={locale === "ar" ? "نسبة الميزانية المستخدمة" : "Budget used"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={data.balance.usedPercent}><span style={{ width: `${data.balance.usedPercent}%` }} /></div>
            <div className="budget-caption"><span>{data.balance.usedPercent}% {d.home.used}</span><Link className="text-link" href={`${base}/usage`}>{d.common.details}</Link></div>
          </section>
        </div>
      </div>

      <section className="content-section" aria-labelledby="projects-title">
        <SectionHeading title={d.home.recentProjects} description={d.home.recentProjectsHint} action={<Link className="text-link" href={`${base}/projects`}>{d.common.viewAll}<ArrowLeft size={13} /></Link>} />
        <div className="project-grid">
          {data.recentProjects.map((project, index) => (
            <Link href={`${base}/projects`} className="project-card" key={project.id}>
              <span className="project-card__icon">{index === 0 ? <Activity size={17} /> : index === 1 ? <FolderKanban size={17} /> : <MessageSquareText size={17} />}</span>
              <h3>{localize(project.name, locale)}</h3>
              <p>{localize(project.description, locale)}</p>
              <span className="project-meta"><span>{project.activeRuns > 0 ? <><span className="active-dot" />{project.activeRuns} {locale === "ar" ? "تشغيل نشط" : "active runs"}</> : (locale === "ar" ? "لا تشغيلات نشطة" : "No active runs")}</span><span>{project.conversations} {d.home.conversations}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="models-title">
        <SectionHeading title={d.home.modelGuide} description={d.home.modelGuideHint} action={<Link className="text-link" href={`${base}/models`}>{d.common.viewAll}<ArrowLeft size={13} /></Link>} />
        <div className="model-list">
          {data.suggestedModels.map((model) => (
            <article className="model-card" key={model.id}>
              <div className="model-card__head"><div><strong>{model.name}</strong><small>{model.provider}</small></div><Badge tone={model.status === "available" ? "success" : "warning"}>{model.status === "available" ? (locale === "ar" ? "متاح" : "Available") : (locale === "ar" ? "أبطأ من المعتاد" : "Degraded")}</Badge></div>
              <div className="model-metrics"><span className="metric-chip"><CircleDollarSign size={11} />{locale === "ar" ? `تكلفة ${model.relativeCost === "low" ? "منخفضة" : model.relativeCost === "medium" ? "متوسطة" : "مرتفعة"}` : `${model.relativeCost} cost`}</span><span className="metric-chip">{locale === "ar" ? `سرعة ${model.relativeSpeed === "fast" ? "عالية" : model.relativeSpeed === "balanced" ? "متوازنة" : "متأنية"}` : `${model.relativeSpeed} speed`}</span></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
