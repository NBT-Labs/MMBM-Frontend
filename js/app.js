// Fetches site config from the MMBM-Backend public API and fills in the
// Home page. No build step, no framework: plain fetch + DOM updates.

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}

function setHtml(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value || "";
}

function showLink(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  if (url) {
    el.href = url;
    el.hidden = false;
  } else {
    el.hidden = true;
  }
}

function showRow(rowId, textId, value) {
  const row = document.getElementById(rowId);
  if (!row) return;
  if (value) {
    setText(textId, value);
    row.hidden = false;
  } else {
    row.hidden = true;
  }
}

function showError(message) {
  const banner = document.getElementById("error-banner");
  if (!banner) return;
  banner.textContent = message;
  banner.hidden = false;
}

async function loadConfig() {
  const url = `${API_BASE_URL}/api/mmbm/config`;
  let config;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    config = await res.json();
  } catch (err) {
    console.error("Failed to load site config from", url, err);
    showError(
      "Couldn't load site content from the backend. Is the Odoo server " +
        `running at ${API_BASE_URL}? (${err.message})`
    );
    return;
  }

  // Header / hero
  setText("org-name", config.org_name);
  setText("hero-org-name", config.org_name);
  setText("tagline", config.tagline);
  setHtml("welcome-text", config.welcome_text);
  setText("footer-org-name", config.org_name);

  // Mission
  setHtml("mission-statement", config.mission_statement);

  // About
  setHtml("history", config.history);
  setHtml("org-structure", config.org_structure);
  setText("president-name", config.president_name);
  setHtml("president-message", config.president_message);
  setHtml("vision-objectives", config.vision_objectives);

  // Links
  showLink("donation-cta", config.donation_link);
  showLink("hindu-calendar-link", config.hindu_calendar_link);
  showLink("chanting-link", config.chanting_join_link);

  // Contact
  showRow("contact-email-row", "contact-email", config.contact_email);
  if (config.contact_email) {
    document.getElementById("contact-email").href = `mailto:${config.contact_email}`;
  }
  showRow("contact-phone-row", "contact-phone", config.contact_phone);
  showRow("contact-address-row", "contact-address", config.contact_address);
}

document.getElementById("footer-year").textContent = new Date().getFullYear();
loadConfig();
