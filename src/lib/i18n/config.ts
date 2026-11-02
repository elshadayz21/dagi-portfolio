export const defaultLocale = "en" as const;

export const locales = ["en", "am", "or", "so", "sid"] as const;

export type Locale = (typeof locales)[number];

export interface LocaleMeta {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const localeDetails: Record<Locale, LocaleMeta> = {
  en: {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
    dir: "ltr",
  },
  am: {
    code: "am",
    label: "Amharic",
    nativeLabel: "አማርኛ",
    flag: "🇪🇹",
    dir: "ltr",
  },
  or: {
    code: "or",
    label: "Afaan Oromoo",
    nativeLabel: "Afaan Oromoo",
    flag: "🇪🇹",
    dir: "ltr",
  },
  so: {
    code: "so",
    label: "Somali",
    nativeLabel: "Soomaali",
    flag: "🇸🇴",
    dir: "ltr",
  },
  sid: {
    code: "sid",
    label: "Sidama",
    nativeLabel: "Sidaamu Afoo",
    flag: "🇪🇹",
    dir: "ltr",
  },
};
