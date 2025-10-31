import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

declare const process: {
  env?: Record<string, string | undefined>;
};

const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";

export default defineConfig({
  base: isGithubPages ? "/PrintTools/" : "/",
  plugins: [react()],
});
