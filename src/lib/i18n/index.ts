import { th } from "./th";
import { en } from "./en";

export type Locale = 'th' | 'en';

export const defaultLocale: Locale = 'th';
export const locales: Locale[] = ['th', 'en'];

// Static dictionaries for client-side access
export const dictionaries = {
    th,
    en,
};

// Dynamic Import for dictionaries (server-side)
const dynamicDictionaries = {
    th: () => import('./th').then((module) => module.th),
    en: () => import('./en').then((module) => module.en),
};

export const getDictionary = async (locale: Locale) => {
    if (!locales.includes(locale)) {
        return dynamicDictionaries[defaultLocale]();
    }
    return dynamicDictionaries[locale]();
};
