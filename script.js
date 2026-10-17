(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const display = $("calcDisplay");
  const calcResult = $("calcResult");
  const angleMode = $("angleMode");
  let degrees = true;
  let lastAnswer = 0;

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function factorial(n) {
    if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error("Factorial needs a whole number from 0 to 170.");
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  // Tokenizer + recursive-descent parser: does not use eval().
  function tokenize(input) {
    const normalized = input.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/π/g, "pi").replace(/\s+/g, "");
    const tokens = [];
    let i = 0;
    while (i < normalized.length) {
      const rest = normalized.slice(i);
      const number = rest.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
      const identifier = rest.match(/^[a-z]+/i);
      if (number) { tokens.push({type:"number", value:Number(number[0])}); i += number[0].length; }
      else if (identifier) { tokens.push({type:"name", value:identifier[0].toLowerCase()}); i += identifier[0].length; }
      else if ("+-*/^!()%".includes(normalized[i])) { tokens.push({type:normalized[i], value:normalized[i]}); i++; }
      else throw new Error(`Unsupported character: ${normalized[i]}`);
    }
    tokens.push({type:"eof"});
    return tokens;
  }

  function evaluateExpression(input) {
    const tokens = tokenize(input);
    let pos = 0;
    const peek = () => tokens[pos];
    const take = (type) => {
      if (peek().type !== type) throw new Error(`Expected "${type}".`);
      return tokens[pos++];
    };
    const functions = {
      sin: x => Math.sin(degrees ? x * Math.PI / 180 : x),
      cos: x => Math.cos(degrees ? x * Math.PI / 180 : x),
      tan: x => Math.tan(degrees ? x * Math.PI / 180 : x),
      sqrt: x => { if (x < 0) throw new Error("Square root of a negative number is not real."); return Math.sqrt(x); },
      log: x => { if (x <= 0) throw new Error("Logarithm input must be positive."); return Math.log10(x); },
      ln: x => { if (x <= 0) throw new Error("Logarithm input must be positive."); return Math.log(x); },
      abs: x => Math.abs(x),
      exp: x => Math.exp(x)
    };
    function primary() {
      if (peek().type === "+") { take("+"); return primary(); }
      if (peek().type === "-") { take("-"); return -primary(); }
      if (peek().type === "number") return take("number").value;
      if (peek().type === "(") {
        take("("); const v = expression(); take(")"); return v;
      }
      if (peek().type === "name") {
        const name = take("name").value;
        if (name === "pi") return Math.PI;
        if (name === "e") return Math.E;
        if (!functions[name]) throw new Error(`Unknown function or constant: ${name}`);
        take("("); const arg = expression(); take(")");
        return functions[name](arg);
      }
      throw new Error("Enter a valid mathematical expression.");
    }
    function postfix() {
      let value = primary();
      while (peek().type === "!") { take("!"); value = factorial(value); }
      return value;
    }
    function power() {
      let value = postfix();
      if (peek().type === "^") { take("^"); value = Math.pow(value, unaryPower()); }
      return value;
    }
    function unaryPower() {
      if (peek().type === "-") { take("-"); return -unaryPower(); }
      if (peek().type === "+") { take("+"); return unaryPower(); }
      return power();
    }
    function term() {
      let value = unaryPower();
      while (peek().type === "*" || peek().type === "/" || peek().type === "%") {
        const op = tokens[pos++].type; const rhs = unaryPower();
        if ((op === "/" || op === "%") && rhs === 0) throw new Error("Cannot divide by zero.");
        if (op === "*") value *= rhs;
        if (op === "/") value /= rhs;
        if (op === "%") value %= rhs;
      }
      return value;
    }
    function expression() {
      let value = term();
      while (peek().type === "+" || peek().type === "-") {
        const op = tokens[pos++].type; const rhs = term();
        value = op === "+" ? value + rhs : value - rhs;
      }
      return value;
    }
    if (!input.trim()) throw new Error("Enter an expression first.");
    const result = expression();
    if (peek().type !== "eof") throw new Error("Please check the expression and parentheses.");
    if (!Number.isFinite(result)) throw new Error("Result is outside the supported range.");
    return result;
  }

  function calculate() {
    try {
      const result = evaluateExpression(display.value);
      lastAnswer = result;
      calcResult.textContent = "= " + Number(result.toPrecision(12)).toString();
      calcResult.style.color = "#f0f0f0";
    } catch (error) {
      calcResult.textContent = error.message;
      calcResult.style.color = "#ff9b9b";
    }
  }

  $("keypad").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.action === "clear") {
      display.value = "";
      calcResult.textContent = "Ready when you are.";
      calcResult.style.color = "";
      display.focus();
    } else if (button.dataset.action === "evaluate") calculate();
    else if (button.dataset.insert) {
      const start = display.selectionStart ?? display.value.length;
      const end = display.selectionEnd ?? display.value.length;
      display.setRangeText(button.dataset.insert, start, end, "end");
      display.focus();
    }
  });
  display.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === "=") { event.preventDefault(); calculate(); }
    if (event.key === "Escape") { display.value = ""; calcResult.textContent = "Ready when you are."; }
  });
  angleMode.addEventListener("click", () => {
    degrees = !degrees;
    angleMode.textContent = degrees ? "DEG" : "RAD";
    angleMode.setAttribute("aria-label", degrees ? "Angle mode: degrees" : "Angle mode: radians");
    showToast(degrees ? "Degree mode" : "Radian mode");
  });

  // Number system conversion uses BigInt to support large integer inputs accurately.
  function convertNumber() {
    const raw = $("sourceNumber").value.trim();
    const base = Number($("sourceBase").value);
    const error = $("converterError");
    error.textContent = "";
    if (!raw) { error.textContent = "Enter a number to convert."; return; }
    if (!/^[+-]?[0-9a-fA-F]+$/.test(raw)) { error.textContent = "Use only digits and an optional leading + or − sign."; return; }
    const signless = raw.replace(/^[+-]/, "");
    const valid = base === 2 ? /^[01]+$/.test(signless)
      : base === 8 ? /^[0-7]+$/.test(signless)
      : base === 10 ? /^\d+$/.test(signless)
      : /^[0-9a-fA-F]+$/.test(signless);
    if (!valid) { error.textContent = `That value contains a digit not allowed in base ${base}.`; return; }
    try {
      const value = BigInt(raw);
      const outputs = {2:value.toString(2), 8:value.toString(8), 10:value.toString(10), 16:value.toString(16).toUpperCase()};
      Object.entries(outputs).forEach(([b, v]) => { $("out" + b).textContent = v; });
      $("conversionExplanation").textContent = `${raw} in base ${base} is ${outputs[10]} in decimal. All values above represent the same integer.`;
    } catch {
      error.textContent = "Could not convert this value. Check the input and try again.";
    }
  }
  $("convertButton").addEventListener("click", convertNumber);
  $("sourceNumber").addEventListener("keydown", (event) => { if (event.key === "Enter") convertNumber(); });
  $("sourceBase").addEventListener("change", () => { if ($("sourceNumber").value.trim()) convertNumber(); });
  document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      const value = $(button.dataset.copy).textContent;
      if (!value || value === "—") { showToast("Convert a number first."); return; }
      try { await navigator.clipboard.writeText(value); showToast("Copied " + value); }
      catch { showToast("Copy is unavailable in this browser."); }
    });
  });
  const menuToggle = $("menuToggle");
  const nav = $("mainNav");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
  }));
  // Make last answer available as a future UI enhancement without polluting global scope.
  void lastAnswer;
})();
