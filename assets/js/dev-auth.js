/**
 * Client-side gate for the developer zone.
 * Not real server auth — pair with a private GitHub repo for actual secrecy.
 *
 * Default password: mansion-dev
 * To change it: hash the new password (SHA-256 hex) and replace PASSWORD_HASH.
 * PowerShell:
 *   $b=[Text.Encoding]::UTF8.GetBytes('your-password')
 *   -join ([Security.Cryptography.SHA256]::Create().ComputeHash($b)|%{$_.ToString('x2')})
 */
(function () {
  const PASSWORD_HASH =
    "ae724d5c0d5c6d7d42d1c04358339fe802b94b00f33bca6a8276c2049a310165";
  const STORAGE_KEY = "tm_dev_unlocked";

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function isUnlocked() {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  }

  function lock() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  async function tryUnlock(password) {
    const hash = await sha256Hex(password);
    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      return true;
    }
    return false;
  }

  function showUnlocked() {
    const gate = document.getElementById("dev-gate");
    const shell = document.getElementById("dev-shell");
    if (gate) gate.hidden = true;
    if (shell) {
      shell.hidden = false;
      shell.classList.add("is-unlocked");
    }
  }

  function showGate() {
    const gate = document.getElementById("dev-gate");
    const shell = document.getElementById("dev-shell");
    if (gate) gate.hidden = false;
    if (shell) {
      shell.hidden = true;
      shell.classList.remove("is-unlocked");
    }
  }

  function initGateForm() {
    const form = document.getElementById("dev-gate-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.getElementById("dev-password");
      const error = document.getElementById("dev-gate-error");
      const ok = await tryUnlock(input ? input.value : "");
      if (ok) {
        if (error) error.textContent = "";
        showUnlocked();
        document.dispatchEvent(new CustomEvent("tm:dev-unlocked"));
      } else if (error) {
        error.textContent = "Mot de passe incorrect.";
        if (input) {
          input.value = "";
          input.focus();
        }
      }
    });
  }

  function initLogout() {
    document.querySelectorAll("[data-dev-logout]").forEach((btn) => {
      btn.addEventListener("click", () => {
        lock();
        showGate();
        window.location.href = new URL("../index.html", window.location.href).href;
      });
    });
  }

  function requireAuth() {
    if (isUnlocked()) {
      showUnlocked();
      document.dispatchEvent(new CustomEvent("tm:dev-unlocked"));
    } else {
      showGate();
    }
    initGateForm();
    initLogout();
  }

  window.TMDevAuth = { isUnlocked, tryUnlock, lock, requireAuth };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", requireAuth);
  } else {
    requireAuth();
  }
})();
