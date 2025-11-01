import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { useI18n } from "../i18n";
import "./ImageTilingPrint.css";

const MM_PER_INCH = 25.4;
const CSS_DPI = 96;

const PAPER_PRESETS = [
  { id: "a5", labelKey: "paperLabelA5", width: 148, height: 210 },
  { id: "a4", labelKey: "paperLabelA4", width: 210, height: 297 },
  { id: "a3", labelKey: "paperLabelA3", width: 297, height: 420 },
  { id: "letter", labelKey: "paperLabelLetter", width: 215.9, height: 279.4 },
  { id: "legal", labelKey: "paperLabelLegal", width: 215.9, height: 355.6 },
  { id: "custom", labelKey: "paperLabelCustom", width: 210, height: 297 },
] as const;

type PaperPresetId = (typeof PAPER_PRESETS)[number]["id"];

type Orientation = "portrait" | "landscape";

function mmToPixels(mm: number) {
  return (mm / MM_PER_INCH) * CSS_DPI;
}

export default function ImageTilingPrint() {
  const { t } = useI18n();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageAspect, setImageAspect] = useState<number | null>(null);
  const [paperPreset, setPaperPreset] = useState<PaperPresetId>("a4");
  const [customWidth, setCustomWidth] = useState(210);
  const [customHeight, setCustomHeight] = useState(297);
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [marginMm, setMarginMm] = useState(10);
  const [tileWidthMm, setTileWidthMm] = useState(50);
  const [tileHeightMm, setTileHeightMm] = useState(50);
  const [tileSpacingMm, setTileSpacingMm] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const activePaper = PAPER_PRESETS.find((preset) => preset.id === paperPreset) ?? PAPER_PRESETS[1];

  const baseWidth = paperPreset === "custom" ? customWidth : activePaper.width;
  const baseHeight = paperPreset === "custom" ? customHeight : activePaper.height;

  const pageWidthMm = orientation === "portrait" ? baseWidth : baseHeight;
  const pageHeightMm = orientation === "portrait" ? baseHeight : baseWidth;

  const cappedMargin = Math.min(marginMm, pageWidthMm / 2, pageHeightMm / 2);
  const usableWidthMm = Math.max(0, pageWidthMm - cappedMargin * 2);
  const usableHeightMm = Math.max(0, pageHeightMm - cappedMargin * 2);

  const effectiveTileWidthMm = Math.max(1, tileWidthMm);
  const effectiveTileHeightMm = lockAspect && imageAspect
    ? Math.max(1, effectiveTileWidthMm / Math.max(imageAspect, 0.01))
    : Math.max(1, tileHeightMm);

  const spacingMm = Math.max(0, tileSpacingMm);

  const tilesPerRow = Math.max(
    1,
    Math.floor((usableWidthMm + spacingMm) / (effectiveTileWidthMm + spacingMm))
  );
  const tilesPerColumn = Math.max(
    1,
    Math.floor((usableHeightMm + spacingMm) / (effectiveTileHeightMm + spacingMm))
  );

  const totalTiles = tilesPerRow * tilesPerColumn;

  const tileIndices = useMemo(() => Array.from({ length: totalTiles }, (_, index) => index), [
    totalTiles,
  ]);

  const tilesSummary = t("tilesSummary", {
    columns: tilesPerRow,
    rows: tilesPerColumn,
    total: totalTiles,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const previewSizing = useMemo(() => {
    const widthPx = mmToPixels(pageWidthMm);
    const heightPx = mmToPixels(pageHeightMm);
    const viewportLimit = Math.max(320, viewportWidth - 48);
    const maxWidthPx = Math.min(640, viewportLimit);
    const baseWidthPx = Math.max(widthPx, 1);
    const previewWidthPx = Math.min(baseWidthPx, maxWidthPx);
    const scale = previewWidthPx / baseWidthPx;
    const pixelsPerMm = mmToPixels(1) * scale;

    return {
      widthPx,
      heightPx,
      previewWidthPx,
      previewHeightPx: heightPx * scale,
      scale,
      pixelsPerMm,
      marginPx: pixelsPerMm * cappedMargin,
      tileWidthPx: pixelsPerMm * effectiveTileWidthMm,
      tileHeightPx: pixelsPerMm * effectiveTileHeightMm,
      tileSpacingPx: pixelsPerMm * spacingMm,
      aspectRatio: `${pageWidthMm} / ${pageHeightMm}`,
    };
  }, [
    cappedMargin,
    effectiveTileHeightMm,
    effectiveTileWidthMm,
    pageHeightMm,
    pageWidthMm,
    spacingMm,
    viewportWidth,
  ]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageUrl(result);
      }
    };
    reader.readAsDataURL(file);

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageAspect(img.width / img.height);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  };

  const displayedTileHeight = lockAspect && imageAspect
    ? Number((effectiveTileWidthMm / Math.max(imageAspect, 0.01)).toFixed(2))
    : tileHeightMm;

  useEffect(() => {
    if (!lockAspect || !imageAspect) {
      return;
    }

    const nextHeight = effectiveTileWidthMm / Math.max(imageAspect, 0.01);
    if (Math.abs(nextHeight - tileHeightMm) > 0.05) {
      setTileHeightMm(Number(nextHeight.toFixed(2)));
    }
  }, [effectiveTileWidthMm, imageAspect, lockAspect, tileHeightMm]);

  const handleTileWidthBlur = () => {
    if (!lockAspect || !imageAspect) {
      return;
    }

    const nextHeight = effectiveTileWidthMm / Math.max(imageAspect, 0.01);
    setTileHeightMm(Number(nextHeight.toFixed(2)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="page">
      <header className="page__header">
        <h1>{t("imageTilingTitle")}</h1>
        <p className="page__lede">{t("imageTilingLede")}</p>
      </header>

      <p className="page__note" role="note">
        {t("localProcessingNotice")}
      </p>

      <div className="layout">
        <aside className="controls" aria-label={t("settingsPanelAria")}>
          <fieldset className="controls__group">
            <legend>{t("imageSectionLegend")}</legend>
            <label className="controls__file">
              <span>{t("imageChooseFile")}</span>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            <p className="controls__status">
              {imageUrl ? t("imageLoaded") : t("imagePending")}
            </p>
          </fieldset>

          <fieldset className="controls__group">
            <legend>{t("paperSectionLegend")}</legend>
            <label className="controls__field">
              <span>{t("paperSizeLabel")}</span>
              <select
                value={paperPreset}
                onChange={(event) => setPaperPreset(event.target.value as PaperPresetId)}
              >
                {PAPER_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {t(preset.labelKey)}
                  </option>
                ))}
              </select>
            </label>

            {paperPreset === "custom" && (
              <div className="controls__grid controls__grid--two">
                <label className="controls__field">
                  <span>{t("paperCustomWidth")}</span>
                  <input
                    type="number"
                    min={50}
                    value={customWidth}
                    onChange={(event) => setCustomWidth(Number(event.target.value))}
                  />
                </label>
                <label className="controls__field">
                  <span>{t("paperCustomHeight")}</span>
                  <input
                    type="number"
                    min={50}
                    value={customHeight}
                    onChange={(event) => setCustomHeight(Number(event.target.value))}
                  />
                </label>
              </div>
            )}

            <div className="controls__grid controls__grid--two">
              <label className="controls__field">
                <span>{t("paperOrientationLabel")}</span>
                <select
                  value={orientation}
                  onChange={(event) => setOrientation(event.target.value as Orientation)}
                >
                  <option value="portrait">{t("paperOrientationPortrait")}</option>
                  <option value="landscape">{t("paperOrientationLandscape")}</option>
                </select>
              </label>
              <label className="controls__field">
                <span>{t("paperMarginLabel")}</span>
                <input
                  type="number"
                  min={0}
                  value={marginMm}
                  onChange={(event) => setMarginMm(Number(event.target.value))}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="controls__group">
            <legend>{t("tileSectionLegend")}</legend>
            <div className="controls__grid controls__grid--two">
              <label className="controls__field">
                <span>{t("tileWidthLabel")}</span>
                <input
                  type="number"
                  min={5}
                  value={tileWidthMm}
                  onChange={(event) => setTileWidthMm(Number(event.target.value))}
                  onBlur={handleTileWidthBlur}
                />
              </label>
              <label className="controls__field">
                <span>{t("tileHeightLabel")}</span>
                <input
                  type="number"
                  min={5}
                  value={displayedTileHeight}
                  onChange={(event) => setTileHeightMm(Number(event.target.value))}
                  disabled={lockAspect && !!imageUrl}
                />
              </label>
            </div>

            <label className="controls__field controls__checkbox">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(event) => setLockAspect(event.target.checked)}
                disabled={!imageAspect}
              />
              <span>{t("tileLockAspect")}</span>
            </label>

            <label className="controls__field">
              <span>{t("tileSpacingLabel")}</span>
              <input
                type="number"
                min={0}
                value={tileSpacingMm}
                onChange={(event) => setTileSpacingMm(Number(event.target.value))}
              />
            </label>

            <p className="controls__summary" role="status">
              {tilesSummary}
            </p>
          </fieldset>

          <button
            type="button"
            className="button button--primary"
            onClick={handlePrint}
            disabled={!imageUrl}
          >
            {t("printButton")}
          </button>
        </aside>

        <section className="preview" aria-label={t("previewAriaLabel")}>
          <div
            className="preview__page"
            style={{
              width: `${previewSizing.previewWidthPx}px`,
              height: `${previewSizing.previewHeightPx}px`,
              aspectRatio: previewSizing.aspectRatio,
              ["--page-width-mm" as any]: `${pageWidthMm}`,
              ["--page-height-mm" as any]: `${pageHeightMm}`,
              ["--page-margin-mm" as any]: `${cappedMargin}`,
            }}
          >
            <div
              className="preview__page-inner"
              style={{
                width: `${previewSizing.previewWidthPx}px`,
                height: `${previewSizing.previewHeightPx}px`,
                padding: `${previewSizing.marginPx}px`,
                position: "relative",
                overflow: "hidden",
                transformOrigin: "top left",
                ["--tile-width" as any]: `${previewSizing.tileWidthPx}px`,
                ["--tile-height" as any]: `${previewSizing.tileHeightPx}px`,
                ["--tile-gap" as any]: `${previewSizing.tileSpacingPx}px`,
                ["--tile-width-print" as any]: `${effectiveTileWidthMm}mm`,
                ["--tile-height-print" as any]: `${effectiveTileHeightMm}mm`,
                ["--tile-gap-print" as any]: `${spacingMm}mm`,
                ["--tiles-per-row" as any]: `${tilesPerRow}`,
              }}
            >
              {imageUrl ? (
                <div className="preview__grid">
                  {tileIndices.map((tile: number) => (
                    <figure className="preview__tile" key={tile}>
                      <img src={imageUrl} alt={t("previewImageAlt")} />
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="preview__placeholder">{t("previewPlaceholder")}</div>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="notes">
        <h2>{t("tipsTitle")}</h2>
        <ul>
          <li>{t("tipsActualSize")}</li>
          <li>{t("tipsDefaultScale")}</li>
          <li>{t("tipsNoMargin")}</li>
          <li>{t("tipsPrinterMarginWarning")}</li>
          <li>{t("tipsPaperMatch")}</li>
        </ul>
      </section>
    </section>
  );
}
