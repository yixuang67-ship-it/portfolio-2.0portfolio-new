"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { siteContent } from "@/content/site-content";
import type { Locale } from "@/types/site";
import { ProjectDetail } from "@/components/project-detail";

export default function LabDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [locale, setLocale] = useState<Locale>("zh");

  useEffect(() => {
    const saved = localStorage.getItem(`${siteContent.preferences.storageKey}-locale`);
    if (saved === "en" || saved === "zh") setLocale(saved);
  }, []);

  const project = siteContent.lab.find((p) => p.slug === slug);

  if (!project) {
    return <div style={{ padding: "120px 32px", textAlign: "center" }}>Not found</div>;
  }

  return <ProjectDetail project={project} contentType="lab" locale={locale} />;
}
