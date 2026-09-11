import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@nasaq/i18n";
import { ProductPreview } from "../../../components/domain/product-preview";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "ar" ? "معاينة نَسَق — من المحادثة إلى التدفق" : "Nasaq Preview — From chat to flow",
    description: locale === "ar" ? "جولة تفاعلية توضّح انتقال المهمة من محادثة إلى وكيل مضبوط ثم تدفق قابل للتكرار." : "An interactive walkthrough from a conversation to a bounded agent and repeatable flow.",
  };
}

export default async function PreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ProductPreview locale={locale} />;
}
