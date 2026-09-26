// ----- Config -----
const PASSWORD = "1+4-3";
const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 30;
const MAX_INPUT_LEN = 12;

const IDLE_TEXT = "READY";

const HINT_TEXT =
  "Hint: use numbers between 0 and 5, and the symbols are + and −";

// ----- Elements -----
const screenEl    = document.getElementById("screen");
const screenInner = document.getElementById("screenInner");
const hintEl      = document.getElementById("hint");
const keysEl      = document.getElementById("keys");

// ----- State -----
let input = "";
let attemptsLeft = MAX_ATTEMPTS;
let locked = false;
let lockEndsAt = 0;
let lockTimer = null;
let flashing = false;
let hintShown = false;

// ----- Screen helpers -----
function setScreen(text, state) {
  screenInner.textContent = text;
  screenEl.className = "screen" + (state ? " screen--" + state : "");
}

function renderScreen() {
  if (flashing) return;

  if (locked) {
    const remaining = Math.max(0, Math.ceil((lockEndsAt - Date.now()) / 1000));
    setScreen("LOCKED " + remaining + "s", "locked");
    return;
  }

  if (input.length === 0) {
    setScreen(IDLE_TEXT, "idle");
  } else {
    setScreen(input, "input");
  }
}

function flashNotAllowed() {
  if (flashing || locked) return;
  flashing = true;
  setScreen("Not allowed", "flash");
  setTimeout(() => {
    flashing = false;
    renderScreen();
  }, 700);
}

// ----- Actions -----
function appendChar(ch) {
  if (input.length >= MAX_INPUT_LEN) return;
  input += ch;
  renderScreen();
}

function backspace() {
  input = input.slice(0, -1);
  renderScreen();
}

function clearAll() {
  input = "";
  renderScreen();
}

function submit() {
  if (locked || flashing) return;
  if (input.length === 0) return;

  setScreen("CHECKING...", "input");

  setTimeout(() => {
    if (input === PASSWORD) {
      setScreen("ACCESS GRANTED", "success");
      try { sessionStorage.setItem("isAuthorized", "true"); } catch (e) {}
      setTimeout(() => { window.location.href = "secure.html"; }, 800);
      return;
    }

    attemptsLeft--;

    if (attemptsLeft <= 0) {
      lockout();
      return;
    }

    const msg =
      attemptsLeft === 1
        ? "ACCESS DENIED — 1 attempt left"
        : "ACCESS DENIED — 2 attempts left";

    setScreen(msg, "error");

    if (attemptsLeft === 2 && !hintShown) {
      hintShown = true;
      hintEl.textContent = HINT_TEXT;
      hintEl.hidden = false;
    }

    setTimeout(() => {
      input = "";
      renderScreen();
    }, 1400);
  }, 500);
}

function lockout() {
  locked = true;
  lockEndsAt = Date.now() + LOCK_SECONDS * 1000;
  input = "";

  const tick = () => {
    const remaining = Math.max(0, Math.ceil((lockEndsAt - Date.now()) / 1000));
    if (remaining <= 0) {
      clearInterval(lockTimer);
      lockTimer = null;
      locked = false;
      attemptsLeft = MAX_ATTEMPTS;
      renderScreen();
      return;
    }
    setScreen("LOCKED " + remaining + "s", "locked");
  };

  tick();
  lockTimer = setInterval(tick, 250);
}

// ----- Events: buttons -----
keysEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (locked || flashing) return;

  const action = btn.dataset.action;

  if (action === "decoy")  { flashNotAllowed(); return; }
  if (action === "clear")  { clearAll();        return; }
  if (action === "back")   { backspace();       return; }
  if (action === "digit" || action === "op") {
    appendChar(btn.dataset.value);
    return;
  }
  if (action === "submit") { submit(); return; }
});

// ----- Events: keyboard -----
document.addEventListener("keydown", (e) => {
  if (locked || flashing) return;

  const k = e.key;

  if (k === "Enter" || k === "=") { e.preventDefault(); submit();    return; }
  if (k === "Backspace")          { e.preventDefault(); backspace(); return; }
  if (k === "Escape")             { e.preventDefault(); clearAll();  return; }

  if (/^[0-5]$/.test(k))          { appendChar(k); return; }
  if (k === "+" || k === "-")     { appendChar(k); return; }

  if (k.length === 1 && /[0-9*/%.±]/.test(k)) {
    flashNotAllowed();
  }
});

// ----- Init -----
renderScreen();