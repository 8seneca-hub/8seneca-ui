import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "lucide-react"],
  banner: { js: '"use client";' },
  // The entry never imports the stylesheet (consumers import it themselves),
  // so it is copied rather than bundled.
  onSuccess: "cp src/styles.css dist/styles.css",
});
