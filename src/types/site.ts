export type Locale = "en" | "zh";

export type LocalizedText = Record<Locale, string>;

export type MediaAsset = {
  src: string;
  type: "image" | "video";
  alt: LocalizedText;
  poster?: string;
  objectPosition?: string;
  href?: string;
  size?: "normal" | "small" | "wide";
};

export type WorkLayout = "balanced-grid" | "feature-first" | "editorial-stack";
export type LabLayout = "phone-gallery" | "mixed-grid" | "showcase";
export type ProjectSpan = "single" | "wide";
export type MediaAspect = "four-three" | "wide" | "square";

export type ProjectSection = {
  title: LocalizedText;
  description: LocalizedText;
  media: MediaAsset[];
  layout?: "grid" | "masonry";
};

export type Project = {
  slug: string;
  title: LocalizedText;
  meta: LocalizedText;
  summary: LocalizedText;
  detailSummary?: LocalizedText;
  tools?: LocalizedText;
  year: string;
  media: MediaAsset;
  gallery?: MediaAsset[];
  sections?: ProjectSection[];
  externalLinks?: SocialLink[];
  layout?: {
    span?: ProjectSpan;
    mediaAspect?: MediaAspect;
  };
  detailBackground?: string;
};

export type LabProject = Project & {
  presentation: "phone" | "card";
};

export type SocialLink = {
  label: LocalizedText;
  href: string;
};

export type PaletteTokens = {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  accent: string;
  accentForeground: string;
  darkBand: string;
  darkBandForeground: string;
};

export type SiteContent = {
  typography: {
    adobeWebProject?: {
      stylesheetUrl: string;
      fontFamily: string;
    };
  };
  preferences: {
    storageKey: string;
    defaultLocale: Locale | "browser";
    defaultTheme: "light" | "dark" | "system";
  };
  layout: {
    work: WorkLayout;
    lab: LabLayout;
  };
  person: {
    name: LocalizedText;
    role: LocalizedText;
    support: LocalizedText;
    email: string;
    location: LocalizedText;
  };
  navigation: {
    work: LocalizedText;
    lab: LocalizedText;
    about: LocalizedText;
    resume: LocalizedText;
    sayHi: LocalizedText;
    menu: LocalizedText;
    close: LocalizedText;
    themeLight: LocalizedText;
    themeDark: LocalizedText;
  };
  sections: {
    portfolioLabel: LocalizedText;
    selectedWork: LocalizedText;
    workIntro: LocalizedText;
    labTitle: LocalizedText;
    labAccent: LocalizedText;
    labIntro: LocalizedText;
    aboutLabel: LocalizedText;
    viewWork: LocalizedText;
    aboutMe: LocalizedText;
    sayHello: LocalizedText;
    downloadResume: LocalizedText;
    email: LocalizedText;
    elsewhere: LocalizedText;
    basedIn: LocalizedText;
    scrollTop: LocalizedText;
  };
  hero: MediaAsset & { overlay: number };
  work: Project[];
  lab: LabProject[];
  about: {
    statement: LocalizedText;
    accentPhrases?: LocalizedText[];
    mutedPhrases?: LocalizedText[];
  };
  resume: {
    mode: "shared" | "localized" | "hidden";
    shared?: string;
    en?: string;
    zh?: string;
  };
  contact: {
    phone: string;
    wechat: string;
    socials: SocialLink[];
    copyrightName: LocalizedText;
    credit: LocalizedText;
  };
  palette: {
    id: string;
    light: PaletteTokens;
    dark: PaletteTokens;
  };
};
