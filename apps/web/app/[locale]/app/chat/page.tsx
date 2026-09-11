import { notFound } from "next/navigation";
import { isLocale } from "@nasaq/i18n";
import { ChatPrototype } from "@/components/domain/chat-prototype";

export default async function ChatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ChatPrototype locale={locale} />;
}
