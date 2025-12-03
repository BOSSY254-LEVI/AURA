import { type Express } from "express";
import { createServer as createViteServer, createLogger, type InlineConfig } from "vite";
import { type Server } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a custom logger that matches Vite's logger interface
const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { 
      server, 
      path: "/vite-hmr" 
    },
    allowedHosts: true as const,
  };

  try {
    // Try to load vite.config from client directory
    const clientDir = path.join(__dirname, "..", "..", "client");
    let viteConfig: any = {};

    const viteConfigPath = path.join(clientDir, "vite.config.ts");
    if (fs.existsSync(viteConfigPath)) {
      try {
        // Dynamically import the config
        const configModule = await import(`file://${viteConfigPath}?t=${Date.now()}`);
        viteConfig = configModule.default || {};
      } catch (error) {
        console.warn("Could not load vite.config.ts, using defaults:", error);
      }
    }

    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      root: clientDir,
      customLogger: {
        ...viteLogger,
        error: (msg, options) => {
          viteLogger.error(msg, options);
          // Don't exit process in dev mode, just log
          console.error("[Vite Error]", msg);
        },
      },
      server: serverOptions,
      appType: "custom" as const,
      // Add plugins explicitly if needed
      plugins: viteConfig.plugins || [],
    } as InlineConfig);

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      // Skip API routes and static files
      if (url.startsWith("/api") || url.includes(".")) {
        return next();
      }

      try {
        const clientTemplate = path.join(clientDir, "index.html");

        // Check if file exists
        if (!fs.existsSync(clientTemplate)) {
          console.error(`Index.html not found at: ${clientTemplate}`);
          return res.status(404).send("Client index.html not found");
        }

        // Always reload the index.html file from disk in case it changes
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        
        // Add cache busting for dev mode
        if (process.env.NODE_ENV !== "production") {
          template = template.replace(
            `src="/src/main.tsx"`,
            `src="/src/main.tsx?v=${nanoid()}"`
          );
        }
        
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        console.error("Error serving page:", e);
        
        // Fix stack trace for Vite errors
        if ((e as any).stack && vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e as Error);
        }
        
        // Don't crash on single request error
        if (res.headersSent) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        } else {
          res.status(500).send(`
            <html>
              <body>
                <h1>Error loading page</h1>
                <pre>${(e as Error).message}</pre>
                <button onclick="window.location.reload()">Retry</button>
              </body>
            </html>
          `);
        }
      }
    });

    console.log("✅ Vite dev server setup complete");
    return vite;
  } catch (error) {
    console.error("❌ Failed to setup Vite server:", error);
    throw error;
  }
}