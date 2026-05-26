import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const TABS_FILE = join(process.cwd(), "src/data/custom-tabs.json");
function readTabs() {
  try {
    return JSON.parse(readFileSync(TABS_FILE, "utf-8"));
  } catch {
    return [];
  }
}
function writeTabs(tabs) {
  writeFileSync(TABS_FILE, JSON.stringify(tabs, null, 2), "utf-8");
}
const GET = async () => {
  return new Response(JSON.stringify(readTabs()), {
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  const { label, icon, href } = await request.json();
  if (!label?.trim() || !href?.trim()) {
    return new Response(JSON.stringify({ error: "Pola label i href są wymagane" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const tabs = readTabs();
  const newTab = { id: Date.now().toString(), label: label.trim(), icon: icon?.trim() || "", href: href.trim() };
  tabs.push(newTab);
  writeTabs(tabs);
  return new Response(JSON.stringify({ success: true, tab: newTab }), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
