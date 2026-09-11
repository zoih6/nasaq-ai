import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell/app-shell";
import { getDictionary, isLocale } from "@nasaq/i18n";

export default async function ApplicationLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AppShell locale={locale} dictionary={getDictionary(locale)}>{children}</AppShell>;
}
