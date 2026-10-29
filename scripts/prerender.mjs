/**
 * 构建后预渲染首屏：用无头浏览器加载 dist 产物，把渲染结果写回 index.html，
 * 让不执行 JS 的爬虫/生成式引擎直接拿到正文。失败只告警，不阻断构建。
 * 客户端在 main.tsx 里检测到 root 有内容时走 hydrateRoot。
 */
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";


const PORT = 4179;
const TARGET = `http://127.0.0.1:${PORT}/`;
const INDEX = new URL("../dist/index.html", import.meta.url);
const MARK = 'data-prerendered="1"';

const original = await readFile(INDEX, "utf8");

const vite = new URL("../node_modules/.bin/vite", import.meta.url).pathname;
const server = spawn(vite, ["preview", "--port", String(PORT), "--strictPort", "--host", "127.0.0.1"], { stdio: "ignore" });

let browser;
try {
  // 依赖缺失时（例如精简环境）按跳过处理，别让构建挂掉。
  const { default: puppeteer } = await import("puppeteer");
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(TARGET);
      if (res.ok) break;
    } catch {}
    await sleep(250);
  }

  const args = ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"];
  let executablePath = process.env.CHROME_PATH || undefined;
  // Vercel 的构建镜像缺 libnspr4，自带的 puppeteer Chrome 起不来；
  // 在 Linux 上换成随包分发、依赖更少的 @sparticuz/chromium。
  if (!executablePath && process.platform === "linux") {
    const { default: sparticuz } = await import("@sparticuz/chromium");
    executablePath = await sparticuz.executablePath();
    args.push(...sparticuz.args);
  }

  browser = await puppeteer.launch({ executablePath, args });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    window.__PRERENDER__ = true;
  });
  await page.goto(TARGET, { waitUntil: "networkidle2", timeout: 45_000 });
  await page.waitForSelector("#root > *", { timeout: 20_000 });
  // 等字体与首屏动效落定，避免把过渡中的状态写进 HTML。
  await page.evaluate(() => document.fonts.ready);
  await sleep(700);

  const html = await page.evaluate(() => {
    const root = document.getElementById("root");
    // Toaster 是挂载后按视口算出来的，静态快照里去掉，交给客户端重建。
    root?.querySelector("[data-sonner-toaster]")?.remove();
    const img = root?.querySelector("img");
    root?.setAttribute("data-prerendered", "1");
    if (img?.getAttribute("src")) root?.setAttribute("data-bg", img.getAttribute("src"));
    const text = root?.querySelector("[data-quote-text]")?.textContent;
    const from = root?.querySelector("[data-quote-from]")?.textContent;
    if (text) root?.setAttribute("data-quote", text);
    if (from) root?.setAttribute("data-quote-from", from);
    const pv = root?.querySelector("[data-site-pv]")?.textContent;
    const uv = root?.querySelector("[data-site-uv]")?.textContent;
    if (pv) {
      root?.setAttribute("data-site-pv", pv);
      root?.setAttribute("data-site-uv", uv ?? "0");
      root?.setAttribute("data-page-pv", pv);
    }
    return "<!doctype html>\n" + document.documentElement.outerHTML;
  });

  const filled = /<div id="root"[^>]*>[^<]*<|data-prerendered/.test(html) && html.length > original.length;
  if (!filled) throw new Error("预渲染结果为空");
  await writeFile(INDEX, html);
  console.log(`[prerender] ok ${html.length} bytes`);
} catch (error) {
  console.warn(`[prerender] skipped: ${error.message}`);
  await writeFile(INDEX, original);
} finally {
  await browser?.close();
  server.kill();
}
