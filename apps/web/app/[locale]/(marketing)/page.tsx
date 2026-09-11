import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot, Check, MessageSquareText, ShieldCheck, Workflow } from "lucide-react";
import { NasaqMark } from "@nasaq/ui";
import { getDictionary, isLocale } from "@nasaq/i18n";

export default async function MarketingHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const appHref = `/${locale}/app/home`;
  const otherLocale = locale === "ar" ? "en" : "ar";
  const nav = locale === "ar"
    ? { product: "المنتج", agents: "الوكلاء", trust: "الثقة", signIn: "فتح التطبيق" }
    : { product: "Product", agents: "Agents", trust: "Trust", signIn: "Open app" };

  return (
    <div className="marketing">
      <header className="marketing-header">
        <Link className="brand-lockup" href={`/${locale}`}>
          <NasaqMark size={35} />
          <span>{d.brand.name}</span>
        </Link>
        <nav className="marketing-nav" aria-label={locale === "ar" ? "التنقل العام" : "Public navigation"}>
          <a href="#product">{nav.product}</a>
          <a href="#product">{nav.agents}</a>
          <a href="#trust">{nav.trust}</a>
        </nav>
        <div className="header-actions">
          <Link className="locale-link" href={`/${otherLocale}`}>{otherLocale.toUpperCase()}</Link>
          <Link className="button button--outline button--default" href={appHref}>{nav.signIn}</Link>
        </div>
      </header>

      <main>
        <section className="marketing-hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{d.marketing.eyebrow}</p>
              <h1 className="hero-title">{d.marketing.headlineA}<span>{d.marketing.headlineB}</span></h1>
              <p className="hero-body">{d.marketing.body}</p>
              <div className="hero-actions">
                <Link className="button button--primary button--prominent" href={appHref}>{d.marketing.primary}<ArrowLeft size={17} aria-hidden="true" /></Link>
                <Link className="button button--outline button--prominent" href={`/${locale}/preview`}>{d.marketing.secondary}</Link>
              </div>
              <p id="trust" className="trust-line"><ShieldCheck size={14} style={{ verticalAlign: "middle", marginInlineEnd: 6 }} aria-hidden="true" />{d.marketing.trust}</p>
            </div>

            <div className="workbench" aria-label={locale === "ar" ? "معاينة لمسار العمل في نَسَق" : "Preview of a Nasaq workflow"}>
              <div className="workbench__top">
                <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
                <span className="workbench__label">NASAQ · LIVE WORKSPACE</span>
              </div>
              <div className="workbench__body">
                <div className="workbench__rail" aria-hidden="true">
                  <NasaqMark size={30} />
                  <span className="rail-icon is-active"><MessageSquareText size={16} /></span>
                  <span className="rail-icon"><Bot size={16} /></span>
                  <span className="rail-icon"><Workflow size={16} /></span>
                </div>
                <div className="workbench__content">
                  <div className="workbench__context">
                    <div><p className="context-title">{locale === "ar" ? "دراسة إطلاق السوق السعودي" : "Saudi market launch study"}</p><span className="context-meta">{locale === "ar" ? "سياق مشروع موحّد" : "Shared project context"}</span></div>
                    <span className="badge badge--brand">{locale === "ar" ? "نشط" : "Active"}</span>
                  </div>
                  <div className="path-sequence">
                    <div className="path-item">
                      <span className="path-index">01</span>
                      <span className="path-copy"><strong>{locale === "ar" ? "مقارنة تحليل السوق" : "Compare market analysis"}</strong><span>{locale === "ar" ? "نموذجان · نفس السياق · تكلفة ظاهرة" : "Two models · same context · visible cost"}</span></span>
                      <span className="path-state"><Check size={12} /> {locale === "ar" ? "اكتمل" : "Done"}</span>
                    </div>
                    <div className="path-item">
                      <span className="path-index">02</span>
                      <span className="path-copy"><strong>{locale === "ar" ? "وكيل باحث السوق" : "Market research agent"}</strong><span>{locale === "ar" ? "خطة، مصادر، وحد إنفاق" : "Plan, sources, and a spend limit"}</span></span>
                      <span className="path-state">64% · {locale === "ar" ? "يعمل" : "Running"}</span>
                    </div>
                    <div className="path-item">
                      <span className="path-index">03</span>
                      <span className="path-copy"><strong>{locale === "ar" ? "تدفق الرصد الأسبوعي" : "Weekly monitoring flow"}</strong><span>{locale === "ar" ? "يُنشأ من التشغيل الناجح" : "Created from the successful run"}</span></span>
                      <span className="path-state">{locale === "ar" ? "مسودة" : "Draft"}</span>
                    </div>
                  </div>
                  <div className="workbench__receipt"><span>{locale === "ar" ? "أثر خارجي ينتظر موافقتك" : "External action awaiting your approval"}</span><strong className="ltr-value">$1.39</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="proof-section">
          <div className="proof-header">
            <h2>{d.marketing.proofTitle}</h2>
            <p>{locale === "ar" ? "يحافظ المشروع على الملفات والسياق والنماذج والمخرجات بينما تتغير طريقة العمل." : "The project keeps files, context, models, and outputs together while the mode of work changes."}</p>
          </div>
          <div className="proof-grid">
            <article className="proof-item"><span className="proof-number">01 / CHAT</span><div className="proof-icon"><MessageSquareText size={20} /></div><h3>{d.marketing.chatTitle}</h3><p>{d.marketing.chatBody}</p></article>
            <article className="proof-item"><span className="proof-number">02 / AGENT</span><div className="proof-icon"><Bot size={20} /></div><h3>{d.marketing.agentTitle}</h3><p>{d.marketing.agentBody}</p></article>
            <article className="proof-item"><span className="proof-number">03 / FLOW</span><div className="proof-icon"><Workflow size={20} /></div><h3>{d.marketing.flowTitle}</h3><p>{d.marketing.flowBody}</p></article>
          </div>
        </section>
      </main>

      <footer className="marketing-footer"><div className="marketing-footer__inner"><p>{d.brand.promise}</p><p>© 2026 Nasaq AI · Prototype 0.1</p></div></footer>
    </div>
  );
}
