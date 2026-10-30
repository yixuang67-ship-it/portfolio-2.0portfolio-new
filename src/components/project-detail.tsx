"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale, MediaAsset, Project, SiteContent } from "@/types/site";

const text = (value: { en: string; zh: string }, locale: Locale) => value[locale];

const detailColorMap: Record<string, { bg: string; text: string }> = {
  "course-practice": { bg: "#000000", text: "#ffffff" }, // 创意媒体 黑
  "hanfu-contest": { bg: "#fff9e6", text: "#2d1b2e" }, // 搜狐 浅黄
  "overseas-social": { bg: "#fff0f5", text: "#2d1b2e" }, // 小叶子 浅粉
  "journalism": { bg: "#fff9e6", text: "#2d1b2e" }, // 河青报 浅黄
  "emotion-bottle": { bg: "#000000", text: "#ffffff" }, // 网页 黑
  "ads-and-variety": { bg: "#fff9e6", text: "#2d1b2e" }, // 校园经历 浅黄
  "photography": { bg: "#000000", text: "#ffffff" }, // 摄影 黑
  "music": { bg: "#fff0f5", text: "#2d1b2e" }, // 音乐 浅粉
};

function DetailMedia({ media, locale }: { media: MediaAsset; locale: Locale }) {
  if (media.type === "video") {
    const videoCaption = text(media.alt, locale);
    const video = (
      <>
        <video
          className="detail-media-element"
          src={media.src}
          controls
          playsInline
          preload="metadata"
          aria-label={videoCaption}
        />
        {videoCaption && <p className="detail-media-caption">{videoCaption}</p>}
      </>
    );
    if (media.href) {
      return (
        <div className="detail-media-wrap">
          <a href={media.href} target="_blank" rel="noopener noreferrer" className="detail-media-link">
            {video}
            <span className="detail-media-hint">点击跳转 ↗</span>
          </a>
        </div>
      );
    }
    return <div className="detail-media-wrap">{video}</div>;
  }
  const imgCaption = text(media.alt, locale);
  const img = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="detail-media-element"
        src={media.src}
        alt={imgCaption}
        loading="lazy"
      />
      {imgCaption && <p className="detail-media-caption">{imgCaption}</p>}
    </>
  );
  if (media.href) {
    return (
      <div className="detail-media-wrap">
        <a href={media.href} target="_blank" rel="noopener noreferrer" className="detail-media-link">
          {img}
          <span className="detail-media-hint">点击跳转 ↗</span>
        </a>
      </div>
    );
  }
  return <div className="detail-media-wrap">{img}</div>;
}

export function ProjectDetail({
  project,
  contentType,
  locale,
}: {
  project: Project;
  contentType: "work" | "lab";
  locale: Locale;
}) {
  const backHref = contentType === "work" ? "/#work" : "/#lab";
  const backLabel = contentType === "work" ? "作品" : "实验";

  const [colorScheme, setColorScheme] = useState({ bg: "#fff9e6", text: "#2d1b2e" });

  useEffect(() => {
    const scheme = detailColorMap[project.slug] || { bg: "#fff9e6", text: "#2d1b2e" };
    setColorScheme(scheme);
  }, [project.slug]);

  return (
    <div className="project-detail" style={{ background: colorScheme.bg, color: colorScheme.text }}>
      <style>{`
        .project-detail .eyebrow, .project-detail .detail-summary, .project-detail .detail-tools, .project-detail .detail-year, .project-detail .detail-section-title, .project-detail .detail-section-desc, .project-detail .detail-link, .project-detail .detail-back {
          color: ${colorScheme.text};
          opacity: ${colorScheme.bg === "#000000" ? 0.8 : 0.7};
        }
        .project-detail h1 {
          color: ${colorScheme.text};
        }
        .project-detail .detail-media-caption {
          color: ${colorScheme.text};
          opacity: 0.7;
        }
      `}</style>
      <div className="detail-inner">
        <Link href={backHref} className="detail-back">
          <ArrowLeft size={18} />
          <span>{locale === "zh" ? "返回首页" : "Back to Home"}</span>
        </Link>

        <div className="detail-header">
          <span className="eyebrow">{text(project.meta, locale)}</span>
          <h1>{text(project.title, locale)}</h1>
          <p className="detail-summary">{text(project.detailSummary ?? project.summary, locale)}</p>
          {project.tools && <p className="detail-tools">{text(project.tools, locale)}</p>}
          <span className="detail-year">{project.year}</span>
        </div>

        {project.externalLinks && project.externalLinks.length > 0 && (
          <div className="detail-links">
            {project.externalLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="detail-link">
                {text(link.label, locale)} ↗
              </a>
            ))}
          </div>
        )}

        {project.sections && project.sections.length > 0 ? (
          <div className="detail-sections">
            {project.sections.map((section, i) => (
              <div key={i} className="detail-section">
                {text(section.title, locale) && <h2 className="detail-section-title">{text(section.title, locale)}</h2>}
                {text(section.description, locale) && <p className="detail-section-desc">{text(section.description, locale)}</p>}
                <div className={`detail-gallery${section.layout === "grid" ? " gallery-grid" : ""}`}>
                  {section.media.map((media, j) => (
                    <div key={j} className={`detail-gallery-item${media.size === "small" ? " size-small" : ""}${media.size === "wide" ? " size-wide" : ""}`}>
                      <DetailMedia media={media} locale={locale} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="detail-gallery">
            {project.gallery && project.gallery.length > 0 ? (
              project.gallery.map((media, i) => (
                <div key={i} className="detail-gallery-item">
                  <DetailMedia media={media} locale={locale} />
                </div>
              ))
            ) : (
              <div className="detail-gallery-item">
                <DetailMedia media={project.media} locale={locale} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
