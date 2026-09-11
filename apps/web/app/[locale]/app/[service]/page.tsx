import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@nasaq/i18n";
import { ServiceWorkspace } from "@/components/universal/service-workspace";
import { UniversalLibrary } from "@/components/universal/universal-library";
import { getUniversalService, type UniversalServiceId } from "@/lib/universal-content";

const serviceMap: Record<string, UniversalServiceId> = {
  learn: "learn",
  research: "research",
  create: "create",
  code: "code",
  analyze: "analyze",
  explore: "explore",
};

export function generateStaticParams() {
  return [...Object.keys(serviceMap), "library"].map((service) => ({ service }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; service: string }> }): Promise<Metadata> {
  const { locale, service: slug } = await params;
  if (!isLocale(locale)) return {};
  if (slug === "library") return { title: locale === "ar" ? "مكتبتي — نَسَق" : "My library — Nasaq" };
  const serviceId = serviceMap[slug];
  if (!serviceId) return {};
  const service = getUniversalService(locale, serviceId);
  return { title: `${service.label} — ${locale === "ar" ? "نَسَق" : "Nasaq"}`, description: service.description };
}

export default async function UniversalServicePage({ params }: { params: Promise<{ locale: string; service: string }> }) {
  const { locale, service: slug } = await params;
  if (!isLocale(locale)) notFound();
  if (slug === "library") return <UniversalLibrary locale={locale} />;
  const serviceId = serviceMap[slug];
  if (!serviceId) notFound();
  return <ServiceWorkspace locale={locale} serviceId={serviceId} />;
}
