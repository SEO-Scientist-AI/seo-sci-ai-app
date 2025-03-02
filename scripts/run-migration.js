const { execSync } = require("node:child_process");

const args = process.argv.slice(2);
const isLocal = args.includes("--local");
const fileArg = args.find((arg) => arg.startsWith("-f="));

if (!fileArg) {
  console.error("Error: -f argument is required");
  process.exit(1);
}

const file = fileArg.split("=")[1];

const command = isLocal
  ? `wrangler d1 execute seo-sci-ai-dev-db --local --file='${file}'`
  : `wrangler d1 execute seo-sci-ai-dev-db --remote --file='${file}'`;

try {
  execSync(command, { stdio: "inherit" });
} catch (error) {
  console.error("Error executing command:", error);
  process.exit(1);
}
