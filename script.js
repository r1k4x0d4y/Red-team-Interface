(() => {
  const body = document.body;
  const toggle = document.getElementById("themeToggle");
  if (!toggle) {
    return;
  }
  const indicator = toggle.querySelector(".toggle-indicator");
  const storageKey = "rt-theme";

  const themes = {
    dark: {
      className: "theme-dark",
      indicatorGlow: "rgba(83, 255, 168, 0.65)",
      indicatorColor: "#53ffa8",
    },
    light: {
      className: "theme-light",
      indicatorGlow: "rgba(255, 84, 112, 0.65)",
      indicatorColor: "#ff5470",
    },
  };

  const setIndicator = (mode) => {
    indicator.style.background = themes[mode].indicatorColor;
    indicator.style.boxShadow = `0 0 14px ${themes[mode].indicatorGlow}`;
  };

  const applyTheme = (mode) => {
    Object.values(themes).forEach((theme) => body.classList.remove(theme.className));
    body.classList.add(themes[mode].className);
    setIndicator(mode);
    localStorage.setItem(storageKey, mode);
  };

  const storedTheme = localStorage.getItem(storageKey);
  const prefersLight =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  if (storedTheme === "light" || (!storedTheme && prefersLight)) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }

  toggle.addEventListener("click", () => {
    const nextMode = body.classList.contains("theme-light") ? "dark" : "light";
    applyTheme(nextMode);
  });
})();

(() => {
  const terminalOutput = document.getElementById("terminalOutput");
  const terminalForm = document.getElementById("terminalForm");
  const commandInput = document.getElementById("terminalCommand");

  if (!terminalOutput || !terminalForm || !commandInput) {
    return;
  }

  const commandLibrary = {
    help: () => [
      "<span class='highlight'>commands</span>: help, clear, whoami, contact, skills",
      "type one of the listed commands to inspect the interface.",
    ],
    whoami: () => [
      "user: r1k4x3xpl0it (you)",
      "role: mssali rassou kaydy3 flw9t wsfe.",
    ],
    contact: () => [
      'email: <a href="mailto:rikamodwhite@gmail.com">rikamodwhite@gmail.com</a>',
      'github: <a href="https://github.com/r1k4x0d4y" target="_blank" rel="noopener noreferrer">github.com/r1k4x0d4y</a>',
      'linkedin: <a href="" target="_blank" rel="noopener noreferrer">linkedin.com/in/mzlma9aditou</a>',
    ],
    skills: () => [
      "<span class='skill-pending'><span class='highlight'>web-exploitation</span>: XSS, SQLi, SSRF, IDOR, AuthZ bypass, RCE</span>",
      "<span class='skill-pending'><span class='highlight'>ops-tradecraft</span>: phishing, initial access, C2, OPSEC</span>",
      "<span class='skill-pending'><span class='highlight'>cloud-apis</span>: IAM misconfig, token abuse, data exfil</span>",
      "<span class='skill-pending'><span class='highlight'>frontend-ux</span>: secure UI patterns, anti-XSS, CSP</span>",
      "<span class='highlight'>scripting</span>: Python, Bash, HTML, CSS, JS",
      "<span class='skill-pending'><span class='highlight'>purple-mindset</span>: detect/evade, logs, realistic emulation</span>",
    ],
  };

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (char) => {
      const escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return escapeMap[char] || char;
    });

  const appendLine = (content, options = {}) => {
    const { type = "response", tone = "default", allowHtml = true } = options;
    const line = document.createElement("div");
    line.classList.add("terminal-line");
    line.classList.add(`terminal-line--${type}`);
    if (tone !== "default") {
      line.classList.add(`terminal-line--${tone}`);
    }

    if (type === "input") {
      const prompt = document.createElement("span");
      prompt.className = "prompt";
      prompt.textContent = "$";

      const commandText = document.createElement("span");
      commandText.className = "command-text";
      commandText.textContent = content;

      line.append(prompt, commandText);
    } else {
      const response = document.createElement("span");
      response.className = "response";
      if (allowHtml) {
        response.innerHTML = content;
      } else {
        response.textContent = content;
      }
      line.append(response);
    }

    terminalOutput.append(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };

  const renderResponse = (lines) => {
    lines.forEach((line) => appendLine(line, { type: "response" }));
  };

  renderResponse(commandLibrary.help());

  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const rawInput = commandInput.value.trim();
    if (!rawInput) {
      return;
    }

    const command = rawInput.toLowerCase();

    if (command === "clear") {
      terminalOutput.innerHTML = "";
      commandInput.value = "";
      return;
    }

    appendLine(rawInput, { type: "input" });

    const handler = commandLibrary[command];
    if (handler) {
      renderResponse(handler());
    } else {
      appendLine(`command not found: ${escapeHtml(rawInput)}`, {
        type: "response",
        tone: "error",
        allowHtml: false,
      });
      appendLine("type <span class='highlight'>help</span> to list available commands.", {
        type: "response",
      });
    }

    commandInput.value = "";
  });
})();
