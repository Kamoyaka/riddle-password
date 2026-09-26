# Riddle Password

A calculator that doesn't do math — it guards a page.

**Riddle Password** is a passcode authentication web app disguised as a calculator. Instead of typing a long password, the user enters a mathematical expression and presses `=`. Get it right, and you're redirected to a protected page. Get it wrong three times, and the calculator locks you out.

> **Phase 1:** Vanilla HTML, CSS, and JavaScript with `sessionStorage`.  
> **Phase 2 (planned):** Python backend with password hashing and server-side sessions.

---

## ⚠️ This Is an Open Project

**The password is set directly in the JavaScript file.** It is fully visible to anyone who opens `script.js` or uses browser DevTools.

This is intentional. Phase 1 is a **demonstration prototype** — not a secure system. It exists to explore the *idea* of using mathematical expressions as a passcode, and to serve as a foundation for a properly secured backend later.

If you're looking for a real authentication system, this isn't it — yet. See the [Roadmap](#roadmap) below.

---

## Why This Exists

Passwords are forgettable. Puzzles are not.

This project asks a simple question: *what if authentication felt less like a chore and more like a small challenge?* Instead of memorising a string of characters, the user enters a math expression. It looks familiar, plays differently, and turns a routine login into a moment of thinking.

It's a first prototype for security, built as a portfolio project to explore creative, human-friendly approaches to everyday authentication.

---

## Features

- **Calculator interface** — familiar 4×5 keypad with digits, operators, and decoy keys
- **Digital LCD screen** — shows the actual characters you type, no masking
- **Expression-as-passcode** — the key is the full expression, not just its answer
- **Decoy keys** — pressing `6`, `7`, `8`, `9`, `%`, `÷`, `×`, `±`, or `.` flashes "Not allowed"
- **Hint after first wrong attempt** — displayed below the calculator
- **3 attempts, then 30-second lockout** with live countdown
- **Keyboard support** — `0–5`, `+`, `-`, `Enter`, `Backspace`, `Esc`
- **Protected second page** — guarded by a `sessionStorage` flag
- **Responsive and accessible** — real buttons, `aria-live` screen, visible focus rings

---

## How It Works

1. The user opens `index.html` and sees a calculator.
2. They type a mathematical expression using the allowed keys (`0–5`, `+`, `−`).
3. They press `=` (or `Enter`).
4. `script.js` compares the input to `PASSWORD` — currently `"1+4-3"`.
5. If correct → the app stores an `isAuthorized` flag in `sessionStorage` and redirects to `secure.html`.
6. If wrong → the screen shows "ACCESS DENIED" and the attempt counter decreases.
7. After the first wrong attempt, a hint appears below the calculator.
8. After three wrong attempts, the calculator locks for 30 seconds with a live countdown.
9. `secure.html` checks the `sessionStorage` flag on load. If it's missing, the user is redirected back to `index.html`.

---

## Roadmap

### Phase 1 — Current (Vanilla JS, Client-Side)

The working prototype. Password is hardcoded in `script.js`, lockout is client-side, and the protected page is guarded by `sessionStorage`. This is a **Level 2 demonstration** — only one exact expression is accepted.

### Phase 2 — Python Backend (Planned)

- Move verification to a Python server (Flask or FastAPI)
- Store the passcode as a **password hash** (Argon2id, bcrypt, or scrypt) — never in plaintext
- Use **server-side sessions** with `HttpOnly`, `Secure` cookies
- Add **server-side rate limiting** and lockout
- Add CSRF protection
- Enforce HTTPS in deployment

> Note: **hashing**, not encryption. Passwords should be one-way hashed, never encrypted (encryption is reversible).

### Phase 3 — Three Security Levels (Planned)

The planned upgrade introduces a configurable security level:

| Level | Name | Behaviour |
|---|---|---|
| **1** | Low / Open | Any expression that equals the correct answer is accepted. E.g. `1+1`, `2+0`, `4−2` all work if the answer is 2. |
| **2** | Mid / Strict | Only a pre-chosen set of expressions is accepted. The answer must be right, *and* the expression must be on the approved list. |
| **3** | Custom / Owner-Set | The owner sets their own expression as the passcode. Maximum control, minimum hints. |

This gives the project a clear progression from a friendly demo to a real lock.

---

## Tech Stack

**Phase 1 (current):**
- HTML5
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (no frameworks, no build step)
- `sessionStorage` for the authorization flag

**Phase 2 (planned):**
- Python 3
- Flask or FastAPI
- Argon2id / bcrypt for password hashing
- Server-side sessions

---

## File Structure

```
riddle-password/
├── index.html      # Landing page — calculator + passcode gate
├── secure.html     # Protected page (guarded by session flag)
├── style.css       # All styling
├── script.js       # Passcode logic, keypad, lockout
└── README.md
```

---

## Getting Started

No build step. No dependencies. No server required.

1. Clone or download the repository.
2. Open `index.html` in any modern browser.
3. Type `1`, `+`, `4`, `−`, `3`, then press `=`.
4. You'll land on the protected page.

### Changing the passcode

Open `script.js` and edit the constant at the top:

```js
const PASSWORD = "1+4-3";
```

You can also adjust:

```js
const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 30;
```

---

## Testing the App

| Action | Expected result |
|---|---|
| Type `1+4-3` and press `=` | ACCESS GRANTED → redirect to `secure.html` |
| Type `2+2` and press `=` | ACCESS DENIED — 2 attempts left, hint appears below calculator |
| Type `2+2` twice more | Lockout for 30 seconds with live countdown |
| Press `7` or `%` | Screen briefly flashes "Not allowed" |
| Refresh `secure.html` without logging in | Redirected back to `index.html` |
| Click Log out on `secure.html` | Flag cleared, returned to login |

---

## Accessibility

- All keys are real `<button>` elements
- The digital screen uses `aria-live="polite"` so screen readers announce updates
- Every key has an `aria-label`
- Visible focus rings via `:focus-visible`
- Full keyboard support

---

## License

MIT — free to use, modify, and learn from.

---

## Credits

Built as a portfolio project to explore creative approaches to authentication.