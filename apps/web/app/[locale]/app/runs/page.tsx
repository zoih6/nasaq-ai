import { notFound } from "next/navigation";
import { isLocale } from "@nasaq/i18n";
import { getOperationsData } from "@/lib/data/operations";
import { RunsPrototype } from "@/components/domain/operations/runs-prototype";

export default async function RunsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const operations = await getOperationsData();
  return <RunsPrototype locale={locale} runs={operations.runs} />;
}
