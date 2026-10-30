"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Download,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LabProject, Locale, LocalizedText, MediaAsset, Project, SiteContent } from "@/types/site";

const text = (value: LocalizedText, locale: Locale) => value[locale];

function resumeHref(content: SiteContent, locale: Locale) {
  if (content.resume.mode === "hidden") return undefined;
  if (content.resume.mode === "localized") return content.resume[locale];
  return content.resume.shared;
}

function Media({ media, locale, eager = false, hero = false }: { media: MediaAsset; locale: Locale; eager?: boolean; hero?: boolean }) {
  if (media.type === "video") {
    return (
      <video
        className="media-element"
        src={media.src}
        poster={media.poster}
        controls={!hero}
        autoPlay={hero}
        loop={hero}
        muted
        playsInline
        preload={hero ? "auto" : "metadata"}
        aria-label={text(media.alt, locale)}
        style={{ objectPosition: media.objectPosition }}
      />
    );
  }

  return (
    // User-provided media can have arbitrary dimensions, so the reusable renderer cannot use static image metadata.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="media-element"
      src={media.src}
      alt={text(media.alt, locale)}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      style={{ objectPosition: media.objectPosition }}
    />
  );
}

function WorkCard({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <a href={`/work/${project.slug}`} className="work-card-link" style={{ textDecoration: "none", color: "inherit" }}>
      <article className="work-card">
        <div className="work-media">
          <Media media={project.media} locale={locale} />
        </div>
        <div className="work-meta">
          <span><span className="meta-mark" aria-hidden="true">✦</span>{text(project.meta, locale)}</span>
          <span>{project.year}</span>
        </div>
        <h3>{text(project.title, locale)}</h3>
        <p>{text(project.summary, locale)}</p>
      </article>
    </a>
  );
}

function LabCard({ project, locale, delay }: { project: LabProject; locale: Locale; delay: number }) {
  const span = project.layout?.span ?? "single";
  const aspect = project.layout?.mediaAspect ?? "four-three";
  return (
    <div className={`lab-item span-${span} aspect-${aspect} reveal-on-scroll reveal-lab`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      <a href={`/lab/${project.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
        <article className={`lab-card ${project.presentation}`}>
          <div className="lab-frame">
            <div className="lab-media"><Media media={project.media} locale={locale} /></div>
          </div>
          <div className="work-meta">
            <span><span className="meta-mark" aria-hidden="true">✦</span>{text(project.meta, locale)}</span>
            <span>{project.year}</span>
          </div>
          <h3>{text(project.title, locale)}</h3>
          <p>{text(project.summary, locale)}</p>
        </article>
      </a>
    </div>
  );
}

type Tone = "default" | "accent" | "muted";

function Statement({ content, locale }: { content: SiteContent["about"]; locale: Locale }) {
  const source = text(content.statement, locale);
  const marks = [
    ...(content.accentPhrases ?? []).map((phrase) => ({ phrase: text(phrase, locale), tone: "accent" as Tone })),
    ...(content.mutedPhrases ?? []).map((phrase) => ({ phrase: text(phrase, locale), tone: "muted" as Tone })),
  ].filter(({ phrase }) => phrase.length > 0);

  const parts: Array<{ value: string; tone: Tone }> = [{ value: source, tone: "default" }];
  for (const mark of marks) {
    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      if (part.tone !== "default") continue;
      const offset = part.value.indexOf(mark.phrase);
      if (offset < 0) continue;
      parts.splice(index, 1,
        { value: part.value.slice(0, offset), tone: "default" },
        { value: mark.phrase, tone: mark.tone },
        { value: part.value.slice(offset + mark.phrase.length), tone: "default" },
      );
      break;
    }
  }

  return (
    <>
      {parts.filter(({ value }) => value).map((part, index) => (
        <span className={part.tone === "default" ? undefined : `statement-${part.tone}`} key={`${part.value}-${index}`}>{part.value}</span>
      ))}
    </>
  );
}

export function PortfolioSite({ content }: { content: SiteContent }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(`${content.preferences.storageKey}-locale`);
    if (stored === "zh" || stored === "en") return stored;
    return content.preferences.defaultLocale === "browser"
      ? (navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en")
      : content.preferences.defaultLocale;
  });
  const [dark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);
  const [stars, setStars] = useState<{left: number, top: number, size: number, delay: number}[]>([]);
  const [workStars, setWorkStars] = useState<{left: number, top: number, size: number, delay: number}[]>([]);
  const [decorStars, setDecorStars] = useState<{left: number, top: number, size: number, delay: number}[]>([]);
  const [cornerStars, setCornerStars] = useState<{left: number, top: number, size: number, delay: number}[]>([]);
  const [labStars, setLabStars] = useState<{left: number, top: number, size: number, delay: number}[]>([]);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    // 客户端生成星星位置
    const generateStars = (count: number, maxLeft = 100, maxTop = 100) => {
      return Array.from({length: count}, () => ({
        left: Math.random() * maxLeft,
        top: Math.random() * maxTop,
        size: 5 + Math.random() * 10,
        delay: Math.random() * 2,
      }));
    };
    setStars(generateStars(75));
    setWorkStars(generateStars(150));
    setDecorStars(generateStars(10, 120, 100));
    setCornerStars(generateStars(15, 150, 100));
    setLabStars(generateStars(30));
  }, []);
  const [activeSection, setActiveSection] = useState("work");
  const [labIndex, setLabIndex] = useState(0);
  const siteRoot = useRef<HTMLDivElement>(null);
  const heroSection = useRef<HTMLElement>(null);
  const headerSentinel = useRef<HTMLSpanElement>(null);
  const labRail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const localeKey = `${content.preferences.storageKey}-locale`;
    const themeKey = `${content.preferences.storageKey}-theme`;
    const storedLocale = window.localStorage.getItem(localeKey) as Locale | null;
    const storedTheme = window.localStorage.getItem(themeKey);
    const nextLocale = storedLocale === "zh" || storedLocale === "en"
      ? storedLocale
      : content.preferences.defaultLocale === "browser"
        ? navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en"
        : content.preferences.defaultLocale;
    const nextDark = storedTheme
      ? storedTheme === "dark"
      : content.preferences.defaultTheme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : content.preferences.defaultTheme === "dark";
    // Browser preferences are only available after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(nextLocale);
  }, [content.preferences]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.locale = locale;
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem(`${content.preferences.storageKey}-locale`, locale);
    window.localStorage.setItem(`${content.preferences.storageKey}-theme`, dark ? "dark" : "light");
  }, [content.preferences.storageKey, locale, dark]);

  useEffect(() => {
    const sentinel = headerSentinel.current;
    const hero = heroSection.current;
    if (!sentinel || !hero) return;

    const compactObserver = new IntersectionObserver(([entry]) => {
      setCompactHeader(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const heroObserver = new IntersectionObserver(([entry]) => {
      setShowTop(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { threshold: 0 });
    compactObserver.observe(sentinel);
    heroObserver.observe(hero);
    return () => {
      compactObserver.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = siteRoot.current;
    if (!root) return;
    const sections = root.querySelectorAll<HTMLElement>("#work, #lab, #about");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: "-38% 0px -60% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [content.lab.length]);

  useEffect(() => {
    const root = siteRoot.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>(".reveal-on-scroll");
    root.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -25% 0px", threshold: 0 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [content.work.length, content.lab.length]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", close);
    document.body.classList.add("menu-locked");
    return () => {
      document.removeEventListener("keydown", close);
      document.body.classList.remove("menu-locked");
    };
  }, [menuOpen]);

  const paletteStyle = useMemo(() => {
    const palette = dark ? content.palette.dark : content.palette.light;
    return {
      "--background": palette.background,
      "--foreground": palette.foreground,
      "--muted": palette.muted,
      "--muted-foreground": palette.mutedForeground,
      "--border": palette.border,
      "--accent": palette.accent,
      "--accent-foreground": palette.accentForeground,
      "--dark-band": palette.darkBand,
      "--dark-band-foreground": palette.darkBandForeground,
    } as CSSProperties;
  }, [content.palette, dark]);

  const resume = resumeHref(content, locale);
  const navItems = [
    { id: "work", label: content.navigation.work, href: "#work" },
    ...(content.lab.length ? [{ id: "lab", label: content.navigation.lab, href: "#lab" }] : []),
    { id: "about", label: content.navigation.about, href: "#about" },
  ];
  const activeIndex = Math.max(0, navItems.findIndex(({ id }) => id === activeSection));
  const goLab = (direction: -1 | 1) => {
    const rail = labRail.current;
    if (!rail || !content.lab.length) return;
    const next = Math.max(0, Math.min(content.lab.length - 1, labIndex + direction));
    setLabIndex(next);
    rail.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div className="site" style={paletteStyle} ref={siteRoot}>
      <header className={`header-shell${compactHeader ? " compact" : ""}${menuOpen ? " menu-open" : ""}`}>
        <div className="header-frame">
          <div className="header-bar">
            <a className="brand" href="#top" onClick={() => setMenuOpen(false)}><span aria-hidden="true">✦</span><span>{text(content.person.name, locale)}</span></a>
            <nav className="desktop-nav" aria-label="Primary" data-active={activeIndex}>
              <span className="nav-indicator" aria-hidden="true" />
              {navItems.map(({ id, label, href }) => <a className={id === activeSection ? "active" : undefined} href={href} key={href}><span>{text(label, locale)}</span></a>)}
            </nav>
            <div className="header-actions">
              <button className="round-control locale-control" onClick={() => setLocale(locale === "en" ? "zh" : "en")} aria-label={locale === "en" ? "切换为中文" : "Switch to English"}>
                {locale === "en" ? "中" : "EN"}
              </button>
              <a className="say-hi desktop-only" href={`mailto:${content.person.email}`}>{text(content.navigation.sayHi, locale)} <span aria-hidden="true">👋</span></a>
              <button className="menu-control" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={text(menuOpen ? content.navigation.close : content.navigation.menu, locale)}>
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-menu" aria-label="Mobile">
            {navItems.map(({ label, href }) => <a href={href} onClick={() => setMenuOpen(false)} key={href}>{text(label, locale)}</a>)}
            {resume && <a href={resume} onClick={() => setMenuOpen(false)}>{text(content.navigation.resume, locale)}</a>}
            <a className="mobile-say-hi" href={`mailto:${content.person.email}`} onClick={() => setMenuOpen(false)}>{text(content.navigation.sayHi, locale)} <ArrowUpRight size={18} /></a>
          </nav>
        )}
      </header>

      <main>
        <section className="hero" id="top" ref={heroSection} style={{ background: "#000", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
          <span className="header-sentinel" ref={headerSentinel} aria-hidden="true" />

          {/* 星星背景 */}
          {stars.map((star, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.delay}s`,
                color: "#d4b896",
                fontSize: `${star.size}px`,
                position: "absolute",
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              ✦
            </div>
          ))}

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "80px 20px 40px", background: "transparent" }}>
            {/* 独角兽GIF */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/unicorn-transparent.gif" alt="unicorn" style={{ width: "280px", marginBottom: "20px", position: "relative", zIndex: 3 }} />

            {/* 流星GIF背景 - 镜像 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/meteor.gif" alt="meteor" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", opacity: 0.4, zIndex: 0, mixBlendMode: "screen", pointerEvents: "none" }} />

            <h1 style={{
              color: "#c99aaa",
              fontSize: "4rem",
              fontFamily: "'Dancing Script', cursive",
              fontWeight: "700",
              marginBottom: "16px",
              textShadow: "1px 1px 0 rgba(201, 154, 170, 0.3), -1px -1px 0 rgba(201, 154, 170, 0.2), 0 0 10px rgba(201, 154, 170, 0.15)",
              filter: "contrast(1.1)",
            }}>
              Yixuan Guo
            </h1>

            <p style={{ color: "#f0e6d8", fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "30px", textAlign: "center", fontWeight: "bold", textShadow: "0 0 10px rgba(240, 230, 216, 0.5)" }}>
              产品 + 运营 + 创作<br />
              用视觉和视频讲好一个故事
            </p>

            <a href="#work" style={{
              display: "inline-block",
              color: "#f0e6d8",
              textDecoration: "none",
              fontSize: "1.1rem",
            }}>
              我的作品 ↓
            </a>
          </div>
        </section>

        {/* 星星背景 - 覆盖到作品部分，在内容后面 */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "200vh", zIndex: 0, pointerEvents: "none" }}>
          {workStars.map((star, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.delay}s`,
                color: "#d4b896",
                fontSize: `${star.size}px`,
              }}
            >
              ✦
            </div>
          ))}
        </div>

        <section className="work-section" id="work" style={{ position: "relative", zIndex: 1, background: "#000" }}>
          {/* 中间空白区域的两个装饰 */}
          <div style={{ position: "absolute", bottom: "20px", right: "20px", display: "flex", gap: "20px", zIndex: 2, pointerEvents: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/decor-1.png" alt="decor1" className="decor-sway" style={{ height: "180px", width: "auto", opacity: 0.9, mixBlendMode: "screen" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/decor-2.png" alt="decor2" className="decor-float" style={{ height: "120px", width: "auto", opacity: 0.9, mixBlendMode: "screen" }} />
            {/* 星星围绕两个图 */}
            {decorStars.map((star, i) => (
              <div
                key={i}
                className="star"
                style={{
                  position: "absolute",
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  color: "#d4b896",
                  fontSize: `${star.size}px`,
                  animationDelay: `${star.delay}s`,
                }}
              >
                ✦
              </div>
            ))}
          </div>
          <div className="section-inner work-inner">
            <div className="work-heading reveal-on-scroll reveal-heading">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span className="eyebrow">{text(content.sections.portfolioLabel, locale)}</span>
                  <h2 style={{ marginTop: "8px" }}>{text(content.sections.selectedWork, locale)}</h2>
                </div>
                <div style={{ position: "relative", top: "40px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/media/decor.png" alt="decor" className="decor-sway" style={{ width: "200px", opacity: 0.8, pointerEvents: "none" }} />
                  {/* 周围的小星星 */}
                  {cornerStars.map((star, i) => (
                    <div
                      key={i}
                      className="star"
                      style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        color: "#d4b896",
                        fontSize: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        position: "absolute",
                      }}
                    >
                      ✦
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ marginTop: "16px" }}>{text(content.sections.workIntro, locale)}</p>
            </div>
            <div className={`work-grid work-layout-${content.layout.work}`}>
              {content.work.map((project, index) => (
                <div className={`work-item span-${project.layout?.span ?? "single"} aspect-${project.layout?.mediaAspect ?? "four-three"} reveal-on-scroll reveal-work`} style={{ "--reveal-delay": `${(index % 2) * 100}ms` } as CSSProperties} key={project.slug}>
                  <WorkCard project={project} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {content.lab.length > 0 && (
          <section className="lab-section" id="lab" style={{ position: "relative" }}>
            {/* lab页星光 */}
            {labStars.map((star, i) => (
              <div
                key={i}
                className="star"
                style={{
                  position: "absolute",
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  color: "#d4b896",
                  fontSize: `${star.size}px`,
                  animationDelay: `${star.delay}s`,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                ✦
              </div>
            ))}
            <div className="section-inner lab-inner">
              <div className="lab-heading reveal-on-scroll reveal-heading">
                <div><span className="eyebrow">{text(content.navigation.lab, locale)}</span><h2><span>{text(content.sections.labTitle, locale)}</span><span>{text(content.sections.labAccent, locale)}</span></h2></div>
                <p>{text(content.sections.labIntro, locale)}</p>
              </div>
              <div className="work-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                {content.lab.map((project, index) => <LabCard key={project.slug} project={project} locale={locale} delay={(index % 3) * 100} />)}
              </div>
            </div>
          </section>
        )}

        <section className="about-section" id="about">
          <div className="section-inner about-inner reveal-on-scroll reveal-heading">
            <span className="eyebrow about-label">{text(content.sections.aboutLabel, locale)}</span>
            <div className="about-grid">
              <div className="about-statement">
                <h2><Statement content={content.about} locale={locale} /></h2>
              </div>
              <div className="about-copy">
                <div className="about-actions">
                  {resume && <a className="resume-button" href={resume} download>{text(content.sections.downloadResume, locale)} <Download size={15} /></a>}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact" style={{ position: "relative" }}>
        {/* 毕业照装饰 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/footer-decor.jpg" alt="graduation" style={{ position: "absolute", bottom: 0, right: "40px", height: "280px", mixBlendMode: "multiply", opacity: 0.9, pointerEvents: "none", zIndex: 1 }} />
        {/* 右侧装饰图 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/footer-decor-2.png" alt="decor" style={{ position: "absolute", top: "20px", right: "40px", height: "200px", mixBlendMode: "multiply", opacity: 0.8, pointerEvents: "none", zIndex: 1 }} />
        <div className="section-inner footer-inner" style={{ position: "relative", zIndex: 2 }}>
          <a className="hello reveal-on-scroll reveal-footer" href={`mailto:${content.person.email}`}>
            <span>{text(content.sections.sayHello, locale)}</span>
            <ArrowUpRight />
            {/* 两个小花在箭头右边 */}
            <img src="/media/footer-flower.png" alt="flower" style={{ height: "50px", marginLeft: "12px", verticalAlign: "middle" }} />
            <img src="/media/footer-flower.png" alt="flower" style={{ height: "50px", marginLeft: "8px", verticalAlign: "middle" }} />
            <span style={{ fontSize: "40px", marginLeft: "12px", verticalAlign: "middle" }}>🦄</span>
          </a>
          <div className="footer-details">
            <div><span>{text(content.sections.email, locale)}</span><a href={`mailto:${content.person.email}`}>{content.person.email}</a></div>
            <div><span>{locale === "zh" ? "电话" : "Phone"}</span><a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a></div>
            <div><span>{locale === "zh" ? "微信" : "WeChat"}</span><strong>{content.contact.wechat}</strong></div>
            <div><span>{text(content.sections.elsewhere, locale)}</span><div>{content.contact.socials.map((social) => <a href={social.href} target="_blank" rel="noreferrer" key={social.href}>{text(social.label, locale)}</a>)}</div></div>
            <div><span>{text(content.sections.basedIn, locale)}</span><strong>{text(content.person.location, locale)}</strong></div>
          </div>
          <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          <span>© 2026 {text(content.contact.copyrightName, locale)} · {text(content.contact.credit, locale)}</span>
          <span></span>
        </div>
        </div>
      </footer>

      <button className={`scroll-top${showTop ? " visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={text(content.sections.scrollTop, locale)}><ArrowUp size={19} /></button>
    </div>
  );
}
