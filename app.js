// 1XL — IXL-styled learning platform with user-authored skills & prizes.
// Pure client-side, persisted in localStorage. Sharing via URL-encoded payloads.

const STORAGE_KEY = "1xl-state-v2";

const SUBJECTS = [
  { id: "math",    name: "Math",           color: "#f08d36", icon: "➗" },
  { id: "ela",     name: "Language arts",  color: "#b13b8e", icon: "📖" },
  { id: "science", name: "Science",        color: "#2aa84a", icon: "🔬" },
  { id: "social",  name: "Social studies", color: "#b6322f", icon: "🌎" },
  { id: "spanish", name: "Spanish",        color: "#2e7ad9", icon: "💬" },
  { id: "custom",  name: "My skills",      color: "#7c4ec5", icon: "⭐" },
];

const GRADES = ["Pre-K","K","1st","2nd","3rd","4th","5th","6th","7th","8th","Algebra 1","Geometry","Algebra 2"];
const LETTER_COLORS = ["#1ca64c","#f08d36","#b13b8e","#2e7ad9","#b6322f","#7c4ec5","#0e7a5e","#c9970d"];

// Scoring defaults (tunable per skill in the builder)
const DEFAULT_SCORING = { maxScore: 100, correctPoints: 6, wrongPenalty: 6, masteryBonus: 25, coinsPerCorrect: 2 };

// ---------- Seed content ----------
const SEED_SKILLS = [
  { id: "s-m-a1", subject: "math", grade: "3rd", group: "A. Multiplication", code: "A.1", name: "Multiplication facts up to 10",
    questions: [
      { type: "mc",   prompt: "What is 7 × 8?", choices: ["54","56","63","64"], answer: 1 },
      { type: "num",  prompt: "Solve: 6 × 9 = ?", answer: 54, tolerance: 0 },
      { type: "mc",   prompt: "What is 4 × 7?", choices: ["28","24","32","21"], answer: 0 },
      { type: "num",  prompt: "Solve: 9 × 9 = ?", answer: 81, tolerance: 0 },
    ]},
  { id: "s-m-a2", subject: "math", grade: "3rd", group: "A. Multiplication", code: "A.2", name: "Multiply by 11 and 12",
    questions: [
      { type: "num", prompt: "11 × 9 = ?", answer: 99, tolerance: 0 },
      { type: "mc",  prompt: "12 × 7 = ?", choices: ["84","72","96","94"], answer: 0 },
    ]},
  { id: "s-m-b1", subject: "math", grade: "3rd", group: "B. Fractions", code: "B.1", name: "Identify fractions on a number line",
    questions: [
      { type: "mc",   prompt: "Which fraction is halfway between 0 and 1?", choices: ["1/4","1/2","3/4","1/3"], answer: 1 },
      { type: "text", prompt: "Write the fraction shown by 3 of 4 equal parts.", answer: "3/4" },
    ]},
  { id: "s-m-b2", subject: "math", grade: "3rd", group: "B. Fractions", code: "B.2", name: "Equivalent fractions",
    questions: [
      { type: "mc", prompt: "Which is equivalent to 1/2?", choices: ["2/3","3/6","1/3","2/5"], answer: 1 },
      { type: "tf", prompt: "True or false: 4/8 = 1/2.", answer: true },
    ]},
  { id: "s-m-c1", subject: "math", grade: "5th", group: "C. Decimals", code: "C.1", name: "Add and subtract decimals",
    questions: [
      { type: "num", prompt: "0.7 + 0.45 = ?", answer: 1.15, tolerance: 0.001 },
      { type: "mc",  prompt: "5.2 − 1.75 = ?", choices: ["3.45","3.55","4.45","3.25"], answer: 0 },
    ]},
  { id: "s-e-a1", subject: "ela", grade: "4th", group: "A. Vocabulary", code: "A.1", name: "Synonyms",
    questions: [
      { type: "mc",    prompt: "Choose the synonym for 'happy'.", choices: ["sad","joyful","tired","angry"], answer: 1 },
      { type: "multi", prompt: "Pick ALL synonyms for 'big'.", choices: ["large","tiny","huge","small","massive"], answers: [0,2,4] },
    ]},
  { id: "s-e-a2", subject: "ela", grade: "4th", group: "A. Vocabulary", code: "A.2", name: "Antonyms",
    questions: [
      { type: "mc", prompt: "Choose the antonym for 'brave'.", choices: ["bold","fearless","cowardly","strong"], answer: 2 },
    ]},
  { id: "s-e-b1", subject: "ela", grade: "5th", group: "B. Grammar", code: "B.1", name: "Identify the verb in a sentence",
    questions: [
      { type: "text", prompt: "What is the verb in: 'The dog runs fast.'?", answer: "runs" },
      { type: "text", prompt: "What is the verb in: 'She painted a portrait.'?", answer: "painted" },
    ]},
  { id: "s-s-a1", subject: "science", grade: "4th", group: "A. Life science", code: "A.1", name: "Plant and animal cells",
    questions: [
      { type: "mc",   prompt: "Which structure is in plant cells but NOT animal cells?",
        choices: ["Nucleus","Cell wall","Mitochondria","Membrane"], answer: 1 },
      { type: "text", prompt: "Photosynthesis happens in which organelle?", answer: "chloroplast" },
      { type: "tf",   prompt: "True or false: Mitochondria are the powerhouse of the cell.", answer: true },
    ]},
  { id: "s-s-b1", subject: "science", grade: "4th", group: "B. Earth science", code: "B.1", name: "The water cycle",
    questions: [
      { type: "mc", prompt: "Water turns into vapor through...", choices: ["Condensation","Evaporation","Precipitation","Runoff"], answer: 1 },
    ]},
  { id: "s-soc-a1", subject: "social", grade: "5th", group: "A. U.S. geography", code: "A.1", name: "Name the U.S. states",
    questions: [
      { type: "text", prompt: "Which state's capital is Sacramento?", answer: "california" },
      { type: "mc",   prompt: "Which state is 'The Sunshine State'?",
        choices: ["Texas","Florida","Arizona","Nevada"], answer: 1 },
    ]},
  { id: "s-sp-a1", subject: "spanish", grade: "K", group: "A. Greetings", code: "A.1", name: "Common greetings",
    questions: [
      { type: "mc",   prompt: "How do you say 'Hello' in Spanish?",
        choices: ["Adiós","Hola","Gracias","Por favor"], answer: 1 },
      { type: "text", prompt: "Translate 'Good night' to Spanish (two words).", answer: "buenas noches" },
    ]},
];

const SEED_PRIZES = [
  { id: "p-1", name: "Bronze trophy", emoji: "🥉", desc: "Your first taste of victory.", cost: 50 },
  { id: "p-2", name: "Silver medal",  emoji: "🥈", desc: "Halfway to legend status.",   cost: 150 },
  { id: "p-3", name: "Gold crown",    emoji: "👑", desc: "Reign over the leaderboard.", cost: 400 },
  { id: "p-4", name: "Mystery box",   emoji: "🎁", desc: "Who knows what's inside?",    cost: 100 },
  { id: "p-5", name: "Pet dragon",    emoji: "🐉", desc: "It mostly sleeps. Mostly.",   cost: 800 },
];

// ---------- State ----------
function defaultState() {
  return {
    skills: SEED_SKILLS.map(s => ({ ...s, builtin: true, scoring: { ...DEFAULT_SCORING }, author: "1XL" })),
    prizes: SEED_PRIZES.map(p => ({ ...p, builtin: true })),
    progress: {},
    coins: 0,
    redeemed: [],
    profile: { name: "Learner", avatar: "L" },
  };
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const def = defaultState();
    const skillIds = new Set((parsed.skills || []).map(s => s.id));
    def.skills.forEach(s => { if (!skillIds.has(s.id)) parsed.skills.push(s); });
    const prizeIds = new Set((parsed.prizes || []).map(p => p.id));
    def.prizes.forEach(p => { if (!prizeIds.has(p.id)) parsed.prizes.push(p); });
    parsed.skills = parsed.skills.map(s => ({ scoring: { ...DEFAULT_SCORING }, ...s }));
    parsed.profile = parsed.profile || { name: "Learner", avatar: "L" };
    parsed.redeemed = parsed.redeemed || [];
    parsed.progress = parsed.progress || {};
    parsed.coins = parsed.coins || 0;
    return parsed;
  } catch {
    return defaultState();
  }
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    toast("Could not save — storage full. Try shrinking images.");
  }
}

// ---------- Router ----------
function parseHash() {
  const h = location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart] = h.split("?");
  const parts = pathPart.split("/").filter(Boolean);
  const params = new URLSearchParams(queryPart || "");
  return { path: parts[0] || "home", args: parts.slice(1), params };
}

window.addEventListener("hashchange", render);
window.addEventListener("load", () => {
  document.getElementById("search").addEventListener("input", e => {
    if (parseHash().path === "search" || e.target.value.length >= 2) {
      location.hash = "#/search/" + encodeURIComponent(e.target.value);
    }
  });
  document.getElementById("avatar").addEventListener("click", () => location.hash = "#/profile");

  // Auto-import if URL has ?import=...
  const { params } = parseHash();
  if (params.get("import")) {
    handleImportFromParam(params.get("import"));
  }
  render();
});

function go(path) { location.hash = "#" + path; }

// ---------- DOM helpers ----------
function el(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  for (const k in props) {
    if (props[k] == null || props[k] === false) continue;
    if (k === "class") e.className = props[k];
    else if (k === "html") e.innerHTML = props[k];
    else if (k.startsWith("on") && typeof props[k] === "function") e.addEventListener(k.slice(2).toLowerCase(), props[k]);
    else e.setAttribute(k, props[k]);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return e;
}

// ---------- Render entry ----------
function render() {
  const { path, args } = parseHash();
  renderSubjectTabs(path, args);

  const view = document.getElementById("view");
  view.innerHTML = "";
  document.getElementById("coin-count").textContent = state.coins;
  document.getElementById("avatar").textContent = state.profile.avatar;

  switch (path) {
    case "home":     view.appendChild(renderHome()); break;
    case "subject":  view.appendChild(renderSubject(args[0], args[1])); break;
    case "skill":    view.appendChild(renderQuiz(args[0])); break;
    case "create-skill": view.appendChild(renderSkillBuilder(args[0], args[1])); break;
    case "prizes":   view.appendChild(renderPrizes()); break;
    case "create-prize": view.appendChild(renderPrizeBuilder(args[0])); break;
    case "profile":  view.appendChild(renderProfile()); break;
    case "awards":   view.appendChild(renderAwards()); break;
    case "recommendations": view.appendChild(renderRecommendations()); break;
    case "share":    view.appendChild(renderShareImport()); break;
    case "search":   view.appendChild(renderSearch(decodeURIComponent(args[0] || ""))); break;
    default:         view.appendChild(renderHome()); break;
  }
}

function renderSubjectTabs(path, args) {
  const tabs = document.getElementById("subject-tabs");
  tabs.innerHTML = "";
  SUBJECTS.forEach(s => {
    const isActive = (path === "subject" && args[0] === s.id) || (path === "create-skill" && args[0] === s.id);
    tabs.appendChild(el("button", {
      class: "subject-tab" + (isActive ? " active" : ""),
      "data-color": s.id,
      onclick: () => go(`/subject/${s.id}`)
    }, s.name));
  });
  const isPrizes = path === "prizes" || path === "create-prize";
  tabs.appendChild(el("button", {
    class: "subject-tab" + (isPrizes ? " active" : ""),
    "data-color": "prizes",
    onclick: () => go("/prizes"),
    style: "margin-left:auto"
  }, "🏆 Prize shop"));
}

// ---------- Home ----------
function renderHome() {
  const root = el("div");
  root.appendChild(el("div", { class: "page-head" },
    el("div", {},
      el("h1", {}, "Welcome to 1XL"),
      el("div", { class: "subtitle" }, "Pick a subject to start practicing — or build your own skill.")
    ),
    el("div", { class: "head-actions" },
      el("button", { class: "btn", onclick: () => go("/share") }, "🔗 Share & import"),
      el("button", { class: "btn btn-primary", onclick: () => go("/create-skill") }, "+ Create a skill"),
    )
  ));

  root.appendChild(el("div", { class: "ixl-banner" },
    el("div", { class: "icon" }, "🎯"),
    el("div", { class: "text" },
      el("h3", {}, "Earn coins by mastering skills"),
      el("p", {}, `You have ${state.coins} coins. Each correct answer earns up to 6 SmartScore — get to 100 to master a skill.`)
    ),
    el("button", { onclick: () => go("/prizes") }, "Go to prize shop"),
  ));

  const grid = el("div", { class: "subject-grid" });
  SUBJECTS.forEach(s => {
    const count = state.skills.filter(sk => sk.subject === s.id).length;
    grid.appendChild(el("div", { class: "subject-card", onclick: () => go(`/subject/${s.id}`) },
      el("div", { class: "icon", style: `background:${s.color}` }, s.icon),
      el("div", {},
        el("h3", {}, s.name),
        el("div", { class: "count" }, `${count} skill${count === 1 ? "" : "s"}`)
      )
    ));
  });
  root.appendChild(grid);

  // Newest community skills
  const community = state.skills.filter(s => !s.builtin).slice(-8).reverse();
  if (community.length > 0) {
    root.appendChild(el("h2", { style: "margin:24px 0 12px;font-size:18px" }, "Newest community skills"));
    const sec = el("div", { class: "skill-section" });
    community.forEach(s => sec.appendChild(skillRow(s, state.progress[s.id])));
    root.appendChild(sec);
  }

  // Continue
  const inProgress = state.skills
    .map(s => ({ s, p: state.progress[s.id] }))
    .filter(x => x.p && x.p.score > 0 && x.p.score < (x.s.scoring?.maxScore || 100))
    .slice(0, 6);
  if (inProgress.length > 0) {
    root.appendChild(el("h2", { style: "margin:24px 0 12px;font-size:18px" }, "Continue where you left off"));
    const sec = el("div", { class: "skill-section" });
    inProgress.forEach(({ s, p }) => sec.appendChild(skillRow(s, p)));
    root.appendChild(sec);
  }

  return root;
}

// ---------- Subject (skill tree) ----------
function renderSubject(subjectId, gradeArg) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const root = el("div");
  if (!subject) { root.appendChild(el("div", { class: "empty" }, "Subject not found.")); return root; }

  root.appendChild(el("div", { class: "page-head" },
    el("div", {},
      el("h1", {}, subject.name),
      el("div", { class: "subtitle" }, "Pick a grade, then choose any skill to start practicing.")
    ),
    el("button", { class: "btn btn-primary", onclick: () => go(`/create-skill/${subject.id}`) }, "+ Add a skill")
  ));

  const strip = el("div", { class: "grade-strip" });
  GRADES.forEach(g => {
    const has = state.skills.some(s => s.subject === subjectId && s.grade === g);
    strip.appendChild(el("button", {
      class: "grade-pill" + (gradeArg === g ? " active" : ""),
      style: !has ? "opacity:0.55" : null,
      onclick: () => go(`/subject/${subject.id}/${encodeURIComponent(g)}`)
    }, g));
  });
  root.appendChild(strip);

  const activeGrade = gradeArg ? decodeURIComponent(gradeArg) : (GRADES.find(g => state.skills.some(s => s.subject === subjectId && s.grade === g)) || GRADES[0]);

  const wrap = el("div", { class: "layout-with-side" });
  const treeCol = el("div");
  const sideCol = renderSubjectSide(subjectId);

  const skills = state.skills.filter(s => s.subject === subjectId && s.grade === activeGrade);

  if (skills.length === 0) {
    treeCol.appendChild(el("div", { class: "empty" },
      `No ${subject.name} skills for ${activeGrade} yet. `,
      el("a", { href: `#/create-skill/${subject.id}` }, "Be the first to add one!")
    ));
  } else {
    const groups = {};
    skills.forEach(s => { (groups[s.group || "Other"] = groups[s.group || "Other"] || []).push(s); });
    Object.entries(groups).forEach(([groupName, list], idx) => {
      const sec = el("div", { class: "skill-section" });
      const letter = (groupName.match(/^[A-Z]/) || ["•"])[0];
      const cleanName = groupName.replace(/^[A-Z]\.\s*/, "");
      const color = LETTER_COLORS[idx % LETTER_COLORS.length];
      sec.appendChild(el("div", { class: "skill-section-head" },
        el("div", { class: "letter-circle", style: `background:${color}` }, letter),
        el("h2", {}, cleanName),
        el("span", { class: "meta" }, `${list.length} skill${list.length === 1 ? "" : "s"}`)
      ));
      list.forEach(s => sec.appendChild(skillRow(s, state.progress[s.id])));
      treeCol.appendChild(sec);
    });
  }
  wrap.appendChild(treeCol);
  wrap.appendChild(sideCol);
  root.appendChild(wrap);
  return root;
}

function skillRow(s, p) {
  const score = p ? p.score : 0;
  const maxScore = s.scoring?.maxScore || 100;
  const pct = Math.round((score / maxScore) * 100);
  return el("div", { class: "skill-row", onclick: () => go(`/skill/${s.id}`) },
    el("div", { class: "code" }, s.code || "—"),
    el("div", { class: "skill-name" },
      s.name,
      !s.builtin ? el("span", { class: "tag-new" }, "Community") : null,
      s.imported ? el("span", { class: "tag-imported" }, "Imported") : null
    ),
    el("div", { class: "qmark", title: s.builtin ? "Built-in skill" : `By ${s.author || "Unknown"}` }, "?"),
    !s.builtin ? el("div", { class: "author" }, `by ${s.author || "anon"}`) : el("div", { class: "author" }),
    el("div", { class: "num-problems" }, `${s.questions.length} problem${s.questions.length === 1 ? "" : "s"}`),
    el("div", { class: "smartscore-mini" + (pct >= 100 ? " done" : "") }, score + "")
  );
}

function renderSubjectSide(subjectId) {
  const side = el("div", { class: "side-card" });
  side.appendChild(el("h3", {}, "Awards in this subject"));
  const subjectSkills = state.skills.filter(s => s.subject === subjectId);
  const mastered = subjectSkills.filter(s => {
    const max = s.scoring?.maxScore || 100;
    return (state.progress[s.id]?.score || 0) >= max;
  }).length;
  const total = subjectSkills.length;
  const pct = total === 0 ? 0 : Math.round((mastered / total) * 100);
  side.appendChild(el("div", { class: "trophy-row" }, el("span", {}, "Skills mastered"), el("b", {}, `${mastered}/${total}`)));
  side.appendChild(el("div", { class: "bar" }, el("span", { style: `width:${pct}%` })));
  side.appendChild(el("div", { class: "trophy-row" }, el("span", { class: "muted" }, "Coins earned"), el("b", {}, `🪙 ${state.coins}`)));
  side.appendChild(el("button", { class: "btn btn-sm", style: "width:100%;margin-top:14px", onclick: () => go("/awards") }, "View all awards"));
  return side;
}

// ---------- Quiz ----------
function renderQuiz(skillId) {
  const skill = state.skills.find(s => s.id === skillId);
  const root = el("div");
  if (!skill) { root.appendChild(el("div", { class: "empty" }, "Skill not found.")); return root; }
  if (!skill.questions || skill.questions.length === 0) {
    root.appendChild(el("div", { class: "empty" }, "This skill has no questions yet.")); return root;
  }

  const subject = SUBJECTS.find(s => s.id === skill.subject);
  const scoring = { ...DEFAULT_SCORING, ...(skill.scoring || {}) };

  const wrap = el("div", { class: "quiz-wrap" });
  const main = el("div", { class: "quiz-card" });
  const side = el("div", { class: "quiz-side" });
  wrap.appendChild(main);
  wrap.appendChild(side);
  root.appendChild(wrap);

  const session = {
    qIdx: 0,
    score: state.progress[skill.id]?.score || 0,
    answeredCount: 0,
    rightCount: 0,
    coinsEarned: 0,
    locked: false, // anti-spam: locked once graded, until "Next"
  };

  function pickQuestion() {
    // Rotate through questions; if more attempts than questions, randomize
    if (session.answeredCount < skill.questions.length) {
      session.qIdx = session.answeredCount % skill.questions.length;
    } else {
      session.qIdx = Math.floor(Math.random() * skill.questions.length);
    }
  }

  function renderSide() {
    side.innerHTML = "";
    const pct = Math.round((session.score / scoring.maxScore) * 100);
    const mastered = session.score >= scoring.maxScore;
    side.appendChild(el("h3", {}, "SmartScore"));
    const ring = el("div", { class: "score-ring" + (mastered ? " mastered" : ""), style: `--p:${pct}` },
      el("span", {}, session.score + ""));
    side.appendChild(ring);
    side.appendChild(el("div", { class: "muted", style: "text-align:center;margin-bottom:14px;font-size:13px" },
      mastered ? "Mastered! 🎉" : `Goal: ${scoring.maxScore}`));
    side.appendChild(el("div", { class: "bar-row" }, el("span", {}, "Answered"), el("b", {}, session.answeredCount + "")));
    side.appendChild(el("div", { class: "bar-row" }, el("span", {}, "Correct"), el("b", {}, session.rightCount + "")));
    side.appendChild(el("div", { class: "bar-row" }, el("span", {}, "Coins earned"), el("b", {}, "🪙 " + session.coinsEarned)));
    side.appendChild(el("hr", { class: "sep" }));
    side.appendChild(el("div", { class: "muted", style: "font-size:12px;text-align:center" },
      `+${scoring.correctPoints} / −${scoring.wrongPenalty} per question`));
    if (!skill.builtin) {
      side.appendChild(el("button", { class: "btn btn-sm", style: "width:100%;margin-top:10px",
        onclick: () => go(`/create-skill/${skill.id}`) }, "Edit this skill"));
    }
  }

  function renderQuestion() {
    main.innerHTML = "";
    pickQuestion();
    const q = skill.questions[session.qIdx];
    const bread = el("div", { class: "quiz-bread" });
    bread.appendChild(document.createTextNode(`${subject?.name || ""} › ${(skill.group || "").replace(/^[A-Z]\.\s*/, "")} › `));
    bread.appendChild(el("span", { class: "code" }, skill.code || ""));
    main.appendChild(bread);
    main.appendChild(el("h2", { class: "quiz-title" }, skill.name));

    if (q.image) main.appendChild(el("img", { class: "quiz-image", src: q.image, alt: "" }));
    main.appendChild(el("div", { class: "quiz-q" }, q.prompt));

    let getResult; // returns { correct: bool, given: any }

    if (q.type === "mc") {
      const choices = el("div", { class: "choices" });
      q.choices.forEach((c, i) => {
        const btn = el("button", { class: "choice" });
        btn.appendChild(el("span", {}, String.fromCharCode(65 + i) + "."));
        btn.appendChild(el("span", {}, c));
        btn.onclick = () => {
          if (session.locked) return;
          grade(i === q.answer, q, choices, btn);
        };
        choices.appendChild(btn);
      });
      main.appendChild(choices);
      getResult = null;
    } else if (q.type === "tf") {
      const choices = el("div", { class: "choices" });
      ["True", "False"].forEach((label, i) => {
        const isAns = (i === 0) === !!q.answer;
        const btn = el("button", { class: "choice" }, label);
        btn.onclick = () => {
          if (session.locked) return;
          grade(isAns, q, choices, btn);
        };
        choices.appendChild(btn);
      });
      main.appendChild(choices);
    } else if (q.type === "multi") {
      const selected = new Set();
      const choices = el("div", { class: "choices multi" });
      q.choices.forEach((c, i) => {
        const btn = el("button", { class: "choice" });
        const box = el("span", { class: "box" }, "");
        btn.appendChild(box);
        btn.appendChild(el("span", {}, c));
        btn.onclick = () => {
          if (session.locked) return;
          if (selected.has(i)) { selected.delete(i); btn.classList.remove("selected"); box.textContent = ""; }
          else { selected.add(i); btn.classList.add("selected"); box.textContent = "✓"; }
        };
        choices.appendChild(btn);
      });
      main.appendChild(choices);
      const submit = el("button", { class: "btn btn-primary", style: "margin-top:14px" }, "Submit");
      submit.onclick = () => {
        if (session.locked) return;
        const got = [...selected].sort().join(",");
        const want = [...(q.answers || [])].sort().join(",");
        grade(got === want, q, choices, null);
      };
      main.appendChild(submit);
    } else if (q.type === "num") {
      const input = el("input", { class: "num-input", type: "number", step: "any", placeholder: "Type your answer..." });
      const btn = el("button", { class: "btn btn-primary", style: "margin-top:14px" }, "Submit");
      const submit = () => {
        if (session.locked) return;
        const val = parseFloat(input.value);
        if (Number.isNaN(val)) { btn.disabled = false; return; }
        const tol = q.tolerance || 0;
        const ok = Math.abs(val - q.answer) <= tol + 1e-9;
        grade(ok, q, null, null);
        input.disabled = true;
        btn.disabled = true;
      };
      btn.onclick = submit;
      input.addEventListener("keydown", e => { if (e.key === "Enter" && !session.locked) submit(); });
      setTimeout(() => input.focus(), 30);
      main.appendChild(input);
      main.appendChild(btn);
    } else { // text
      const input = el("input", { class: "text-input", placeholder: "Type your answer..." });
      const btn = el("button", { class: "btn btn-primary", style: "margin-top:14px" }, "Submit");
      const submit = () => {
        if (session.locked) return;
        const ok = normalize(input.value) === normalize(q.answer)
          || (q.alts || []).some(a => normalize(a) === normalize(input.value));
        grade(ok, q, null, null);
        input.disabled = true;
        btn.disabled = true;
      };
      btn.onclick = submit;
      input.addEventListener("keydown", e => { if (e.key === "Enter" && !session.locked) submit(); });
      setTimeout(() => input.focus(), 30);
      main.appendChild(input);
      main.appendChild(btn);
    }
  }

  function grade(correct, q, choicesEl, choiceBtn) {
    if (session.locked) return; // anti-spam guard
    session.locked = true;
    session.answeredCount++;

    let inc = 0;
    if (correct) {
      session.rightCount++;
      inc = scoring.correctPoints;
      session.score = Math.min(scoring.maxScore, session.score + inc);
      const isMastery = session.score >= scoring.maxScore;
      const coins = scoring.coinsPerCorrect + (isMastery && !state.progress[skill.id]?.completed ? scoring.masteryBonus : 0);
      session.coinsEarned += coins;
      state.coins += coins;
    } else {
      session.score = Math.max(0, session.score - scoring.wrongPenalty);
    }

    state.progress[skill.id] = {
      score: session.score,
      attempts: (state.progress[skill.id]?.attempts || 0) + 1,
      completed: session.score >= scoring.maxScore || state.progress[skill.id]?.completed,
    };
    save();

    // Visually mark choice buttons + disable them
    if (choicesEl) {
      [...choicesEl.children].forEach(c => c.disabled = true);
      if (choiceBtn) choiceBtn.classList.add(correct ? "correct" : "wrong");
      // If wrong, also reveal the right one for MC/TF
      if (!correct) {
        if (q.type === "mc") {
          const right = choicesEl.children[q.answer];
          if (right) right.classList.add("reveal");
        } else if (q.type === "tf") {
          const right = choicesEl.children[q.answer ? 0 : 1];
          if (right) right.classList.add("reveal");
        } else if (q.type === "multi") {
          (q.answers || []).forEach(i => choicesEl.children[i]?.classList.add("reveal"));
        }
      }
    }

    main.appendChild(el("div", { class: "feedback " + (correct ? "right" : "wrong") },
      correct ? `✅ Correct! +${inc} SmartScore` : `❌ Not quite. The correct answer was: ${answerText(q)}`
    ));

    const mastered = session.score >= scoring.maxScore;
    const next = el("button", { class: "btn btn-primary", style: "margin-top:14px" },
      mastered ? "Finish! 🎉" : "Next question");
    next.onclick = () => {
      if (mastered) {
        toast(`Skill mastered! +${scoring.masteryBonus} bonus coins 🪙`);
        go(`/subject/${skill.subject}/${encodeURIComponent(skill.grade)}`);
        return;
      }
      session.locked = false;
      renderQuestion();
      renderSide();
    };
    main.appendChild(next);
    setTimeout(() => next.focus(), 30);
    renderSide();
    document.getElementById("coin-count").textContent = state.coins;
  }

  renderQuestion();
  renderSide();
  return root;
}

function answerText(q) {
  if (q.type === "mc") return q.choices[q.answer];
  if (q.type === "tf") return q.answer ? "True" : "False";
  if (q.type === "multi") return (q.answers || []).map(i => q.choices[i]).join(", ");
  if (q.type === "num") return String(q.answer) + (q.tolerance ? ` (±${q.tolerance})` : "");
  return q.answer;
}
function normalize(s) { return (s || "").toString().trim().toLowerCase().replace(/\s+/g, " "); }

// ---------- Skill builder ----------
function nextCodeFor(subject, grade, letter, excludeId) {
  const used = state.skills
    .filter(s => s.subject === subject && s.grade === grade && s.id !== excludeId)
    .map(s => s.code || "")
    .filter(c => c.toUpperCase().startsWith(letter + "."))
    .map(c => parseInt(c.split(".")[1], 10))
    .filter(n => !Number.isNaN(n));
  const max = used.length ? Math.max(...used) : 0;
  return `${letter}.${max + 1}`;
}
function nextLetterFor(subject, grade) {
  const used = new Set(state.skills
    .filter(s => s.subject === subject && s.grade === grade)
    .map(s => (s.group || "").trim().charAt(0).toUpperCase())
    .filter(L => L >= "A" && L <= "Z"));
  for (let i = 0; i < 26; i++) {
    const L = String.fromCharCode(65 + i);
    if (used.has(L)) continue;
    return L;
  }
  return "A";
}
function existingSectionsFor(subject, grade) {
  const map = new Map();
  state.skills.filter(s => s.subject === subject && s.grade === grade).forEach(s => {
    const m = (s.group || "").match(/^([A-Z])\.\s*(.*)$/);
    if (!m) return;
    if (!map.has(m[1])) map.set(m[1], m[2]);
  });
  return map;
}

function renderSkillBuilder(arg1, arg2) {
  let editing = null;
  let presetSubject = null;
  if (arg1 && state.skills.find(s => s.id === arg1)) editing = state.skills.find(s => s.id === arg1);
  else if (arg2 && state.skills.find(s => s.id === arg2)) editing = state.skills.find(s => s.id === arg2);
  else if (arg1 && SUBJECTS.find(s => s.id === arg1)) presetSubject = arg1;

  const root = el("div", { class: "form-card" });
  root.appendChild(el("h2", {}, editing ? "Edit skill" : "Create a new skill"));
  root.appendChild(el("p", { class: "help" }, "Build a practice skill in the IXL style. Mix question types, attach images, tune the SmartScore — then share a link to publish it."));

  // ----- Skill name -----
  const nameInput = el("input", { placeholder: "e.g. Adding fractions with like denominators", value: editing?.name || "" });
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Skill name"), nameInput));

  // ----- Subject picker (visual pills) -----
  let currentSubject = editing?.subject || presetSubject || "math";
  const subjectRow = el("div", { class: "subject-picker" });
  function paintSubjects() {
    subjectRow.innerHTML = "";
    SUBJECTS.forEach(s => {
      const btn = el("button", {
        class: "subject-pick" + (currentSubject === s.id ? " active" : ""),
        onclick: () => { currentSubject = s.id; paintSubjects(); refreshLetters(); refreshCode(); }
      });
      btn.appendChild(el("span", { class: "ico", style: `background:${s.color}` }, s.icon));
      btn.appendChild(el("span", {}, s.name));
      subjectRow.appendChild(btn);
    });
  }
  paintSubjects();
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Subject"), subjectRow));

  // ----- Grade picker (wide pill row) -----
  let currentGrade = editing?.grade || GRADES[3];
  const gradeRow = el("div", { class: "grade-strip" });
  function paintGrades() {
    gradeRow.innerHTML = "";
    GRADES.forEach(g => {
      gradeRow.appendChild(el("button", {
        class: "grade-pill" + (currentGrade === g ? " active" : ""),
        onclick: () => { currentGrade = g; paintGrades(); refreshLetters(); refreshCode(); }
      }, g));
    });
  }
  paintGrades();
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Grade level"), gradeRow));

  // ----- Section letter + section name + auto-code -----
  const editingMatch = editing?.group?.match(/^([A-Z])\.\s*(.*)$/);
  let currentLetter = editingMatch ? editingMatch[1] : (editing ? "A" : nextLetterFor(currentSubject, currentGrade));
  let currentSectionName = editingMatch ? editingMatch[2] : "";

  // If editing, treat existing code as override only if it doesn't match auto
  let codeOverride = false;
  if (editing && editing.code) {
    codeOverride = editing.code !== nextCodeFor(editing.subject, editing.grade, currentLetter, editing.id);
  }

  const letterSelect = el("select", {});
  function refreshLetters() {
    letterSelect.innerHTML = "";
    const sections = existingSectionsFor(currentSubject, currentGrade);
    for (let i = 0; i < 26; i++) {
      const L = String.fromCharCode(65 + i);
      const label = sections.has(L) ? `${L}. ${sections.get(L)}` : `${L}.  (new section)`;
      const opt = el("option", { value: L }, label);
      if (L === currentLetter) opt.selected = true;
      letterSelect.appendChild(opt);
    }
    // If the selected letter belongs to an existing section and we don't have a name, fill it in
    const existingName = sections.get(currentLetter);
    if (existingName && !currentSectionName) {
      currentSectionName = existingName;
      sectionNameInput.value = existingName;
    }
  }
  letterSelect.onchange = () => {
    currentLetter = letterSelect.value;
    const sections = existingSectionsFor(currentSubject, currentGrade);
    if (sections.has(currentLetter)) {
      currentSectionName = sections.get(currentLetter);
      sectionNameInput.value = currentSectionName;
    }
    refreshCode();
  };

  const sectionNameInput = el("input", { value: currentSectionName, placeholder: "e.g. Multiplication, Fractions, Vocabulary..." });
  sectionNameInput.oninput = () => { currentSectionName = sectionNameInput.value; updatePreview(); };

  const codeInput = el("input", { value: editing?.code || "", placeholder: "A.1" });
  codeInput.oninput = () => { codeOverride = true; updateAutoBadge(); updatePreview(); };
  const autoBadge = el("span", { class: "auto-badge" }, "Auto");
  const autoBtn = el("button", { class: "btn btn-sm", onclick: () => { codeOverride = false; refreshCode(); } }, "Reset to auto");
  function updateAutoBadge() {
    autoBadge.textContent = codeOverride ? "Custom" : "Auto";
    autoBadge.classList.toggle("off", codeOverride);
  }
  function refreshCode() {
    if (!codeOverride) {
      codeInput.value = nextCodeFor(currentSubject, currentGrade, currentLetter, editing?.id);
    }
    updateAutoBadge();
    updatePreview();
  }

  refreshLetters();
  refreshCode();

  root.appendChild(el("div", { class: "row-2" },
    el("div", { class: "field" }, el("label", {}, "Section"), letterSelect),
    el("div", { class: "field" }, el("label", {}, "Section name"), sectionNameInput),
  ));
  root.appendChild(el("div", { class: "field" },
    el("label", {}, "Skill code"),
    el("div", { class: "code-row" }, codeInput, autoBadge, autoBtn)
  ));

  // ----- Live preview row -----
  const previewRow = el("div", { class: "preview-row" });
  function updatePreview() {
    previewRow.innerHTML = "";
    const code = codeInput.value.trim() || "A.1";
    const name = nameInput.value.trim() || "Your skill name";
    const subject = SUBJECTS.find(s => s.id === currentSubject);
    previewRow.appendChild(el("span", { class: "label" }, "Preview"));
    previewRow.appendChild(el("span", { class: "code" }, code));
    previewRow.appendChild(el("span", { class: "name" }, name));
    previewRow.appendChild(el("span", { class: "muted", style: "font-size:13px" },
      `${subject?.name || ""} · ${currentGrade} · ${currentLetter}. ${currentSectionName || "Section"}`));
  }
  nameInput.oninput = updatePreview;
  updatePreview();
  root.appendChild(previewRow);

  // Scoring panel — collapsible
  const baseScoring = { ...DEFAULT_SCORING, ...(editing?.scoring || {}) };
  const maxInput = el("input", { type: "number", min: "10", max: "1000", value: baseScoring.maxScore });
  const corrInput = el("input", { type: "number", min: "1", max: "100", value: baseScoring.correctPoints });
  const wrongInput = el("input", { type: "number", min: "0", max: "100", value: baseScoring.wrongPenalty });
  const bonusInput = el("input", { type: "number", min: "0", max: "1000", value: baseScoring.masteryBonus });
  const coinsInput = el("input", { type: "number", min: "0", max: "100", value: baseScoring.coinsPerCorrect });
  const scoringPanel = el("details", { class: "scoring-panel", open: "true" },
    el("summary", {}, "SmartScore & rewards"),
    el("div", { class: "row-3" },
      el("div", { class: "field" }, el("label", {}, "Max SmartScore"), maxInput),
      el("div", { class: "field" }, el("label", {}, "+ per correct"), corrInput),
      el("div", { class: "field" }, el("label", {}, "− per wrong"), wrongInput),
    ),
    el("div", { class: "row-2" },
      el("div", { class: "field" }, el("label", {}, "Mastery bonus 🪙"), bonusInput),
      el("div", { class: "field" }, el("label", {}, "Coins per correct 🪙"), coinsInput),
    ),
  );
  root.appendChild(scoringPanel);

  // Questions
  const qList = el("div");
  const questions = editing ? JSON.parse(JSON.stringify(editing.questions)) : [
    { type: "mc", prompt: "", choices: ["", "", "", ""], answer: 0 }
  ];

  function refreshQs() {
    qList.innerHTML = "";
    questions.forEach((q, idx) => qList.appendChild(qBuilder(q, idx, questions, refreshQs)));
  }
  refreshQs();

  root.appendChild(el("div", { style: "display:flex;justify-content:space-between;align-items:center;margin:6px 0 8px" },
    el("h3", { style: "margin:0;font-size:16px" }, "Questions"),
    el("span", { class: "muted", style: "font-size:13px" }, `${questions.length} total`)
  ));
  root.appendChild(qList);

  const addBar = el("div", { style: "display:flex;gap:8px;margin-top:6px;flex-wrap:wrap" });
  const types = [
    ["+ Multiple choice", () => ({ type: "mc", prompt: "", choices: ["","","",""], answer: 0 })],
    ["+ Multi-select",    () => ({ type: "multi", prompt: "", choices: ["","","",""], answers: [] })],
    ["+ True / False",    () => ({ type: "tf", prompt: "", answer: true })],
    ["+ Typed answer",    () => ({ type: "text", prompt: "", answer: "", alts: [] })],
    ["+ Number",          () => ({ type: "num", prompt: "", answer: 0, tolerance: 0 })],
  ];
  types.forEach(([label, mk]) => addBar.appendChild(el("button", { class: "btn btn-sm",
    onclick: () => { questions.push(mk()); refreshQs(); }
  }, label)));
  root.appendChild(addBar);

  const errBox = el("div", { style: "color:#aa2f2f;margin-top:10px;font-size:14px" });
  root.appendChild(errBox);

  function buildSkillObj() {
    const scoring = {
      maxScore: clampInt(maxInput.value, 10, 1000, 100),
      correctPoints: clampInt(corrInput.value, 1, 100, 6),
      wrongPenalty: clampInt(wrongInput.value, 0, 100, 6),
      masteryBonus: clampInt(bonusInput.value, 0, 1000, 25),
      coinsPerCorrect: clampInt(coinsInput.value, 0, 100, 2),
    };
    const sectionName = (currentSectionName || "Community").trim();
    const finalCode = (codeInput.value.trim() || nextCodeFor(currentSubject, currentGrade, currentLetter, editing?.id)).toUpperCase();
    return {
      id: editing?.id || ("s-" + rand()),
      subject: currentSubject,
      grade: currentGrade,
      name: nameInput.value.trim(),
      group: `${currentLetter}. ${sectionName}`,
      code: finalCode,
      questions: questions.map(cleanQuestion),
      scoring,
      builtin: false,
      author: state.profile.name || "anon",
    };
  }

  root.appendChild(el("div", { class: "actions" },
    el("button", { class: "btn btn-sm", onclick: () => history.back() }, "Cancel"),
    editing && !editing.builtin ? el("button", { class: "btn btn-sm btn-danger", onclick: () => {
      if (confirm("Delete this skill?")) {
        state.skills = state.skills.filter(s => s.id !== editing.id);
        delete state.progress[editing.id];
        save(); toast("Skill deleted"); go("/subject/" + editing.subject);
      }
    } }, "Delete") : null,
    el("button", { class: "btn btn-sm", onclick: () => {
      const err = validateSkill(questions, nameInput.value);
      if (err) { errBox.textContent = err; return; }
      const skillObj = buildSkillObj();
      showShareLink("skill", skillObj);
    } }, "🔗 Get share link"),
    el("button", { class: "btn btn-primary", onclick: () => {
      const err = validateSkill(questions, nameInput.value);
      if (err) { errBox.textContent = err; return; }
      const skillObj = buildSkillObj();
      if (editing) {
        const idx = state.skills.findIndex(s => s.id === editing.id);
        state.skills[idx] = { ...editing, ...skillObj };
        toast("Skill updated");
      } else {
        state.skills.push(skillObj);
        state.coins += 10;
        toast("Skill published! +10 🪙");
      }
      save();
      go(`/skill/${skillObj.id}`);
    } }, editing ? "Save changes" : "Publish skill")
  ));

  return root;
}

function validateSkill(questions, name) {
  if (!name.trim()) return "Skill name is required.";
  if (questions.length === 0) return "Add at least one question.";
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.prompt.trim()) return `Question ${i+1} needs a prompt.`;
    if (q.type === "mc") {
      const filled = q.choices.filter(c => c.trim()).length;
      if (filled < 2) return `Question ${i+1} needs at least 2 choices.`;
      if (q.answer == null || q.answer >= q.choices.length || !q.choices[q.answer]?.trim())
        return `Pick the correct answer for question ${i+1}.`;
    } else if (q.type === "multi") {
      const filled = q.choices.filter(c => c.trim()).length;
      if (filled < 2) return `Question ${i+1} needs at least 2 choices.`;
      if (!q.answers || q.answers.length === 0) return `Mark at least one correct answer for question ${i+1}.`;
    } else if (q.type === "num") {
      if (!isFinite(q.answer)) return `Question ${i+1} needs a numeric answer.`;
    } else if (q.type === "text") {
      if (!String(q.answer).trim()) return `Question ${i+1} needs an answer.`;
    }
  }
  return null;
}

function cleanQuestion(q) {
  if (q.type === "mc") {
    return { type: "mc", prompt: q.prompt.trim(), image: q.image || null,
      choices: q.choices.map(c => c.trim()).filter(c => c.length > 0),
      answer: clampAnswer(q.answer, q.choices) };
  } else if (q.type === "multi") {
    const filtered = q.choices.map(c => c.trim());
    const indexMap = filtered.map((c, i) => c.length > 0 ? i : -1).filter(i => i >= 0);
    const newChoices = indexMap.map(i => filtered[i]);
    const newAnswers = (q.answers || []).filter(a => indexMap.includes(a)).map(a => indexMap.indexOf(a));
    return { type: "multi", prompt: q.prompt.trim(), image: q.image || null,
      choices: newChoices, answers: newAnswers };
  } else if (q.type === "tf") {
    return { type: "tf", prompt: q.prompt.trim(), image: q.image || null, answer: !!q.answer };
  } else if (q.type === "num") {
    return { type: "num", prompt: q.prompt.trim(), image: q.image || null,
      answer: parseFloat(q.answer), tolerance: parseFloat(q.tolerance) || 0 };
  }
  return { type: "text", prompt: q.prompt.trim(), image: q.image || null,
    answer: String(q.answer).trim(),
    alts: (q.alts || []).map(a => String(a).trim()).filter(a => a.length > 0) };
}

function clampAnswer(answer, choices) {
  const filtered = choices.map(c => c.trim()).filter(c => c.length > 0);
  if (answer >= filtered.length) return 0;
  return Number(answer) || 0;
}
function clampInt(v, lo, hi, def) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return def;
  return Math.min(hi, Math.max(lo, n));
}
function rand() { return Math.random().toString(36).slice(2, 9); }

function qBuilder(q, idx, list, refresh) {
  const card = el("div", { class: "q-builder" });
  const typeLabel = {
    mc: "Multiple choice",
    multi: "Multi-select",
    tf: "True / False",
    text: "Typed answer",
    num: "Number"
  }[q.type] || q.type;

  const head = el("h4", {});
  head.appendChild(el("span", {}, `Q${idx + 1} · ${typeLabel}`));
  const actions = el("div", { class: "q-actions" });
  if (idx > 0) actions.appendChild(el("button", { class: "btn btn-sm btn-icon", title: "Move up",
    onclick: () => { [list[idx-1], list[idx]] = [list[idx], list[idx-1]]; refresh(); } }, "↑"));
  if (idx < list.length - 1) actions.appendChild(el("button", { class: "btn btn-sm btn-icon", title: "Move down",
    onclick: () => { [list[idx+1], list[idx]] = [list[idx], list[idx+1]]; refresh(); } }, "↓"));
  actions.appendChild(el("button", { class: "btn btn-sm btn-icon", title: "Duplicate",
    onclick: () => { list.splice(idx + 1, 0, JSON.parse(JSON.stringify(q))); refresh(); } }, "⎘"));
  actions.appendChild(el("button", { class: "btn btn-sm btn-danger btn-icon", title: "Remove",
    onclick: () => { if (list.length > 1) { list.splice(idx, 1); refresh(); } else toast("Must have at least 1 question"); } }, "✕"));
  head.appendChild(actions);
  card.appendChild(head);

  // Prompt
  const promptInput = el("textarea", { placeholder: "Enter the question...", rows: 2 });
  promptInput.value = q.prompt;
  promptInput.oninput = () => { q.prompt = promptInput.value; };
  card.appendChild(promptInput);

  // Image
  card.appendChild(buildImageRow(q));

  // Type-specific
  if (q.type === "mc") {
    q.choices = q.choices.length ? q.choices : ["", "", "", ""];
    const wrap = el("div", { style: "margin-top:8px" });
    function paint() {
      wrap.innerHTML = "";
      q.choices.forEach((c, i) => {
        const radio = el("input", { type: "radio", name: `q${idx}-mc`, value: i });
        if (q.answer === i) radio.checked = true;
        radio.onchange = () => { q.answer = i; };
        const inp = el("input", { type: "text", placeholder: `Choice ${i+1}`, value: c });
        inp.oninput = () => { q.choices[i] = inp.value; };
        const rm = el("button", { class: "btn btn-sm btn-icon btn-danger", title: "Remove choice",
          onclick: () => { q.choices.splice(i, 1); if (q.answer >= q.choices.length) q.answer = 0; paint(); } }, "✕");
        wrap.appendChild(el("div", { class: "choice-row" }, radio, inp, rm));
      });
      wrap.appendChild(el("button", { class: "btn btn-sm",
        onclick: () => { q.choices.push(""); paint(); } }, "+ Add choice"));
    }
    paint();
    card.appendChild(wrap);
    card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" }, "Select the radio next to the correct answer."));
  } else if (q.type === "multi") {
    q.choices = q.choices.length ? q.choices : ["", "", "", ""];
    q.answers = q.answers || [];
    const wrap = el("div", { style: "margin-top:8px" });
    function paint() {
      wrap.innerHTML = "";
      q.choices.forEach((c, i) => {
        const cb = el("input", { type: "checkbox" });
        if (q.answers.includes(i)) cb.checked = true;
        cb.onchange = () => {
          if (cb.checked) q.answers = [...new Set([...q.answers, i])];
          else q.answers = q.answers.filter(a => a !== i);
        };
        const inp = el("input", { type: "text", placeholder: `Choice ${i+1}`, value: c });
        inp.oninput = () => { q.choices[i] = inp.value; };
        const rm = el("button", { class: "btn btn-sm btn-icon btn-danger",
          onclick: () => { q.choices.splice(i, 1); q.answers = q.answers.filter(a => a !== i).map(a => a > i ? a - 1 : a); paint(); } }, "✕");
        wrap.appendChild(el("div", { class: "choice-row" }, cb, inp, rm));
      });
      wrap.appendChild(el("button", { class: "btn btn-sm",
        onclick: () => { q.choices.push(""); paint(); } }, "+ Add choice"));
    }
    paint();
    card.appendChild(wrap);
    card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" }, "Check every correct answer."));
  } else if (q.type === "tf") {
    const sel = el("select", {},
      el("option", { value: "true" }, "True"),
      el("option", { value: "false" }, "False"));
    sel.value = q.answer ? "true" : "false";
    sel.onchange = () => { q.answer = sel.value === "true"; };
    card.appendChild(el("div", { class: "field", style: "margin-top:8px" }, el("label", {}, "Correct answer"), sel));
  } else if (q.type === "num") {
    const ans = el("input", { type: "number", step: "any", value: q.answer, placeholder: "Numeric answer" });
    ans.oninput = () => { q.answer = parseFloat(ans.value); };
    const tol = el("input", { type: "number", step: "any", min: "0", value: q.tolerance || 0, placeholder: "Tolerance" });
    tol.oninput = () => { q.tolerance = parseFloat(tol.value) || 0; };
    card.appendChild(el("div", { class: "row-2", style: "margin-top:8px" },
      el("div", { class: "field" }, el("label", {}, "Correct answer"), ans),
      el("div", { class: "field" }, el("label", {}, "Tolerance (±)"), tol),
    ));
  } else { // text
    const ans = el("input", { type: "text", placeholder: "Correct answer (case-insensitive)", value: q.answer || "" });
    ans.oninput = () => { q.answer = ans.value; };
    card.appendChild(el("div", { class: "field", style: "margin-top:8px" }, el("label", {}, "Correct answer"), ans));
    const altsInput = el("input", { type: "text", placeholder: "Alternate accepted answers, comma-separated",
      value: (q.alts || []).join(", ") });
    altsInput.oninput = () => { q.alts = altsInput.value.split(",").map(s => s.trim()).filter(s => s); };
    card.appendChild(el("div", { class: "field" }, el("label", {}, "Other accepted answers (optional)"), altsInput));
  }
  return card;
}

function buildImageRow(q) {
  const row = el("div", { class: "image-upload" });
  const preview = el("img", { class: "preview", style: q.image ? "" : "display:none", src: q.image || "" });
  const fileInput = el("input", { type: "file", accept: "image/*" });
  fileInput.onchange = async () => {
    const f = fileInput.files[0];
    if (!f) return;
    if (f.size > 1024 * 1024) {
      toast("Image too large — please use under 1MB or it'll fill storage");
    }
    const data = await fileToDataUrl(f, 800);
    q.image = data;
    preview.src = data;
    preview.style.display = "";
  };
  const label = el("label", { class: "btn btn-sm" }, q.image ? "Change image" : "📷 Add image", fileInput);
  const clearBtn = el("button", { class: "btn btn-sm btn-danger", style: q.image ? "" : "display:none",
    onclick: () => { q.image = null; preview.style.display = "none"; preview.src = ""; clearBtn.style.display = "none"; label.firstChild.textContent = "📷 Add image"; } }, "Remove");
  if (q.image) clearBtn.style.display = "";
  row.appendChild(preview);
  row.appendChild(label);
  row.appendChild(clearBtn);
  return row;
}

function fileToDataUrl(file, maxDim = 800) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => {
      // Resize via canvas to keep storage manageable
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => resolve(r.result); // fall back to original
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

// ---------- Prizes ----------
function renderPrizes() {
  const root = el("div");
  root.appendChild(el("div", { class: "page-head" },
    el("div", {},
      el("h1", {}, "🏆 Prize shop"),
      el("div", { class: "subtitle" }, `You have ${state.coins} coins. Redeem prizes — or design your own.`)
    ),
    el("button", { class: "btn btn-primary", onclick: () => go("/create-prize") }, "+ Create a prize")
  ));

  if (state.redeemed.length > 0) {
    root.appendChild(el("h2", { style: "margin:8px 0 12px;font-size:18px" }, "Your trophy case"));
    const trophy = el("div", { class: "prize-grid" });
    state.redeemed.slice().reverse().forEach(r => {
      const p = state.prizes.find(p => p.id === r.prizeId);
      if (!p) return;
      trophy.appendChild(el("div", { class: "prize-card" },
        el("div", { class: "prize-emoji" }, p.image ? el("img", { src: p.image }) : p.emoji),
        el("div", { class: "prize-name" }, p.name),
        el("div", { class: "prize-desc" }, "Won " + new Date(r.at).toLocaleDateString())
      ));
    });
    root.appendChild(trophy);
    root.appendChild(el("h2", { style: "margin:24px 0 12px;font-size:18px" }, "Available prizes"));
  }

  const grid = el("div", { class: "prize-grid" });
  state.prizes.forEach(p => {
    const can = state.coins >= p.cost;
    const card = el("div", { class: "prize-card" + (can ? "" : " locked") });
    card.appendChild(el("div", { class: "prize-emoji" }, p.image ? el("img", { src: p.image }) : p.emoji));
    card.appendChild(el("div", { class: "prize-name" }, p.name));
    card.appendChild(el("div", { class: "prize-desc" }, p.desc));
    card.appendChild(el("div", { class: "prize-cost" }, `🪙 ${p.cost}`));
    const btnRow = el("div", { style: "display:flex;gap:6px" });
    btnRow.appendChild(el("button", { class: "btn btn-primary btn-sm", style: "flex:1", disabled: !can ? "true" : null,
      onclick: () => redeemPrize(p) }, can ? "Redeem" : "Need more 🪙"));
    if (!p.builtin) {
      btnRow.appendChild(el("button", { class: "btn btn-sm", onclick: () => go(`/create-prize/${p.id}`) }, "Edit"));
      btnRow.appendChild(el("button", { class: "btn btn-sm", title: "Share", onclick: () => showShareLink("prize", p) }, "🔗"));
    }
    card.appendChild(btnRow);
    grid.appendChild(card);
  });
  root.appendChild(grid);
  return root;
}

function redeemPrize(p) {
  if (state.coins < p.cost) return;
  state.coins -= p.cost;
  state.redeemed.push({ prizeId: p.id, at: Date.now() });
  save();
  showModal(el("div", {},
    el("div", { style: "font-size:80px;text-align:center" }, p.image ? el("img", { src: p.image, style: "max-height:120px;border-radius:8px" }) : p.emoji),
    el("h3", { style: "text-align:center;margin-top:8px" }, "You won " + p.name + "!"),
    el("p", { class: "muted", style: "text-align:center" }, p.desc),
    el("div", { class: "actions" }, el("button", { class: "btn btn-primary", onclick: closeModal }, "Awesome"))
  ));
  render();
}

function renderPrizeBuilder(prizeId) {
  const editing = prizeId ? state.prizes.find(p => p.id === prizeId) : null;
  const root = el("div", { class: "form-card" });
  root.appendChild(el("h2", {}, editing ? "Edit prize" : "Create a prize"));
  root.appendChild(el("p", { class: "help" }, "Add a prize learners can redeem. Use an emoji icon, or upload an image."));

  const name = el("input", { value: editing?.name || "", placeholder: "Prize name" });
  const emoji = el("input", { value: editing?.emoji || "🎉", placeholder: "Emoji icon", maxlength: 4 });
  const desc = el("textarea", { placeholder: "What is it? Why is it cool?", rows: 3 }); desc.value = editing?.desc || "";
  const cost = el("input", { type: "number", min: "10", value: editing?.cost || 100 });

  // Image upload
  const tempPrize = { image: editing?.image || null };
  const imgRow = el("div", { class: "image-upload" });
  const preview = el("img", { class: "preview", style: tempPrize.image ? "" : "display:none", src: tempPrize.image || "" });
  const fileInput = el("input", { type: "file", accept: "image/*" });
  fileInput.onchange = async () => {
    const f = fileInput.files[0];
    if (!f) return;
    const data = await fileToDataUrl(f, 600);
    tempPrize.image = data;
    preview.src = data;
    preview.style.display = "";
    clearBtn.style.display = "";
  };
  const label = el("label", { class: "btn btn-sm" }, "📷 Upload image", fileInput);
  const clearBtn = el("button", { class: "btn btn-sm btn-danger", style: tempPrize.image ? "" : "display:none",
    onclick: () => { tempPrize.image = null; preview.style.display = "none"; clearBtn.style.display = "none"; } }, "Remove");
  imgRow.appendChild(preview);
  imgRow.appendChild(label);
  imgRow.appendChild(clearBtn);

  root.appendChild(el("div", { class: "field" }, el("label", {}, "Name"), name));
  root.appendChild(el("div", { class: "row-2" },
    el("div", { class: "field" }, el("label", {}, "Emoji (used if no image)"), emoji),
    el("div", { class: "field" }, el("label", {}, "Cost (coins)"), cost),
  ));
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Image (optional, replaces emoji)"), imgRow));
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Description"), desc));

  const err = el("div", { style: "color:#aa2f2f;font-size:14px" });
  root.appendChild(err);

  function buildPrizeObj() {
    return {
      id: editing?.id || ("p-" + rand()),
      name: name.value.trim(),
      emoji: emoji.value.trim() || "🎁",
      desc: desc.value.trim(),
      cost: Number(cost.value),
      image: tempPrize.image,
      builtin: false,
      author: state.profile.name || "anon",
    };
  }

  root.appendChild(el("div", { class: "actions" },
    el("button", { class: "btn btn-sm", onclick: () => history.back() }, "Cancel"),
    editing && !editing.builtin ? el("button", { class: "btn btn-sm btn-danger", onclick: () => {
      if (confirm("Delete this prize?")) {
        state.prizes = state.prizes.filter(p => p.id !== editing.id);
        save(); toast("Prize deleted"); go("/prizes");
      }
    } }, "Delete") : null,
    el("button", { class: "btn btn-sm", onclick: () => {
      if (!name.value.trim()) return err.textContent = "Name required.";
      showShareLink("prize", buildPrizeObj());
    } }, "🔗 Get share link"),
    el("button", { class: "btn btn-primary", onclick: () => {
      if (!name.value.trim()) return err.textContent = "Name required.";
      if (Number(cost.value) < 10) return err.textContent = "Cost must be at least 10 coins.";
      const obj = buildPrizeObj();
      if (editing) {
        const i = state.prizes.findIndex(p => p.id === editing.id);
        state.prizes[i] = { ...editing, ...obj };
        toast("Prize updated");
      } else {
        state.prizes.push(obj);
        toast("Prize added!");
      }
      save();
      go("/prizes");
    } }, editing ? "Save" : "Publish prize")
  ));
  return root;
}

// ---------- Profile / Awards / Recommendations ----------
function renderProfile() {
  const root = el("div", { class: "form-card" });
  root.appendChild(el("h2", {}, "Your profile"));
  const completed = state.skills.filter(s => {
    const max = s.scoring?.maxScore || 100;
    return (state.progress[s.id]?.score || 0) >= max;
  }).length;
  const totalAttempts = Object.values(state.progress).reduce((a, p) => a + (p.attempts || 0), 0);

  root.appendChild(el("div", { class: "row-2", style: "margin-bottom:18px" },
    el("div", { class: "subject-card", style: "cursor:default" },
      el("div", { class: "icon", style: "background: var(--gold)" }, "🏆"),
      el("div", {}, el("h3", {}, completed + ""), el("div", { class: "count" }, "Skills mastered"))
    ),
    el("div", { class: "subject-card", style: "cursor:default" },
      el("div", { class: "icon", style: "background: var(--green)" }, "🎯"),
      el("div", {}, el("h3", {}, totalAttempts + ""), el("div", { class: "count" }, "Questions answered"))
    ),
  ));

  const nameI = el("input", { value: state.profile.name });
  const avI = el("input", { value: state.profile.avatar, maxlength: 2, style: "max-width:80px" });
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Display name"), nameI));
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Avatar (1-2 chars)"), avI));

  root.appendChild(el("div", { class: "actions" },
    el("button", { class: "btn btn-danger btn-sm", onclick: () => {
      if (confirm("Reset all progress, coins, created skills and prizes?")) {
        state = defaultState(); save(); toast("Reset complete"); go("/");
      }
    } }, "Reset everything"),
    el("button", { class: "btn btn-primary", onclick: () => {
      state.profile.name = nameI.value.trim() || "Learner";
      state.profile.avatar = (avI.value.trim() || "L").slice(0, 2);
      save(); toast("Profile saved"); render();
    } }, "Save")
  ));
  return root;
}

function renderAwards() {
  const root = el("div");
  root.appendChild(el("div", { class: "page-head" }, el("div", {},
    el("h1", {}, "Awards"),
    el("div", { class: "subtitle" }, "Track mastery across every subject.")
  )));
  const grid = el("div", { class: "subject-grid" });
  SUBJECTS.forEach(s => {
    const skills = state.skills.filter(sk => sk.subject === s.id);
    const mastered = skills.filter(sk => {
      const max = sk.scoring?.maxScore || 100;
      return (state.progress[sk.id]?.score || 0) >= max;
    }).length;
    const card = el("div", { class: "subject-card", onclick: () => go(`/subject/${s.id}`) });
    card.appendChild(el("div", { class: "icon", style: `background:${s.color}` }, s.icon));
    card.appendChild(el("div", { style: "flex:1" },
      el("h3", {}, s.name),
      el("div", { class: "count" }, `${mastered} of ${skills.length} mastered`),
      el("div", { class: "bar", style: "margin-top:6px" }, el("span", { style: `width:${skills.length ? (mastered / skills.length) * 100 : 0}%` })),
    ));
    grid.appendChild(card);
  });
  root.appendChild(grid);
  return root;
}

function renderRecommendations() {
  const root = el("div");
  root.appendChild(el("div", { class: "page-head" }, el("div", {},
    el("h1", {}, "Recommendations"),
    el("div", { class: "subtitle" }, "Skills picked just for you, based on your progress.")
  )));
  const inProgress = state.skills.filter(s => {
    const sc = state.progress[s.id]?.score || 0;
    const max = s.scoring?.maxScore || 100;
    return sc > 0 && sc < max;
  }).slice(0, 4);
  const untouched = state.skills.filter(s => !(state.progress[s.id])).slice(0, 6);
  const list = [...inProgress, ...untouched].slice(0, 8);
  if (list.length === 0) {
    root.appendChild(el("div", { class: "empty" }, "All caught up! Try creating a new skill."));
    return root;
  }
  const sec = el("div", { class: "skill-section" });
  list.forEach(s => sec.appendChild(skillRow(s, state.progress[s.id])));
  root.appendChild(sec);
  return root;
}

function renderSearch(query) {
  const root = el("div");
  const q = query.trim().toLowerCase();
  root.appendChild(el("div", { class: "page-head" }, el("div", {},
    el("h1", {}, q ? `Results for "${query}"` : "Search"),
    el("div", { class: "subtitle" }, "Find any skill by name, topic, or code.")
  )));
  if (!q) { root.appendChild(el("div", { class: "muted" }, "Type in the search bar above.")); return root; }
  const matches = state.skills.filter(s =>
    s.name.toLowerCase().includes(q) ||
    (s.group || "").toLowerCase().includes(q) ||
    (s.code || "").toLowerCase().includes(q) ||
    (s.author || "").toLowerCase().includes(q)
  );
  if (matches.length === 0) { root.appendChild(el("div", { class: "empty" }, `No skills matched "${query}".`)); return root; }
  const sec = el("div", { class: "skill-section" });
  matches.forEach(s => sec.appendChild(skillRow(s, state.progress[s.id])));
  root.appendChild(sec);
  return root;
}

// ---------- Sharing & import ----------
function renderShareImport() {
  const root = el("div", { class: "form-card" });
  root.appendChild(el("h2", {}, "Share & import"));
  root.appendChild(el("p", { class: "help" },
    "Each device stores its own skills. To let someone else play your skill, send them a share link — when they open it, the skill gets added to their library."));

  // Import via paste
  const importInput = el("textarea", { rows: 3, placeholder: "Paste a 1XL share link or share code here..." });
  const importBtn = el("button", { class: "btn btn-primary", onclick: () => {
    const v = importInput.value.trim();
    if (!v) return;
    const code = v.includes("import=") ? v.split("import=")[1].split("&")[0].split("#")[0] : v;
    handleImportFromParam(code);
    importInput.value = "";
  } }, "Import");
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Import a share link or code"), importInput));
  root.appendChild(el("div", { style: "display:flex;gap:8px" }, importBtn));

  // Export everything
  root.appendChild(el("hr", { class: "sep" }));
  root.appendChild(el("h3", {}, "Backup"));
  root.appendChild(el("p", { class: "help" }, "Download all your created skills, prizes, progress, and coins as a JSON file. You can restore it on any device."));
  root.appendChild(el("div", { style: "display:flex;gap:8px;flex-wrap:wrap" },
    el("button", { class: "btn", onclick: exportBackup }, "📥 Download backup"),
    el("label", { class: "btn" }, "📤 Upload backup",
      el("input", { type: "file", accept: ".json,application/json", style: "display:none",
        onchange: (e) => importBackup(e.target.files[0]) })
    )
  ));

  // List of my skills with share buttons
  root.appendChild(el("hr", { class: "sep" }));
  root.appendChild(el("h3", {}, "Your created skills"));
  const mySkills = state.skills.filter(s => !s.builtin);
  if (mySkills.length === 0) {
    root.appendChild(el("div", { class: "muted" }, "You haven't created any skills yet."));
  } else {
    mySkills.forEach(s => {
      const row = el("div", { style: "display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)" },
        el("div", {}, el("b", {}, s.name), el("div", { class: "muted", style: "font-size:13px" },
          `${s.code} · ${s.questions.length} Q · ${s.subject} ${s.grade}`)),
        el("div", { style: "display:flex;gap:6px" },
          el("button", { class: "btn btn-sm", onclick: () => showShareLink("skill", s) }, "🔗 Share"),
          el("button", { class: "btn btn-sm", onclick: () => go(`/create-skill/${s.id}`) }, "Edit"),
        )
      );
      root.appendChild(row);
    });
  }

  root.appendChild(el("h3", { style: "margin-top:18px" }, "Your created prizes"));
  const myPrizes = state.prizes.filter(p => !p.builtin);
  if (myPrizes.length === 0) {
    root.appendChild(el("div", { class: "muted" }, "You haven't created any prizes yet."));
  } else {
    myPrizes.forEach(p => {
      const row = el("div", { style: "display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)" },
        el("div", {}, el("b", {}, p.emoji + " " + p.name), el("div", { class: "muted", style: "font-size:13px" }, `${p.cost} coins`)),
        el("div", { style: "display:flex;gap:6px" },
          el("button", { class: "btn btn-sm", onclick: () => showShareLink("prize", p) }, "🔗 Share"),
          el("button", { class: "btn btn-sm", onclick: () => go(`/create-prize/${p.id}`) }, "Edit"),
        )
      );
      root.appendChild(row);
    });
  }

  return root;
}

function showShareLink(kind, obj) {
  const code = encodePayload({ kind, payload: obj });
  const baseUrl = location.href.split("#")[0];
  const link = `${baseUrl}#/?import=${code}`;
  const linkInput = el("input", { value: link, readonly: "true" });
  const codeInput = el("input", { value: code, readonly: "true" });
  showModal(el("div", {},
    el("h3", {}, `Share this ${kind}`),
    el("p", { class: "muted" }, `Anyone who opens this link in 1XL gets the ${kind} added to their library.`),
    el("div", { class: "share-link" },
      linkInput,
      el("button", { class: "btn btn-primary btn-sm", onclick: () => { linkInput.select(); navigator.clipboard?.writeText(link); toast("Link copied!"); } }, "Copy link")
    ),
    el("p", { class: "muted", style: "margin-top:18px" }, "Or share just the code (paste it into the Share & import page):"),
    el("div", { class: "share-link" },
      codeInput,
      el("button", { class: "btn btn-sm", onclick: () => { codeInput.select(); navigator.clipboard?.writeText(code); toast("Code copied!"); } }, "Copy code")
    ),
    el("div", { class: "actions" }, el("button", { class: "btn", onclick: closeModal }, "Done"))
  ));
}

function encodePayload(obj) {
  // base64url-encoded JSON
  const json = JSON.stringify(obj);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodePayload(code) {
  try {
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((code.length + 3) % 4);
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch (e) { return null; }
}

function handleImportFromParam(code) {
  const decoded = decodePayload(code);
  if (!decoded) { toast("Invalid share code"); return; }
  if (decoded.kind === "skill") {
    const s = decoded.payload;
    s.id = "s-" + rand(); // new id to avoid collisions
    s.builtin = false;
    s.imported = true;
    s.scoring = { ...DEFAULT_SCORING, ...(s.scoring || {}) };
    if (state.skills.some(x => x.name === s.name && x.author === s.author)) {
      toast("That skill is already in your library.");
      return;
    }
    state.skills.push(s);
    save();
    toast(`Imported skill: ${s.name}`);
    // Clear ?import= so reload doesn't re-import
    history.replaceState(null, "", "#/skill/" + s.id);
    render();
  } else if (decoded.kind === "prize") {
    const p = decoded.payload;
    p.id = "p-" + rand();
    p.builtin = false;
    p.imported = true;
    state.prizes.push(p);
    save();
    toast(`Imported prize: ${p.name}`);
    history.replaceState(null, "", "#/prizes");
    render();
  } else {
    toast("Unknown share type.");
  }
}

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `1xl-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function importBackup(file) {
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const data = JSON.parse(r.result);
      if (!data.skills || !data.prizes) throw new Error("Invalid backup");
      state = data;
      save();
      toast("Backup restored!");
      go("/");
    } catch (e) {
      toast("Could not read backup: " + e.message);
    }
  };
  r.readAsText(file);
}

// ---------- UI utilities ----------
function toast(msg) {
  const t = el("div", { class: "toast" }, msg);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2700);
}
function showModal(content) {
  const root = document.getElementById("modal-root");
  root.innerHTML = "";
  const back = el("div", { class: "modal-backdrop", onclick: (e) => { if (e.target === back) closeModal(); } },
    el("div", { class: "modal-card" }, content)
  );
  root.appendChild(back);
}
function closeModal() { document.getElementById("modal-root").innerHTML = ""; }
