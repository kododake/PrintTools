import { BrowserRouter, Link, NavLink, Outlet, Route, Routes } from "react-router-dom";

import "./App.css";
import { Language, useI18n } from "./i18n";
import Home from "./pages/Home";
import ImageTilingPrint from "./pages/ImageTilingPrint";

const LANGUAGE_LABEL: Record<Language, string> = {
  en: "English / 日本語",
  ja: "日本語 / English",
};

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="image-tiler" element={<ImageTilingPrint />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function AppLayout() {
  const { t, toggleLanguage, language } = useI18n();
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : undefined;

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          {t("brand")}
        </Link>
        <div className="app-header__actions">
          <a
            className="app-header__github"
            href="https://github.com/kododake/PrintTools"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("githubLinkAria")}
            title={t("githubLinkLabel")}
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
              width="20"
              height="20"
            >
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
                -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
                0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27
                1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8"
              />
            </svg>
            <span className="visually-hidden">{t("githubLinkLabel")}</span>
          </a>
          <nav className="app-nav">
            <NavLink to="/" end className={navClass}>
              {t("navHome")}
            </NavLink>
            <NavLink to="/image-tiler" className={navClass}>
              {t("navImageTiler")}
            </NavLink>
          </nav>
          <button
            type="button"
            className="language-toggle"
            onClick={toggleLanguage}
            aria-label={t("languageSwitchAria")}
          >
            {LANGUAGE_LABEL[language]}
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

function NotFound() {
  const { t } = useI18n();

  return (
    <section className="page page--center">
      <h1>{t("notFoundTitle")}</h1>
      <p>
        {t("notFoundMessage")}{" "}
        <Link to="/">{t("notFoundBackHome")}</Link>
      </p>
    </section>
  );
}
