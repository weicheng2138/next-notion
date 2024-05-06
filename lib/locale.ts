import "server-only";
import type { Locale } from "@/i18n-config";

const dictionaries = {
  "en-US": () =>
    import("@/dictionaries/en-US.json").then((module) => module.default),
  "zh-TW": () =>
    import("@/dictionaries/zh-TW.json").then((module) => module.default),
};

/**
 * Get the dictionary for the specified locale.
 * @param locale The locale to get the dictionary for. If the dictionary is not found, the default locale will be used.
 * @returns The dictionary for the specified locale.
 */
export const getDictionary = async (locale: Locale) => {
  // return the result and if the result is not found, return the default locale
  return await dictionaries[locale]().catch(() => dictionaries["en-US"]());
};
