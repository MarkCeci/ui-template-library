import { NextRequest, NextResponse } from "next/server";
import { Vibrant } from "node-vibrant/node";

type Palette = {
  vibrant: string;
  muted: string;
  darkVibrant: string;
  darkMuted: string;
  lightVibrant: string;
  lightMuted: string;
  averageColor: string;
};

const fallbackPalette: Palette = {
  vibrant: "#6D28D9",
  muted: "#64748B",
  darkVibrant: "#312E81",
  darkMuted: "#334155",
  lightVibrant: "#C4B5FD",
  lightMuted: "#E2E8F0",
  averageColor: "#F8FAFC",
};

type WeightedColor = {
  color: string;
  weight: number;
  source: string;
};

type RenderedCapture = {
  html: string;
  title: string;
  description: string;
  text: string;
  screenshotPreview?: string;
  domColors: WeightedColor[];
  imageColors: WeightedColor[];
  ok: boolean;
  error?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url?: string };
    const target = normalizeUrl(body.url);

    if (!target) {
      return NextResponse.json({ error: "请输入有效的网站地址。" }, { status: 400 });
    }

    const rendered = await captureRenderedPage(target.href);
    const html = rendered.html || (await fetchText(target.href));
    const title = rendered.title || extractTitle(html) || target.hostname;
    const description =
      rendered.description || extractMetaDescription(html) || "从目标网站提取的视觉风格草稿。";
    const cssText = await fetchLinkedStyles(html, target);
    const sourceColors = rankColors([...extractColors(html), ...extractColors(cssText)]).map((color) => ({
      color,
      weight: 1,
      source: "css",
    }));
    const colors = rankWeightedColors([...rendered.domColors, ...rendered.imageColors, ...sourceColors]);
    const palette = buildPalette(colors);
    const keywords = inferVisualKeywords(
      `${html}\n${cssText}\n${rendered.text}`,
      palette,
      target.hostname,
      rendered.domColors,
    );

    return NextResponse.json({
      url: target.href,
      host: target.hostname.replace(/^www\./, ""),
      title,
      description,
      palette,
      colors: colors.slice(0, 12),
      keywords,
      screenshotPreview: rendered.screenshotPreview,
      captureMethod: rendered.ok ? "rendered-screenshot" : "html-css-fallback",
      captureNote: rendered.ok
        ? "已渲染真实首屏并结合可见区域颜色生成主题。"
        : `未能渲染真实页面，已降级为源码解析。${rendered.error ? `原因：${rendered.error}` : ""}`,
      capturedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "网站解析失败。";
    return NextResponse.json(
      {
        error: message.includes("fetch failed")
          ? "目标网站暂时无法抓取。你可以改用截图上传方式。"
          : message,
      },
      { status: 500 },
    );
  }
}

async function captureRenderedPage(url: string): Promise<RenderedCapture> {
  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      colorScheme: "light",
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 22_000 });
    await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => null);
    await page.waitForTimeout(1800);

    const pageData = await page.evaluate(() => {
      const normalizeRgb = (value: string) => {
        const match = value.match(/rgba?\(([^)]+)\)/i);
        if (!match) return null;
        const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
        if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) return null;
        const alpha = parts[3] ?? 1;
        if (alpha < 0.08) return null;
        const [r, g, b] = parts.map((part) => Math.max(0, Math.min(255, Math.round(part))));
        return `#${[r, g, b].map((part) => part.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
      };

      const readMeta = (selector: string) =>
        document.querySelector<HTMLMetaElement>(selector)?.content?.trim() || "";
      const viewportArea = Math.max(1, window.innerWidth * window.innerHeight);
      const selectors = [
        "body",
        "header",
        "nav",
        "main",
        "section",
        "footer",
        "article",
        "aside",
        "a",
        "button",
        "h1",
        "h2",
        "h3",
        "p",
        "li",
        "[class*='hero' i]",
        "[class*='banner' i]",
        "[class*='nav' i]",
        "[class*='menu' i]",
        "[class*='logo' i]",
        "[class*='tab' i]",
      ];
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(","))).slice(0, 900);
      const domColors: WeightedColor[] = [];

      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        if (rect.bottom <= 0 || rect.right <= 0 || rect.top >= window.innerHeight || rect.left >= window.innerWidth) {
          continue;
        }
        const style = window.getComputedStyle(node);
        if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) < 0.08) continue;
        const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const areaRatio = Math.max(0.002, Math.min(1, (visibleWidth * visibleHeight) / viewportArea));
        const tag = node.tagName.toLowerCase();
        const className = String(node.className || "").toLowerCase();
        const semanticBoost =
          tag === "body"
            ? 16
            : tag === "header" || tag === "nav"
              ? 12
              : className.includes("hero") || className.includes("banner")
                ? 10
                : className.includes("logo") || tag === "a" || tag === "button"
                  ? 5
                  : 1;
        const background = normalizeRgb(style.backgroundColor);
        const color = normalizeRgb(style.color);
        const border = normalizeRgb(style.borderTopColor);
        if (background) domColors.push({ color: background, weight: areaRatio * 90 * semanticBoost, source: "visible-background" });
        if (color) domColors.push({ color, weight: Math.max(1, areaRatio * 25 * semanticBoost), source: "visible-text" });
        if (border) domColors.push({ color: border, weight: Math.max(0.5, areaRatio * 8), source: "visible-border" });
      }

      return {
        html: document.documentElement.outerHTML.slice(0, 800_000),
        title: document.title || "",
        description:
          readMeta("meta[name='description']") ||
          readMeta("meta[property='og:description']") ||
          readMeta("meta[name='twitter:description']"),
        text: document.body?.innerText?.slice(0, 100_000) || "",
        domColors,
      };
    });

    const screenshot = await page.screenshot({ type: "jpeg", quality: 72, fullPage: false });
    await browser.close();

    const imageColors = await extractImagePalette(screenshot);

    return {
      ...pageData,
      screenshotPreview: `data:image/jpeg;base64,${screenshot.toString("base64")}`,
      imageColors,
      ok: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message.split("\n")[0] : "浏览器渲染失败";
    return {
      html: "",
      title: "",
      description: "",
      text: "",
      domColors: [],
      imageColors: [],
      ok: false,
      error: message,
    };
  }
}

async function extractImagePalette(image: Buffer): Promise<WeightedColor[]> {
  try {
    const swatches = await Vibrant.from(image).getPalette();
    return Object.entries(swatches)
      .map(([source, swatch]) => (swatch?.hex ? { color: expandHex(swatch.hex), weight: 18, source: `screenshot-${source}` } : null))
      .filter(Boolean) as WeightedColor[];
  } catch {
    return [];
  }
}

function normalizeUrl(value?: string) {
  if (!value) return null;
  const raw = value.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url;
  } catch {
    return null;
  }
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/css;q=0.8,*/*;q=0.7",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`目标网站返回 ${response.status}，暂时无法解析。`);
  }

  const text = await response.text();
  return text.slice(0, 800_000);
}

async function fetchLinkedStyles(html: string, baseUrl: URL) {
  const hrefs = Array.from(html.matchAll(/<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi))
    .map((match) => match[0].match(/href=["']([^"']+)["']/i)?.[1])
    .filter(Boolean)
    .slice(0, 5) as string[];

  const css = await Promise.all(
    hrefs.map(async (href) => {
      try {
        const url = new URL(href, baseUrl);
        if (!["http:", "https:"].includes(url.protocol)) return "";
        return await fetchText(url.href);
      } catch {
        return "";
      }
    }),
  );

  return css.join("\n").slice(0, 800_000);
}

function extractTitle(html: string) {
  return decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
}

function extractMetaDescription(html: string) {
  const match =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i) ||
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  return decodeHtml(match?.[1]?.trim() || "");
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function extractColors(text: string) {
  const hex = Array.from(text.matchAll(/#[0-9a-fA-F]{3,8}\b/g)).map((match) => expandHex(match[0]));
  const rgb = Array.from(text.matchAll(/rgba?\(([^)]+)\)/gi))
    .map((match) => rgbToHex(match[1]))
    .filter(Boolean) as string[];
  return [...hex, ...rgb].filter((color) => isUsefulColor(color));
}

function rankColors(colors: string[]) {
  const counts = new Map<string, number>();
  colors.forEach((color) => counts.set(color, (counts.get(color) || 0) + 1));

  return Array.from(counts.entries())
    .sort((a, b) => {
      const saturationGap = getSaturation(b[0]) - getSaturation(a[0]);
      if (Math.abs(saturationGap) > 0.12) return saturationGap;
      return b[1] - a[1];
    })
    .map(([color]) => color);
}

function rankWeightedColors(items: WeightedColor[]) {
  const counts = new Map<string, { weight: number; sources: Set<string> }>();
  items.forEach((item) => {
    const color = expandHex(item.color);
    if (!isUsefulColor(color)) return;
    const current = counts.get(color) || { weight: 0, sources: new Set<string>() };
    current.weight += Math.max(0.2, item.weight);
    current.sources.add(item.source);
    counts.set(color, current);
  });

  return Array.from(counts.entries())
    .sort((a, b) => {
      const aScore = getVisualScore(a[0], a[1].weight, a[1].sources);
      const bScore = getVisualScore(b[0], b[1].weight, b[1].sources);
      return bScore - aScore;
    })
    .map(([color]) => color);
}

function getVisualScore(color: string, weight: number, sources: Set<string>) {
  const lum = getLuminance(color);
  const sat = getSaturation(color);
  const renderedBoost = Array.from(sources).some((source) => source.startsWith("visible") || source.startsWith("screenshot"))
    ? 2.4
    : 1;
  const darkThemeBoost = lum < 0.18 ? 1.55 : 1;
  const accentBoost = sat > 0.18 && lum > 0.08 && lum < 0.82 ? 1.3 : 1;
  return weight * renderedBoost * darkThemeBoost * accentBoost;
}

function buildPalette(colors: string[]): Palette {
  const darkBase = colors.find((color) => getLuminance(color) > 0.006 && getLuminance(color) < 0.18);
  const warmAccent = colors.find((color) => isWarmLuxuryColor(color));
  const vibrant =
    warmAccent ||
    colors.find((color) => getSaturation(color) > 0.35 && getLuminance(color) > 0.1 && getLuminance(color) < 0.82) ||
    fallbackPalette.vibrant;
  const muted =
    colors.find((color) => getSaturation(color) <= 0.38 && getLuminance(color) > 0.18 && getLuminance(color) < 0.72) ||
    (warmAccent ? mix(warmAccent, "#6B625A", 0.52) : fallbackPalette.muted);
  const darkVibrant =
    darkBase ||
    colors.find((color) => getSaturation(color) > 0.22 && getLuminance(color) < 0.26) ||
    darken(vibrant, 0.48);
  const darkMuted =
    colors.find((color) => getSaturation(color) <= 0.42 && getLuminance(color) > 0.01 && getLuminance(color) < 0.28) ||
    darken(muted, 0.35);
  const lightVibrant =
    colors.find((color) => getSaturation(color) > 0.16 && getLuminance(color) > 0.7) ||
    lighten(vibrant, warmAccent ? 0.62 : 0.48);
  const lightMuted =
    colors.find((color) => getSaturation(color) <= 0.32 && getLuminance(color) > 0.72) ||
    (warmAccent ? "#F5EFE8" : lighten(muted, 0.54));
  const averageColor = darkBase && warmAccent ? darkBase : colors.find((color) => getLuminance(color) > 0.45 && getLuminance(color) < 0.9) || "#F8FAFC";

  return { vibrant, muted, darkVibrant, darkMuted, lightVibrant, lightMuted, averageColor };
}

function inferVisualKeywords(text: string, palette: Palette, host: string, domColors: WeightedColor[] = []) {
  const source = text.toLowerCase();
  const keywords = new Set<string>();
  const primary = palette.vibrant;
  const lum = getLuminance(primary);
  const sat = getSaturation(primary);
  const hasDarkSurface = [palette.darkVibrant, palette.darkMuted, palette.averageColor].some((color) => getLuminance(color) < 0.18);
  const hasWarmAccent = [palette.vibrant, palette.muted, palette.lightVibrant].some((color) => isWarmLuxuryColor(color));
  const visibleText = domColors.map((item) => item.color).join(" ");

  if (source.includes("gradient") || source.includes("linear-gradient")) keywords.add("渐变");
  if (source.includes("blur") || source.includes("backdrop-filter")) keywords.add("玻璃感");
  if (source.includes("dashboard") || source.includes("analytics")) keywords.add("数据看板");
  if (source.includes("ai") || source.includes("copilot")) keywords.add("科技 AI");
  if (source.includes("pricing") || source.includes("enterprise")) keywords.add("企业 SaaS");
  if (lum < 0.22) keywords.add("深色高级");
  if (sat < 0.22) keywords.add("克制中性");
  if (sat > 0.55) keywords.add("高识别主色");
  if (hasDarkSurface && hasWarmAccent) keywords.add("黑金轻奢");
  if (/beauty|cosmetic|aesthetic|skin|medical|美容|医美|会长|品牌|fashion/.test(source)) keywords.add("美业品牌");
  if (/bank|finance|pay|capital|invest/.test(host)) keywords.add("金融可信");
  if (/health|medical|care|clinic/.test(host)) keywords.add("医疗健康");
  if (visibleText.includes("#")) keywords.add("真实首屏");

  return Array.from(keywords).slice(0, 6);
}

function isWarmLuxuryColor(color: string) {
  const hue = getHue(color);
  const sat = getSaturation(color);
  const lum = getLuminance(color);
  return hue >= 18 && hue <= 58 && sat > 0.12 && lum > 0.08 && lum < 0.78;
}

function expandHex(color: string) {
  const raw = color.replace("#", "");
  if (raw.length === 3) return `#${raw.split("").map((char) => char + char).join("")}`.toUpperCase();
  return `#${raw.slice(0, 6)}`.toUpperCase();
}

function rgbToHex(value: string) {
  const parts = value.split(",").map((part) => Number.parseFloat(part.trim()));
  if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) return null;
  const [r, g, b] = parts.map((part) => Math.max(0, Math.min(255, Math.round(part))));
  return `#${[r, g, b].map((part) => part.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function isUsefulColor(color: string) {
  const normalized = expandHex(color);
  const lum = getLuminance(color);
  if (lum < 0.004 || lum > 0.992) return false;
  return !["#000000", "#FFFFFF", "#TRANSP"].includes(normalized);
}

function getSaturation(color: string) {
  const { r, g, b } = hexToRgb(color);
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === 0) return 0;
  return (max - min) / max;
}

function getHue(color: string) {
  const { r, g, b } = hexToRgb(color);
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue = 0;
  if (max === red) hue = ((green - blue) / delta) % 6;
  if (max === green) hue = (blue - red) / delta + 2;
  if (max === blue) hue = (red - green) / delta + 4;
  return Math.round(hue * 60 + (hue < 0 ? 360 : 0));
}

function getLuminance(color: string) {
  const { r, g, b } = hexToRgb(color);
  const convert = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * convert(r) + 0.7152 * convert(g) + 0.0722 * convert(b);
}

function hexToRgb(color: string) {
  const normalized = expandHex(color);
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

function mix(color: string, target: string, amount: number) {
  const a = hexToRgb(color);
  const b = hexToRgb(target);
  const channel = (start: number, end: number) => Math.round(start * (1 - amount) + end * amount);
  return `#${[channel(a.r, b.r), channel(a.g, b.g), channel(a.b, b.b)]
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

function lighten(color: string, amount: number) {
  return mix(color, "#FFFFFF", amount);
}

function darken(color: string, amount: number) {
  return mix(color, "#000000", amount);
}
