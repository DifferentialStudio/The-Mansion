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

  /** Fallback SHA-256 when crypto.subtle is unavailable (e.g. file://). */
  function sha256HexFallback(text) {
    function rotr(n, x) {
      return (x >>> n) | (x << (32 - n));
    }

    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];

    const bytes = Array.from(new TextEncoder().encode(text));
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);
    for (let i = 7; i >= 0; i--) bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);

    let [h0, h1, h2, h3, h4, h5, h6, h7] = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
    ];

    for (let i = 0; i < bytes.length; i += 64) {
      const w = new Array(64);
      for (let j = 0; j < 16; j++) {
        const o = i + j * 4;
        w[j] = (bytes[o] << 24) | (bytes[o + 1] << 16) | (bytes[o + 2] << 8) | bytes[o + 3];
      }
      for (let j = 16; j < 64; j++) {
        const s0 = rotr(7, w[j - 15]) ^ rotr(18, w[j - 15]) ^ (w[j - 15] >>> 3);
        const s1 = rotr(17, w[j - 2]) ^ rotr(19, w[j - 2]) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
      }

      let [a, b, c, d, e, f, g, h] = [h0, h1, h2, h3, h4, h5, h6, h7];
      for (let j = 0; j < 64; j++) {
        const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
        const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) >>> 0;
        h = g;
        g = f;
        f = e;
        e = (d + t1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (t1 + t2) >>> 0;
      }

      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
      h5 = (h5 + f) >>> 0;
      h6 = (h6 + g) >>> 0;
      h7 = (h7 + h) >>> 0;
    }

    return [h0, h1, h2, h3, h4, h5, h6, h7]
      .map((n) => n.toString(16).padStart(8, "0"))
      .join("");
  }

  async function sha256Hex(text) {
    if (globalThis.crypto && crypto.subtle && window.isSecureContext) {
      const data = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    return sha256HexFallback(text);
  }

  function isUnlocked() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function lock() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  async function tryUnlock(password) {
    const hash = await sha256Hex(String(password).trim());
    if (hash === PASSWORD_HASH) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch (_) {
        /* file:// / private mode may block storage; still unlock this page */
      }
      return true;
    }
    return false;
  }

  function showUnlocked() {
    const gate = document.getElementById("dev-gate");
    const shell = document.getElementById("dev-shell");
    if (gate) {
      gate.hidden = true;
      gate.style.display = "none";
    }
    if (shell) {
      shell.hidden = false;
      shell.style.display = "block";
      shell.classList.add("is-unlocked");
    }
  }

  function showGate() {
    const gate = document.getElementById("dev-gate");
    const shell = document.getElementById("dev-shell");
    if (gate) {
      gate.hidden = false;
      gate.style.display = "";
    }
    if (shell) {
      shell.hidden = true;
      shell.style.display = "none";
      shell.classList.remove("is-unlocked");
    }
  }

  function initGateForm() {
    const form = document.getElementById("dev-gate-form");
    if (!form || form.dataset.bound === "1") return;
    form.dataset.bound = "1";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.getElementById("dev-password");
      const error = document.getElementById("dev-gate-error");
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      try {
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
      } catch (err) {
        if (error) {
          error.textContent =
            "Erreur technique. Recharge la page ou ouvre le site via un serveur local / GitHub Pages.";
        }
        console.error("[TMDevAuth]", err);
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  function initLogout() {
    document.querySelectorAll("[data-dev-logout]").forEach((btn) => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
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
