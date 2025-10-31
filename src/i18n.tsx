import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "ja";

const translations = {
  en: {
    brand: "PrintTools",
    navHome: "Home",
    navImageTiler: "Image Tile Printing",
    languageSwitchAria: "Toggle language between Japanese and English",
    notFoundTitle: "Page not found",
    notFoundMessage: "The requested page does not exist.",
    notFoundBackHome: "Back to home",
    homeTitle: "Welcome to PrintTools",
    homeIntro1:
      "PrintTools is an experimental project that delivers print utilities right in your browser.",
    homeIntro2: "At the moment you can repeat a single image across a sheet such as A4 or Letter.",
    homeIntro3: "Choose a feature from the navigation bar above to get started.",
    imageTilingTitle: "Image Tile Printing",
    imageTilingLede:
      "Load an image, adjust the paper and tile settings, and print directly from your browser.",
    localProcessingNotice: "All images stay in your browser and are never uploaded to any server.",
    imageSectionLegend: "Image",
    imageChooseFile: "Select an image file",
    imageLoaded: "Image loaded. Review the preview before printing.",
    imagePending: "No image has been loaded yet.",
    paperSectionLegend: "Paper",
    paperSizeLabel: "Size",
    paperOrientationLabel: "Orientation",
    paperOrientationPortrait: "Portrait",
    paperOrientationLandscape: "Landscape",
    paperMarginLabel: "Margin (mm)",
    paperCustomWidth: "Width (mm)",
    paperCustomHeight: "Height (mm)",
    tileSectionLegend: "Tiles",
    tileWidthLabel: "Width (mm)",
    tileHeightLabel: "Height (mm)",
    tileLockAspect: "Lock image aspect ratio",
    tileSpacingLabel: "Spacing between tiles (mm)",
    tilesSummary: "Columns {{columns}} × Rows {{rows}} = {{total}} tiles",
    printButton: "Print",
    settingsPanelAria: "Settings panel",
    previewAriaLabel: "Print preview",
    previewImageAlt: "Tile preview image",
    previewPlaceholder: "Preview will appear here.",
    tipsTitle: "Printing tips",
    tipsActualSize: "Choose 'Actual size' or 'Do not scale to fit paper' in the print dialog.",
    tipsDefaultScale: "Keep the scaling at 'default' or '100%' so the layout is not resized.",
    tipsNoMargin: "Set the printer or browser margins to 'none' to use the full sheet when possible.",
    tipsPrinterMarginWarning: "Printer margin limitations may still prevent true borderless printing.",
    tipsPaperMatch: "Ensure the paper size selected in the browser matches the printer settings.",
    paperLabelA5: "A5 (148 × 210 mm)",
    paperLabelA4: "A4 (210 × 297 mm)",
    paperLabelA3: "A3 (297 × 420 mm)",
    paperLabelLetter: "US Letter (215.9 × 279.4 mm)",
    paperLabelLegal: "US Legal (215.9 × 355.6 mm)",
    paperLabelCustom: "Custom",
  },
  ja: {
    brand: "PrintTools",
    navHome: "ホーム",
    navImageTiler: "画像タイル印刷",
    languageSwitchAria: "日本語と英語を切り替えます",
    notFoundTitle: "ページが見つかりません",
    notFoundMessage: "指定されたページは存在しません。",
    notFoundBackHome: "ホームに戻る",
    homeTitle: "PrintTools へようこそ",
    homeIntro1: "PrintTools はブラウザだけで印刷用のツールを提供する実験的なプロジェクトです。",
    homeIntro2: "現在は単一の画像を A4 や Letter などの用紙いっぱいにタイル配置できます。",
    homeIntro3: "上部のナビゲーションから機能を選択してください。",
    imageTilingTitle: "画像タイル印刷",
    imageTilingLede: "画像を読み込み、用紙とタイルを調整してブラウザから印刷できます。",
  localProcessingNotice: "選択した画像はブラウザ内だけで処理され、サーバーに送信されることはありません。",
    imageSectionLegend: "画像",
    imageChooseFile: "画像ファイルを選択",
    imageLoaded: "画像を読み込みました。プレビューで確認してください。",
    imagePending: "まだ画像が読み込まれていません。",
    paperSectionLegend: "用紙",
    paperSizeLabel: "サイズ",
    paperOrientationLabel: "向き",
    paperOrientationPortrait: "縦",
    paperOrientationLandscape: "横",
    paperMarginLabel: "余白 (mm)",
    paperCustomWidth: "幅 (mm)",
    paperCustomHeight: "高さ (mm)",
    tileSectionLegend: "タイル",
    tileWidthLabel: "幅 (mm)",
    tileHeightLabel: "高さ (mm)",
    tileLockAspect: "画像の縦横比を維持",
    tileSpacingLabel: "タイル間の余白 (mm)",
    tilesSummary: "横 {{columns}} × 縦 {{rows}} = 合計 {{total}} 枚",
    printButton: "印刷する",
    settingsPanelAria: "設定パネル",
    previewAriaLabel: "印刷プレビュー",
    previewImageAlt: "印刷画像",
    previewPlaceholder: "ここにプレビューが表示されます。",
    tipsTitle: "印刷時のヒント",
    tipsActualSize: "ブラウザの印刷ダイアログでは「実際のサイズ」「用紙に合わせて縮小なし」を選択してください。",
    tipsDefaultScale: "倍率は「規定」または「100%」に設定し、拡大・縮小が入らないようにしてください。",
    tipsNoMargin: "プリンターまたはブラウザの印刷設定で余白を「なし」にすると紙いっぱいに印刷しやすくなります。",
    tipsPrinterMarginWarning: "プリンターの余白設定によっては、完全な縁なし印刷ができない場合があります。",
    tipsPaperMatch: "異なる用紙サイズを利用する場合は、用紙設定とプリンター側の用紙指定が一致しているか確認してください。",
    paperLabelA5: "A5 (148 × 210 mm)",
    paperLabelA4: "A4 (210 × 297 mm)",
    paperLabelA3: "A3 (297 × 420 mm)",
    paperLabelLetter: "US Letter (215.9 × 279.4 mm)",
    paperLabelLegal: "US Legal (215.9 × 355.6 mm)",
    paperLabelCustom: "カスタム",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

type TranslationVariables = Record<string, string | number>;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, variables?: TranslationVariables) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "printtools:language";

function formatTranslation(template: string, variables?: TranslationVariables) {
  if (!variables) {
    return template;
  }

  return Object.entries(variables).reduce((text, [token, value]) => {
    const pattern = new RegExp(`{{\\s*${token}\\s*}}`, "g");
    return text.replace(pattern, String(value));
  }, template);
}

function resolveInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "en" || stored === "ja") {
    return stored;
  }

  const primaryLanguage = navigator.languages?.[0] ?? navigator.language;
  if (primaryLanguage?.toLowerCase().startsWith("ja")) {
    return "ja";
  }

  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => resolveInitialLanguage());

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const translate = (key: TranslationKey, variables?: TranslationVariables) => {
      const catalogue = translations[language];
      const template = catalogue[key] ?? key;
      return formatTranslation(template, variables);
    };

    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === "ja" ? "en" : "ja")),
      t: translate,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return context;
}

export type { Language };
