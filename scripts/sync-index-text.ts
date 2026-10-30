/**
 * 用同一份 site-links 数据生成 llms.txt 与 index.html 的 <noscript> 索引。
 * 两边都靠手写迟早会漏——都由 `bun run build` 前置执行。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { linkGroups } from "../src/data/site-links";
import { siteConfig } from "../src/lib/config";

const START = "<!-- noscript:start -->";
const END = "<!-- noscript:end -->";

const head = `${siteConfig.siteAuthor} 的个人主页：写代码、搭服务，偶尔写点东西。下面是博客、自建小工具、开源项目、看番入口和朋友站的索引。`;

const llms = `# ${siteConfig.siteName} (https://${siteConfig.siteUrl}/)

> ${head}页面在构建时预渲染，正文与链接都在 HTML 里。

## 站点

- 名称：${siteConfig.siteName}
- 作者：${siteConfig.siteAuthor}
- 地址：https://${siteConfig.siteUrl}/
- 语言：zh-CN
- 起始：2023-01-06

## 关于

${siteConfig.siteAuthor}，写代码、搭服务，偶尔写点东西。最近在写视觉小说站和东方 TH14 的浏览器移植。这个页面是个人入口的索引，大部分子域自建、跑在自己的机器上，在线状态见监控页。

${linkGroups
  .map(
    (group) =>
      `## ${group.title}\n\n${group.intro}\n\n${group.links
        .map((item) => `- ${item.name}：${item.link} — ${item.desc}`)
        .join("\n")}`,
  )
  .join("\n\n")}

## 联系

- Telegram：https://t.me/AsunaNarusaka
- 邮箱：i@saop.cc
- GitHub：https://github.com/AdingApkgg
`;

const noscript = `${START}
      <h1>${siteConfig.siteName}</h1>
      <p>${head}</p>
      <ul>
${linkGroups
  .flatMap((group) => group.links)
  .map((item) => `        <li><a href="${item.link}">${item.name}</a> — ${item.desc}</li>`)
  .join("\n")}
      </ul>
    ${END}`;

writeFileSync(new URL("../public/llms.txt", import.meta.url), llms);

const indexPath = new URL("../index.html", import.meta.url);
const html = readFileSync(indexPath, "utf8");
const pattern = new RegExp(`${START}[\\s\\S]*${END}`);
if (!pattern.test(html)) throw new Error("index.html 里找不到 noscript 标记");
writeFileSync(indexPath, html.replace(pattern, noscript));

console.log(`[index-text] llms.txt + noscript：${linkGroups.flatMap((g) => g.links).length} 条`);
