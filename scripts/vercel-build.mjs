import { execSync } from "node:child_process";

/**
 * Core build orchestration logic with dependency injection for unit testing.
 *
 * @param {Object} options
 * @param {NodeJS.ProcessEnv} options.env - Environment variables
 * @param {(cmd: string) => void} options.runCmd - Function to execute a shell command
 * @param {(msg: string) => void} options.log - Logging function
 */
export function executeVercelBuild({
  env = process.env,
  runCmd = (cmd) => execSync(cmd, { stdio: "inherit" }),
  log = console.log,
} = {}) {
  // 1. Always generate Prisma client artifacts
  log("[vercel-build] Step 1/3: Generating Prisma client...");
  runCmd("npx prisma generate");

  // 2. Conditionally apply database migrations ONLY for production releases
  const vercelEnv = env.VERCEL_ENV;
  if (vercelEnv === "production") {
    log(
      "[vercel-build] Step 2/3: Production deployment detected (VERCEL_ENV=production). Executing prisma migrate deploy..."
    );
    runCmd("npx prisma migrate deploy");
  } else {
    log(
      `[vercel-build] Step 2/3: Skipping automatic Prisma migrations for non-production environment (VERCEL_ENV=${vercelEnv || "none/preview"}).\n` +
      "[vercel-build] To protect production and preview database isolation, automatic migrations are only executed during production releases.\n" +
      "[vercel-build] Apply migrations to preview/development databases via manual or isolated migration pipelines."
    );
  }

  // 3. Build Next.js application bundle
  log("[vercel-build] Step 3/3: Building Next.js application...");
  runCmd("npx next build");

  log("[vercel-build] Build procedure completed successfully.");
}

// Direct execution entrypoint when run as a standalone script
const isMainModule =
  process.argv[1] &&
  (process.argv[1].endsWith("vercel-build.mjs") ||
    process.argv[1].endsWith("vercel-build.js"));

if (isMainModule) {
  try {
    executeVercelBuild();
  } catch (error) {
    console.error("[vercel-build] Build failed:", error?.message || error);
    process.exit(1);
  }
}
