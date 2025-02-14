const esbuild = require("esbuild");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Keep track of connected clients
const clients = [];

async function startDevServer() {
  // Create esbuild context
  const ctx = await esbuild.context({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/smartformio.js",
    format: "esm",
    platform: "browser",
    sourcemap: true,
  });

  // Create HTTP server
  const server = http.createServer((req, res) => {
    const { url } = req;

    // Handle SSE connections
    if (url === "/esbuild") {
      return handleSSE(req, res);
    }

    // Serve static files
    handleStaticFiles(req, res);
  });

  // Start server
  server.listen(3000, () => {
    console.log("Development server running on http://localhost:3000");
  });

  // Watch for file changes
  const srcDir = path.join(process.cwd(), "src");
  fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
    if (filename) {
      try {
        // Rebuild the project
        await ctx.rebuild();
        console.log(`Rebuilt after change in ${filename}`);

        // Notify all connected clients
        notifyClients();
      } catch (error) {
        console.error("Build failed:", error);
      }
    }
  });

  // Initial build
  await ctx.rebuild();
  console.log("Initial build complete");
  console.log("Watching for changes...");
}

function handleSSE(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Send initial connection message
  res.write("data: connected\n\n");

  // Add client to list
  clients.push(res);

  // Remove client when connection closes
  req.on("close", () => {
    clients.splice(clients.indexOf(res), 1);
  });
}

function notifyClients() {
  clients.forEach((client) => {
    client.write("data: reload\n\n");
  });
}

function handleStaticFiles(req, res) {
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(process.cwd(), filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("File not found");
      return;
    }

    const ext = path.extname(filePath);
    const contentType =
      {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
      }[ext] || "text/plain";

    // Inject live reload script for HTML files
    if (ext === ".html") {
      content = Buffer.from(
        content.toString().replace(
          "</body>",
          `
        <script>
          const evtSource = new EventSource('/esbuild');
          evtSource.onmessage = function(event) {
            if (event.data === 'reload') {
              console.log('Reloading page...');
              location.reload();
            }
          };
        </script>
        </body>
        `
        )
      );
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
}

startDevServer().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
