import { notFound } from "next/navigation";
import { isLocale } from "@nasaq/i18n";
import { getOperationsData } from "@/lib/data/operations";
import { ProjectsPrototype } from "@/components/domain/operations/projects-prototype";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const operations = await getOperationsData();
  return <ProjectsPrototype locale={locale} initialProjects={operations.projects} />;
}
