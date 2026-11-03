import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname, "../demo-recordings");
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, "screenshots");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runDemo() {
  console.log("====================================================");
  console.log("Starting Full Browser Walkthrough & Video Recording");
  console.log("====================================================");

  const browser = await chromium.launch({
    channel: "msedge",
    headless: true, // headless browser captures crisp video & screenshots
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  console.log("\n--- PART 1: PUBLIC WEB PLATFORM ---");

  // 1. Home Page
  console.log("1. Recording Home Page (/en)...");
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle" });
  await sleep(1500);

  // Demonstrate floating socials hover on left
  try {
    const wa = page.locator('aside[aria-label="Direct Contact Channels"] a[title="Chat on WhatsApp"]');
    if (await wa.isVisible()) {
      await wa.hover();
      await sleep(800);
    }
  } catch (e) {}

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "01_home_page.png"), fullPage: false });

  // Scroll down to show features and tractors
  await page.evaluate(() => window.scrollBy({ top: 700, behavior: "smooth" }));
  await sleep(1200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "01b_home_inventory_scroll.png"), fullPage: false });

  // 2. Tractor Catalog Page
  console.log("2. Recording Tractor Inventory (/en/products)...");
  await page.goto(`${BASE_URL}/en/products`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "02_tractor_catalog.png"), fullPage: false });

  // 3. Tractor Details Page
  console.log("3. Recording Product Details (/en/products/massey-ferguson-385-4wd)...");
  await page.goto(`${BASE_URL}/en/products/massey-ferguson-385-4wd`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "03_product_detail.png"), fullPage: false });

  // 4. Field Gallery Page
  console.log("4. Recording Field Gallery (/en/gallery)...");
  await page.goto(`${BASE_URL}/en/gallery`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "04_field_gallery.png"), fullPage: false });

  // Scroll to bottom of gallery to show the simplified "Want to Get in Touch?" contact section
  await page.evaluate(() => window.scrollBy({ top: 900, behavior: "smooth" }));
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "04b_gallery_contact_bottom.png"), fullPage: false });

  // 5. Service Areas / Regional Hubs Filtering Page
  console.log("5. Recording Service Areas with Hub & Region Filters (/en/service-areas)...");
  await page.goto(`${BASE_URL}/en/service-areas`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "05_service_areas_all.png"), fullPage: false });

  // Filter by Oromia region
  try {
    const oromiaBtn = page.getByRole("button", { name: "Oromia", exact: false }).first();
    if (await oromiaBtn.isVisible()) {
      await oromiaBtn.click();
      await sleep(800);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "05b_service_areas_oromia.png"), fullPage: false });
    }
  } catch (e) {}

  // 6. Dynamic Location Landing (Adama)
  console.log("6. Recording Dynamic Local SEO Landing (/en/locations/tractors-adama)...");
  await page.goto(`${BASE_URL}/en/locations/tractors-adama`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "06_dynamic_location_adama.png"), fullPage: false });

  // 7. Animated 404 Page
  console.log("7. Recording Animated 404 Tractor Page (/en/page-not-found-demo)...");
  await page.goto(`${BASE_URL}/en/page-not-found-demo`, { waitUntil: "networkidle" });
  await sleep(2000); // allow tractor exhaust animation to play
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "07_animated_404_tractor.png"), fullPage: false });

  console.log("\n--- PART 2: BACKOFFICE ADMIN TABS ---");

  // Tab 1: Dashboard
  console.log("8. Recording Backoffice: Dashboard (/admin/dashboard)...");
  await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "08_admin_dashboard.png"), fullPage: false });

  // Tab 2: Leads & CRM Notes History
  console.log("9. Recording Backoffice: CRM Leads & Inquiries (/admin/leads)...");
  await page.goto(`${BASE_URL}/admin/leads`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "09_admin_leads_crm.png"), fullPage: false });

  // Tab 3: Products / Tractors
  console.log("10. Recording Backoffice: Tractor Inventory (/admin/products)...");
  await page.goto(`${BASE_URL}/admin/products`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "10_admin_products.png"), fullPage: false });

  // Tab 4: Categories Manager
  console.log("11. Recording Backoffice: Categories Manager (/admin/categories)...");
  await page.goto(`${BASE_URL}/admin/categories`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "11_admin_categories.png"), fullPage: false });

  // Tab 5: Regional Locations & Hubs (Adama, Bishoftu, Bahir Dar, Mekele)
  console.log("12. Recording Backoffice: Regional Locations & Hubs (/admin/locations)...");
  await page.goto(`${BASE_URL}/admin/locations`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "12_admin_locations.png"), fullPage: false });

  // Tab 6: Representative Profile
  console.log("13. Recording Backoffice: Representative Profile (/admin/profile)...");
  await page.goto(`${BASE_URL}/admin/profile`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "13_admin_profile.png"), fullPage: false });

  // Tab 7: SEO & Meta Settings
  console.log("14. Recording Backoffice: SEO & Meta Settings (/admin/seo)...");
  await page.goto(`${BASE_URL}/admin/seo`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "14_admin_seo.png"), fullPage: false });

  // Tab 8: CMS Translations (5 Languages)
  console.log("15. Recording Backoffice: CMS Translations (/admin/translations)...");
  await page.goto(`${BASE_URL}/admin/translations`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "15_admin_translations.png"), fullPage: false });

  // Tab 9: Media Manager & Assets (Table/List View, Multi-Category Checkbox Filters)
  console.log("16. Recording Backoffice: Media Manager & Assets (/admin/media)...");
  await page.goto(`${BASE_URL}/admin/media`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "16_admin_media_grid.png"), fullPage: false });

  // Toggle Table View
  try {
    const tableToggle = page.locator('button[title="Table view"], button:has-text("Table")').first();
    if (await tableToggle.isVisible()) {
      await tableToggle.click();
      await sleep(1000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "16b_admin_media_table_view.png"), fullPage: false });
    }
  } catch (e) {}

  // Tab 10: Field Gallery CMS
  console.log("17. Recording Backoffice: Field Gallery & Videos CMS (/admin/gallery)...");
  await page.goto(`${BASE_URL}/admin/gallery`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "17_admin_gallery.png"), fullPage: false });

  // Tab 11: Activity & Audit Log
  console.log("18. Recording Backoffice: Activity & Audit Log (/admin/activity)...");
  await page.goto(`${BASE_URL}/admin/activity`, { waitUntil: "networkidle" });
  await sleep(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "18_admin_activity.png"), fullPage: false });

  // Final wrap-up
  console.log("\nClosing browser and finalizing video file...");
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  let videoPath = null;
  if (video) {
    videoPath = await video.path();
    console.log(`\n>>> VIDEO RECORDING SAVED SUCCESSFULLY: ${videoPath}`);
  }

  const screenshots = fs.readdirSync(SCREENSHOTS_DIR).filter((f) => f.endsWith(".png"));
  console.log(`>>> ${screenshots.length} HD SCREENSHOTS SAVED IN: ${SCREENSHOTS_DIR}`);
  console.log("====================================================");
  console.log("DEMO RECORDING COMPLETE!");
  console.log("====================================================");
}

runDemo().catch((err) => {
  console.error("Error during demo recording:", err);
  process.exit(1);
});
