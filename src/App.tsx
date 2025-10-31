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
  return (
    <BrowserRouter>
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
