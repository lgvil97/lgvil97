// Builds the SVG images used by README.md into assets/.
// Icons come from @lobehub/icons-static-svg (AI brands) and simple-icons
// (everything else) and are inlined, because GitHub renders README images
// through <img>, which cannot load anything external.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as si from 'simple-icons';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lobeDir = join(root, 'node_modules/@lobehub/icons-static-svg/icons');
const outDir = join(root, 'assets');

const C = {
  ground: '#0B1B3A',
  tile: '#152C55',
  ink: '#EAF2FF',
  soft: '#A9BEDF',
  accent: '#4EA8FF',
  trace: '#2C5DB8',
};
const FONT = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- colour helpers -------------------------------------------------------

function luminance(hex) {
  const v = hex.replace('#', '');
  const full = v.length === 3 ? [...v].map((c) => c + c).join('') : v;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const readable = (hex) => contrast(hex, C.tile) >= 3;

// --- icons ----------------------------------------------------------------

// Returns the inner markup of a 24x24 icon, recoloured to stay legible on a tile.
function lobe(id) {
  const colorFile = join(lobeDir, `${id}-color.svg`);
  if (existsSync(colorFile)) {
    const svg = readFileSync(colorFile, 'utf8');
    const hexes = [...svg.matchAll(/fill="(#[0-9a-fA-F]{3,6})"/g)].map((m) => m[1]);
    if (hexes.every(readable)) return inner(svg).replace(/currentColor/g, C.ink);
  }
  return `<g fill="${C.ink}">${inner(readFileSync(join(lobeDir, `${id}.svg`), 'utf8')).replace(/currentColor/g, C.ink)}</g>`;
}

function simple(slug) {
  const icon = si[`si${slug[0].toUpperCase()}${slug.slice(1)}`];
  if (!icon) throw new Error(`simple-icons has no ${slug}`);
  const fill = readable(`#${icon.hex}`) ? `#${icon.hex}` : C.ink;
  return `<path fill="${fill}" d="${icon.path}"/>`;
}

function inner(svg) {
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<title>[\s\S]*?<\/title>/, '');
}

// --- frame ----------------------------------------------------------------

function frame({ w, h, label, css = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<title>${esc(label)}</title>
<style>
  text { font-family: ${FONT}; }
  @keyframes rise { from { opacity: 0; transform: translateY(14px); } }
  .rise { animation: rise .7s cubic-bezier(.2,.7,.2,1) backwards; }
  ${css}
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
<rect width="${w}" height="${h}" rx="16" fill="${C.ground}"/>
${body}
</svg>
`;
}

// --- banner ---------------------------------------------------------------

function banner() {
  const phrases = [
    'I ship LLM agents to production.',
    'Multi-agent systems on Databricks.',
    'Self-hosted AI on zero-trust infra.',
    'RAG that cites its sources.',
    'From firmware in C to GenAI.',
  ];
  const cycle = phrases.length * 4;
  const share = 100 / phrases.length;
  // Each phrase types in, holds, then disappears while the next one starts.
  const css = `
  @keyframes type {
    0% { transform: scaleX(0); }
    ${(share * 0.45).toFixed(2)}% { transform: scaleX(1); }
    ${(share * 0.97).toFixed(2)}% { transform: scaleX(1); }
    ${share.toFixed(2)}%, 100% { transform: scaleX(0); }
  }
  .typer { transform-origin: 56px 0; transform: scaleX(0);
           animation: type ${cycle}s steps(36, end) infinite backwards; }`;

  const typed = phrases
    .map(
      (p, i) => `<clipPath id="t${i}"><rect class="typer" style="animation-delay:${i * 4}s" x="56" y="196" width="540" height="40"/></clipPath>
<text clip-path="url(#t${i})" x="56" y="224" font-size="24" font-weight="600" fill="${C.accent}">${esc(p)}</text>`,
    )
    .join('\n');

  // The agent graph is drawn as PCB traces: a supervisor "chip" routing to
  // its domain subagents, a nod to the embedded work that came first.
  const pads = [
    [130, 50, 704, 'Finance'],
    [140, 100, 724, 'HR'],
    [150, 150, 0, 'IoT'],
    [160, 200, 724, 'RTM'],
    [170, 250, 704, 'Docs'],
  ];
  // Outer traces turn first so none of them cross; corners are chamfered.
  const trace = ([pin, pad, turn]) => {
    if (pin === pad) return `M672 ${pin} H788`;
    const s = Math.sign(pad - pin);
    return `M672 ${pin} H${turn - 10} L${turn} ${pin + s * 10} V${pad - s * 10} L${turn + 10} ${pad} H788`;
  };
  const graph = `
<g fill="none" stroke="${C.trace}" stroke-width="3" stroke-linejoin="round">
  ${pads.map((p, i) => `<path id="tr${i}" d="${trace(p)}"/>`).join('\n  ')}
  ${[135, 150, 165].map((y) => `<path d="M584 ${y} H596"/>`).join(' ')}
  ${[614, 634, 654].map((x) => `<path d="M${x} 108 V120"/><path d="M${x} 180 V192"/>`).join(' ')}
</g>
<rect x="596" y="120" width="76" height="60" rx="6" fill="${C.tile}" stroke="${C.accent}" stroke-width="2"/>
<text x="634" y="155" text-anchor="middle" font-size="12" font-weight="700" fill="${C.ink}">Supervisor</text>
${pads
  .map(
    ([, y, , label]) => `<circle cx="800" cy="${y}" r="12" fill="${C.ground}" stroke="${C.accent}" stroke-width="3"/>
<circle cx="800" cy="${y}" r="4" fill="${C.accent}"/>
<text x="820" y="${y + 5}" font-size="14" font-weight="600" fill="${C.soft}">${esc(label)}</text>`,
  )
  .join('\n')}
${pads
  .map(
    (_, i) => `<circle r="4" fill="${C.ink}"><animateMotion dur="2.4s" begin="-${(i * 0.48).toFixed(2)}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#tr${i}"/></animateMotion></circle>`,
  )
  .join('\n')}`;

  return frame({
    w: 900,
    h: 290,
    label: 'Gerardo Vilchis, AI/ML Engineer and Data Scientist',
    css,
    body: `
<text x="56" y="120" font-size="58" font-weight="700" letter-spacing="-1.5" fill="${C.ink}">Gerardo Vilchis</text>
<text x="56" y="162" font-size="21" fill="${C.soft}">AI/ML Engineer · Data Scientist · León, Mexico</text>
${typed}
${graph}`,
  });
}

// --- impact numbers -------------------------------------------------------

function impact() {
  const items = [
    ['40+', 'countries where analysts', 'use my agent system'],
    ['8 yrs', 'of engineering, from', 'firmware to GenAI'],
    ['2×', 'Databricks certified,', 'ML and GenAI'],
    ['M.Sc.', 'in Computer Science,', 'completed 2023'],
  ];
  const body = items
    .map(
      ([n, a, b], i) => `<g class="rise" style="animation-delay:${(0.1 + i * 0.08).toFixed(2)}s">
  <text x="${56 + i * 210}" y="78" font-size="48" font-weight="700" letter-spacing="-1" fill="${C.accent}">${esc(n)}</text>
  <text x="${56 + i * 210}" y="112" font-size="16" fill="${C.ink}">${esc(a)}</text>
  <text x="${56 + i * 210}" y="134" font-size="16" fill="${C.soft}">${esc(b)}</text>
</g>`,
    )
    .join('\n');
  return frame({ w: 900, h: 170, label: 'analysts in 40+ countries use my multi-agent system; 8 years of engineering; 2 Databricks certifications; M.Sc. in Computer Science', body });
}

// --- career path ----------------------------------------------------------

function journey() {
  const stops = [
    ['2018', 'Computer vision', 'Automotive light-', 'guide inspection'],
    ['2019', 'Firmware & PCBs', 'Beacons and', 'industrial RFID'],
    ['2021', 'IoT freelance', 'LoRaWAN, LTE,', 'MQTT telemetry'],
    ['2022', 'Robotics', 'FPGA + neural nets,', 'ANA Avatar XPRIZE'],
    ['2023', 'Quant developer', 'DeFi strategies,', 'Singapore'],
    ['2024', 'AI/ML Engineer', 'GenAI in production', 'and self-hosted infra'],
  ];
  const x = (i) => 48 + i * 140;
  const last = stops.length - 1;
  const body = `
<path id="road" d="M${x(0)} 92 H852" fill="none" stroke="${C.trace}" stroke-width="3"/>
<path d="M842 84 L852 92 L842 100" fill="none" stroke="${C.trace}" stroke-width="3" stroke-linejoin="round"/>
<circle r="4" fill="${C.ink}"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#road"/></animateMotion></circle>
${stops
  .map(
    ([year, title, a, b], i) => `<g class="rise" style="animation-delay:${(0.1 + i * 0.09).toFixed(2)}s">
  <text x="${x(i)}" y="66" font-size="16" font-weight="700" fill="${C.accent}">${year}</text>
  <circle cx="${x(i) + 8}" cy="92" r="8" fill="${i === last ? C.accent : C.ground}" stroke="${C.accent}" stroke-width="3"/>
  <text x="${x(i)}" y="134" font-size="15" font-weight="700" fill="${C.ink}">${esc(title)}</text>
  <text x="${x(i)}" y="158" font-size="14" fill="${C.soft}">${esc(a)}</text>
  <text x="${x(i)}" y="178" font-size="14" fill="${C.soft}">${esc(b)}</text>
</g>`,
  )
  .join('\n')}`;
  return frame({ w: 900, h: 210, label: 'Career path from computer vision and firmware in 2018 to production GenAI in 2024', body });
}

// --- stack walls ----------------------------------------------------------

const L = (id, label) => ({ label, art: lobe(id) });
const S = (slug, label) => ({ label, art: simple(slug) });
const T = (text, label = text) => ({ label, text });

function wall(label, groups) {
  const left = 40;
  const tilesX = 214;
  const pitch = 72;
  const perRow = Math.floor((900 - tilesX - 24) / pitch);
  let y = 32;
  let n = 0;
  const parts = [];
  for (const [name, items] of groups) {
    const rows = Math.ceil(items.length / perRow);
    parts.push(`<text x="${left}" y="${y + 30}" font-size="17" font-weight="700" fill="${C.ink}">${esc(name)}</text>`);
    items.forEach((item, i) => {
      const tx = tilesX + (i % perRow) * pitch;
      const ty = y + Math.floor(i / perRow) * 88;
      const glyph = item.text
        ? `<text x="${tx + 25}" y="${ty + 30}" text-anchor="middle" font-size="${item.text.length > 3 ? 12 : 15}" font-weight="700" fill="${C.accent}">${esc(item.text)}</text>`
        : `<svg x="${tx + 12}" y="${ty + 12}" width="26" height="26" viewBox="0 0 24 24">${item.art}</svg>`;
      parts.push(`<g class="rise" style="animation-delay:${(0.05 + n++ * 0.015).toFixed(3)}s">
  <rect x="${tx}" y="${ty}" width="50" height="50" rx="12" fill="${C.tile}"/>
  ${glyph}
  <text x="${tx + 25}" y="${ty + 68}" text-anchor="middle" font-size="12" fill="${C.soft}">${esc(item.label)}</text>
</g>`);
    });
    y += rows * 88 + 18;
  }
  return frame({ w: 900, h: y + 8, label, body: parts.join('\n') });
}

function genaiStack() {
  return wall('GenAI stack: models, agent frameworks, coding agents and platforms', [
    ['Models', [
      L('claude', 'Claude'), L('openai', 'GPT'), L('gemini', 'Gemini'), L('meta', 'Llama'),
      L('qwen', 'Qwen'), L('deepseek', 'DeepSeek'), L('kimi', 'Kimi'), L('zhipu', 'GLM'),
    ]],
    ['Agent frameworks', [
      T('DSPy'), L('langgraph', 'LangGraph'), L('langchain', 'LangChain'), T('DA', 'Deep Agents'),
      L('crewai', 'CrewAI'), L('mcp', 'MCP'),
    ]],
    ['Coding agents', [
      L('claudecode', 'Claude Code'), L('codex', 'Codex'), L('opencode', 'OpenCode'),
      S('databricks', 'Genie Code'),
    ]],
    ['Platforms', [
      S('databricks', 'Databricks'), S('mlflow', 'MLflow'), L('azureai', 'Foundry'),
      L('azure', 'Azure'), L('aws', 'AWS'),
    ]],
  ]);
}

function engineeringStack() {
  return wall('Engineering stack: ML, languages, backend and infrastructure', [
    ['ML & data', [
      S('pytorch', 'PyTorch'), S('tensorflow', 'TensorFlow'), S('keras', 'Keras'),
      S('scikitlearn', 'scikit-learn'), S('opencv', 'OpenCV'), S('numpy', 'NumPy'),
      S('pandas', 'pandas'), S('plotly', 'Plotly'),
    ]],
    ['Languages', [
      S('python', 'Python'), T('SQL'), S('gnubash', 'Bash'), S('typescript', 'TypeScript'),
      S('c', 'C'), S('cplusplus', 'C++'), S('go', 'Go'),
    ]],
    ['Backend & data', [
      S('fastapi', 'FastAPI'), S('flask', 'Flask'), S('streamlit', 'Streamlit'), S('react', 'React'),
      S('postgresql', 'Postgres'), S('mysql', 'MySQL'), S('mongodb', 'MongoDB'), S('redis', 'Redis'),
    ]],
    ['Infra', [
      S('docker', 'Docker'), S('linux', 'Linux'), S('hetzner', 'Hetzner'), S('coolify', 'Coolify'),
      S('tailscale', 'Tailscale'), S('cloudflare', 'Cloudflare'), S('opentofu', 'OpenTofu'),
      S('ansible', 'Ansible'), T('SOPS'),
    ]],
  ]);
}

// --- certifications -------------------------------------------------------

function cert(title) {
  const body = `<g class="rise">
<rect x="28" y="34" width="64" height="64" rx="14" fill="${C.tile}"/>
<svg x="44" y="50" width="32" height="32" viewBox="0 0 24 24">${simple('databricks')}</svg>
<text x="116" y="52" font-size="15" fill="${C.soft}">Databricks Certified</text>
<text x="116" y="80" font-size="19" font-weight="700" fill="${C.ink}">${esc(title)}</text>
<text x="116" y="108" font-size="14" font-weight="600" fill="${C.accent}">Valid 2026–2028 · Verify credential →</text>
</g>`;
  return frame({ w: 440, h: 132, label: `Databricks Certified ${title}`, body });
}

// --- write ----------------------------------------------------------------

mkdirSync(outDir, { recursive: true });
const files = {
  'banner.svg': banner(),
  'impact.svg': impact(),
  'journey.svg': journey(),
  'genai-stack.svg': genaiStack(),
  'engineering-stack.svg': engineeringStack(),
  'cert-ml-professional.svg': cert('Machine Learning Professional'),
  'cert-genai-associate.svg': cert('Generative AI Engineer Associate'),
};
for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(outDir, name), svg);
  console.log(`assets/${name}`);
}
