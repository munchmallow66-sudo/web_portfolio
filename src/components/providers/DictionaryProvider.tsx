"use client";

import React, { createContext, useContext } from 'react';
import { Dictionary } from '@/lib/i18n/th';
import { Locale, defaultLocale } from '@/lib/i18n';

interface DictionaryContextType {
    dict: Dictionary;
    lang: Locale;
}

const DictionaryContext = createContext<DictionaryContextType | null>(null);

export function DictionaryProvider({
    children,
    dict,
    lang,
}: {
    children: React.ReactNode;
    dict: Dictionary;
    lang: Locale;
}) {
    return (
        <DictionaryContext.Provider value={{ dict, lang }}>
            {children}
        </DictionaryContext.Provider>
    );
}

export function useDictionary() {
    const context = useContext(DictionaryContext);
    if (!context) {
        throw new Error('useDictionary must be used within a DictionaryProvider');
    }
    return context;
}
