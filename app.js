// 1XL — IXL-styled learning platform with user-authored skills & prizes.
// Pure client-side, persisted in localStorage.

const STORAGE_KEY = "1xl-state-v1";

const SUBJECTS = [
  { id: "math",    name: "Math",           color: "#f08d36", icon: "➗" },
  { id: "ela",     name: "Language arts",  color: "#b13b8e", icon: "📖" },
  { id: "science", name: "Science",        color: "#2aa84a", icon: "🔬" },
  { id: "social",  name: "Social studies", color: "#b6322f", icon: "🌎" },
  { id: "spanish", name: "Spanish",        color: "#2e7ad9", icon: "💬" },
  { id: "custom",  name: "My skills",      color: "#7c4ec5", icon: "⭐" },
];

const GRADES = ["Pre-K","K","1st","2nd","3rd","4th","5th","6th","7th","8th","Algebra 1","Geometry","Algebra 2"];

// Letter-section colors used for skill tree headings (rotates)
const LETTER_COLORS = ["#1ca64c","#f08d36","#b13b8e","#2e7ad9","#b6322f","#7c4ec5","#0e7a5e","#c9970d"];

// Seed skills, organized by lettered group so the IXL skill tree renders well.
const SEED_SKILLS = [
  // Math grade 3
  { id: "s-m-a1", subject: "math", grade: "3rd", group: "A. Multiplication", code: "A.1", name: "Multiplication facts up to 10",
    questions: [
      { type: "mc",   prompt: "What is 7 × 8?", choices: ["54","56","63","64"], answer: 1 },
      { type: "text", prompt: "Solve: 6 × 9 = ?", answer: "54" },
      { type: "mc",   prompt: "What is 4 × 7?", choices: ["28","24","32","21"], answer: 0 },
    ]},
  { id: "s-m-a2", subject: "math", grade: "3rd", group: "A. Multiplication", code: "A.2", name: "Multiply by 11 and 12",
    questions: [
      { type: "text", prompt: "11 × 9 = ?", answer: "99" },
      { type: "mc",   prompt: "12 × 7 = ?", choices: ["84","72","96","94"], answer: 0 },
    ]},
  { id: "s-m-b1", subject: "math", grade: "3rd", group: "B. Fractions", code: "B.1", name: "Identify fractions on a number line",
    questions: [
      { type: "mc",   prompt: "Which fraction is halfway between 0 and 1?", choices: ["1/4","1/2","3/4","1/3"], answer: 1 },
      { type: "text", prompt: "Write the fraction shown by 3 of 4 equal parts.", answer: "3/4" },
    ]},
  { id: "s-m-b2", subject: "math", grade: "3rd", group: "B. Fractions", code: "B.2", name: "Equivalent fractions",
    questions: [
      { type: "mc", prompt: "Which is equivalent to 1/2?", choices: ["2/3","3/6","1/3","2/5"], answer: 1 },
    ]},
  // Math grade 5
  { id: "s-m-c1", subject: "math", grade: "5th", group: "C. Decimals", code: "C.1", name: "Add and subtract decimals",
    questions: [
      { type: "text", prompt: "0.7 + 0.45 = ?", answer: "1.15" },
      { type: "mc",   prompt: "5.2 − 1.75 = ?", choices: ["3.45","3.55","4.45","3.25"], answer: 0 },
    ]},
  { id: "s-m-c2", subject: "math", grade: "5th", group: "C. Decimals", code: "C.2", name: "Multiply decimals by whole numbers",
    questions: [
      { type: "text", prompt: "0.6 × 4 = ?", answer: "2.4" },
    ]},
  // ELA
  { id: "s-e-a1", subject: "ela", grade: "4th", group: "A. Vocabulary", code: "A.1", name: "Synonyms",
    questions: [
      { type: "mc", prompt: "Choose the synonym for 'happy'.", choices: ["sad","joyful","tired","angry"], answer: 1 },
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
  // Science
  { id: "s-s-a1", subject: "science", grade: "4th", group: "A. Life science", code: "A.1", name: "Plant and animal cells",
    questions: [
      { type: "mc", prompt: "Which structure is in plant cells but NOT animal cells?",
        choices: ["Nucleus","Cell wall","Mitochondria","Membrane"], answer: 1 },
      { type: "text", prompt: "Photosynthesis happens in which organelle?", answer: "chloroplast" },
    ]},
  { id: "s-s-b1", subject: "science", grade: "4th", group: "B. Earth science", code: "B.1", name: "The water cycle",
    questions: [
      { type: "mc", prompt: "Water turns into vapor through...", choices: ["Condensation","Evaporation","Precipitation","Runoff"], answer: 1 },
    ]},
  // Social studies
  { id: "s-soc-a1", subject: "social", grade: "5th", group: "A. U.S. geography", code: "A.1", name: "Name the U.S. states",
    questions: [
      { type: "text", prompt: "Which state's capital is Sacramento?", answer: "california" },
      { type: "mc", prompt: "Which state is 'The Sunshine State'?",
        choices: ["Texas","Florida","Arizona","Nevada"], answer: 1 },
    ]},
  // Spanish
  { id: "s-sp-a1", subject: "spanish", grade: "K", group: "A. Greetings", code: "A.1", name: "Common greetings",
    questions: [
      { type: "mc", prompt: "How do you say 'Hello' in Spanish?",
        choices: ["Adiós","Hola","Gracias","Por favor"], answer: 1 },
      { type: "text", prompt: "Translate 'Good night' to Spanish (two words).", answer: "buenas noches" },
    ]},
  { id: "s-sp-b1", subject: "spanish", grade: "1st", group: "B. Numbers", code: "B.1", name: "Count to ten in Spanish",
    questions: [
      { type: "text", prompt: "How do you say '5' in Spanish?", answer: "cinco" },
    ]},
];

const SEED_PRIZES = [
  { id: "p-1", name: "Bronze trophy", emoji: "🥉", desc: "Your first taste of victory.", cost: 50, redeemable: true },
  { id: "p-2", name: "Silver medal",  emoji: "🥈", desc: "Halfway to legend status.",   cost: 150, redeemable: true },
  { id: "p-3", name: "Gold crown",    emoji: "👑", desc: "Reign over the leaderboard.", cost: 400, redeemable: true },
  { id: "p-4", name: "Mystery box",   emoji: "🎁", desc: "Who knows what's inside?",    cost: 100, redeemable: true },
  { id: "p-5", name: "Pet dragon",    emoji: "🐉", desc: "It mostly sleeps. Mostly.",   cost: 800, redeemable: true },
];

// ---------- State ----------
function defaultState() {
  return {
    skills: SEED_SKILLS.map(s => ({ ...s, builtin: true })),
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
    const skillIds = new Set(parsed.skills.map(s => s.id));
    def.skills.forEach(s => { if (!skillIds.has(s.id)) parsed.skills.push(s); });
    const prizeIds = new Set(parsed.prizes.map(p => p.id));
    def.prizes.forEach(p => { if (!prizeIds.has(p.id)) parsed.prizes.push(p); });
    return parsed;
  } catch {
    return defaultState();
  }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

// ---------- Router ----------
function parseHash() {
  const h = location.hash.replace(/^#/, "") || "/";
  const parts = h.split("/").filter(Boolean);
  return { path: parts[0] || "home", args: parts.slice(1) };
}

window.addEventListener("hashchange", render);
window.addEventListener("load", () => {
  document.getElementById("search").addEventListener("input", e => {
    if (parseHash().path === "search" || e.target.value.length >= 2) {
      location.hash = "#/search/" + encodeURIComponent(e.target.value);
    }
  });
  document.getElementById("avatar").addEventListener("click", () => {
    location.hash = "#/profile";
  });
  render();
});

function go(path) { location.hash = "#" + path; }

// ---------- Helpers ----------
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

// ---------- Render ----------
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
    case "search":   view.appendChild(renderSearch(decodeURIComponent(args[0] || ""))); break;
    default:         view.appendChild(renderHome()); break;
  }
}

function renderSubjectTabs(path, args) {
  const tabs = document.getElementById("subject-tabs");
  tabs.innerHTML = "";
  SUBJECTS.forEach(s => {
    const isActive = (path === "subject" && args[0] === s.id) || (path === "create-skill" && args[0] === s.id);
    const b = el("button", {
      class: "subject-tab" + (isActive ? " active" : ""),
      "data-color": s.id,
      onclick: () => go(`/subject/${s.id}`)
    }, s.name);
    tabs.appendChild(b);
  });
  // Prize shop tab
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
    el("button", { class: "btn btn-primary", onclick: () => go("/create-skill") }, "+ Create a skill")
  ));

  // Banner
  root.appendChild(el("div", { class: "ixl-banner" },
    el("div", { class: "icon" }, "🎯"),
    el("div", { class: "text" },
      el("h3", {}, "Earn coins by mastering skills"),
      el("p", {}, `You have ${state.coins} coins. Spend them on prizes — or design your own.`)
    ),
    el("button", { onclick: () => go("/prizes") }, "Go to prize shop"),
  ));

  // Subjects in IXL-card style
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

  // Continue learning
  const inProgress = state.skills
    .map(s => ({ s, p: state.progress[s.id] }))
    .filter(x => x.p && x.p.score > 0 && x.p.score < 100)
    .slice(0, 6);
  if (inProgress.length > 0) {
    root.appendChild(el("h2", { style: "margin:28px 0 12px;font-size:18px" }, "Continue where you left off"));
    const sec = el("div", { class: "skill-section" });
    inProgress.forEach(({ s, p }) => sec.appendChild(skillRow(s, p)));
    root.appendChild(sec);
  }

  return root;
}

// ---------- Subject (skill tree) ----------
function renderSubject(subjectId, grade) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const root = el("div");
  if (!subject) {
    root.appendChild(el("div", { class: "empty" }, "Subject not found."));
    return root;
  }

  // Page heading
  root.appendChild(el("div", { class: "page-head" },
    el("div", {},
      el("h1", {}, subject.name),
      el("div", { class: "subtitle" }, "Pick a grade, then choose any skill to start practicing.")
    ),
    el("button", { class: "btn btn-primary", onclick: () => go(`/create-skill/${subject.id}`) }, "+ Add a skill")
  ));

  // Grade strip (IXL style)
  const strip = el("div", { class: "grade-strip" });
  GRADES.forEach(g => {
    const has = state.skills.some(s => s.subject === subjectId && s.grade === g);
    const btn = el("button", {
      class: "grade-pill" + (grade === g ? " active" : ""),
      style: !has ? "opacity:0.5" : null,
      onclick: () => go(`/subject/${subject.id}/${encodeURIComponent(g)}`)
    }, g);
    strip.appendChild(btn);
  });
  root.appendChild(strip);

  // Default to first grade with content if none chosen
  let activeGrade = grade ? decodeURIComponent(grade) : null;
  if (!activeGrade) {
    const firstWith = GRADES.find(g => state.skills.some(s => s.subject === subjectId && s.grade === g));
    activeGrade = firstWith || GRADES[0];
  }

  // Layout: skill tree + side trophy panel
  const wrap = el("div", { class: "layout-with-side" });
  const treeCol = el("div");
  const sideCol = renderSubjectSide(subjectId);

  let skills = state.skills.filter(s => s.subject === subjectId && s.grade === activeGrade);

  if (skills.length === 0) {
    treeCol.appendChild(el("div", { class: "empty" },
      `No ${subject.name} skills for ${activeGrade} yet. `,
      el("a", { href: `#/create-skill/${subject.id}` }, "Be the first to add one!")
    ));
  } else {
    // Group by group label (e.g., "A. Multiplication")
    const groups = {};
    skills.forEach(s => {
      const k = s.group || "Other";
      (groups[k] = groups[k] || []).push(s);
    });

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
  return el("div", { class: "skill-row", onclick: () => go(`/skill/${s.id}`) },
    el("div", { class: "code" }, s.code || "—"),
    el("div", { class: "skill-name" },
      s.name,
      !s.builtin ? el("span", { class: "tag-new" }, "New") : null
    ),
    el("div", { class: "qmark", title: "About this skill" }, "?"),
    el("div", { class: "num-problems" }, `${s.questions.length} problems`),
    el("div", { class: "smartscore-mini" + (score >= 100 ? " done" : "") }, score + "")
  );
}

function renderSubjectSide(subjectId) {
  const side = el("div", { class: "side-card" });
  side.appendChild(el("h3", {}, "Awards in this subject"));
  const subjectSkills = state.skills.filter(s => s.subject === subjectId);
  const mastered = subjectSkills.filter(s => (state.progress[s.id]?.score || 0) >= 100).length;
  const total = subjectSkills.length;
  const pct = total === 0 ? 0 : Math.round((mastered / total) * 100);

  side.appendChild(el("div", { class: "trophy-row" },
    el("span", {}, "Skills mastered"),
    el("b", {}, `${mastered}/${total}`)
  ));
  side.appendChild(el("div", { class: "bar" }, el("span", { style: `width:${pct}%` })));
  side.appendChild(el("div", { class: "trophy-row" },
    el("span", { class: "muted" }, "Coins earned"),
    el("b", {}, `🪙 ${state.coins}`)
  ));
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
  const wrap = el("div", { class: "quiz-wrap" });
  const main = el("div", { class: "quiz-card" });
  const side = el("div", { class: "quiz-side" });
  wrap.appendChild(main);
  wrap.appendChild(side);
  root.appendChild(wrap);

  const session = {
    skill,
    qIdx: 0,
    score: state.progress[skill.id]?.score || 0,
    correctRun: 0,
    answeredCount: 0,
    rightCount: 0,
    coinsEarned: 0,
  };

  function renderSide() {
    side.innerHTML = "";
    side.appendChild(el("h3", {}, "SmartScore"));
    side.appendChild(el("div", { class: "score-ring", style: `--p:${session.score}` }, el("span", {}, session.score + "")));
    side.appendChild(el("div", { class: "muted", style: "text-align:center;margin-bottom:14px;font-size:13px" },
      session.score >= 100 ? "Mastered! 🎉" : "Get it to 100 to master this skill."));
    side.appendChild(el("div", { class: "bar-row" }, el("span", {}, "Answered"), el("b", {}, session.answeredCount + "")));
    side.appendChild(el("div", { class: "bar-row" }, el("span", {}, "Correct"), el("b", {}, session.rightCount + "")));
    side.appendChild(el("div", { class: "bar-row" }, el("span", {}, "Coins earned"), el("b", {}, "🪙 " + session.coinsEarned)));
    if (!skill.builtin) {
      side.appendChild(el("hr", { style: "border:none;border-top:1px solid var(--line);margin:14px 0" }));
      side.appendChild(el("button", { class: "btn btn-sm", style: "width:100%", onclick: () => go(`/create-skill/${skill.id}`) }, "Edit skill"));
    }
  }

  function renderQuestion() {
    main.innerHTML = "";
    const q = skill.questions[session.qIdx % skill.questions.length];
    const bread = el("div", { class: "quiz-bread" });
    bread.appendChild(document.createTextNode(`${subject?.name || ""} › ${(skill.group || "").replace(/^[A-Z]\.\s*/, "")} › `));
    bread.appendChild(el("span", { class: "code" }, skill.code || ""));
    main.appendChild(bread);
    main.appendChild(el("h2", { class: "quiz-title" }, skill.name));
    main.appendChild(el("div", { class: "quiz-q" }, q.prompt));

    if (q.type === "mc") {
      const choices = el("div", { class: "choices" });
      q.choices.forEach((c, i) => {
        const btn = el("button", { class: "choice", onclick: () => grade(i === q.answer, btn) }, c);
        choices.appendChild(btn);
      });
      main.appendChild(choices);
    } else {
      const input = el("input", { class: "text-input", placeholder: "Type your answer...", autofocus: "true" });
      const btn = el("button", { class: "btn btn-primary", style: "margin-top:14px" }, "Submit");
      btn.onclick = () => grade(normalize(input.value) === normalize(q.answer));
      input.addEventListener("keydown", e => { if (e.key === "Enter") btn.click(); });
      main.appendChild(input);
      main.appendChild(btn);
    }
  }

  function grade(correct, choiceBtn) {
    session.answeredCount++;
    let inc = 0;
    if (correct) {
      session.rightCount++;
      session.correctRun++;
      inc = Math.min(15, 8 + session.correctRun);
      session.score = Math.min(100, session.score + inc);
      const coins = 5 + (session.score >= 100 ? 25 : 0);
      session.coinsEarned += coins;
      state.coins += coins;
    } else {
      session.correctRun = 0;
      session.score = Math.max(0, session.score - 6);
    }

    state.progress[skill.id] = {
      score: session.score,
      attempts: (state.progress[skill.id]?.attempts || 0) + 1,
      completed: session.score >= 100,
    };
    save();

    if (choiceBtn) choiceBtn.classList.add(correct ? "correct" : "wrong");

    const q = skill.questions[session.qIdx % skill.questions.length];
    main.appendChild(el("div", { class: "feedback " + (correct ? "right" : "wrong") },
      correct ? `✅ Correct! +${inc} SmartScore` : `❌ Not quite. The answer was: ${answerText(q)}`
    ));
    main.appendChild(el("button", { class: "btn btn-primary", style: "margin-top:14px",
      onclick: () => {
        if (session.score >= 100) {
          toast("Skill mastered! +25 bonus coins 🪙");
          go(`/subject/${skill.subject}/${encodeURIComponent(skill.grade)}`);
          return;
        }
        session.qIdx++;
        renderQuestion();
        renderSide();
      }
    }, session.score >= 100 ? "Finish! 🎉" : "Next question"));
    renderSide();
    document.getElementById("coin-count").textContent = state.coins;
  }

  renderQuestion();
  renderSide();
  return root;
}

function answerText(q) { return q.type === "mc" ? q.choices[q.answer] : q.answer; }
function normalize(s) { return (s || "").toString().trim().toLowerCase().replace(/\s+/g, " "); }

// ---------- Skill builder ----------
function renderSkillBuilder(arg1, arg2) {
  let editing = null;
  let presetSubject = null;
  if (arg1 && state.skills.find(s => s.id === arg1)) editing = state.skills.find(s => s.id === arg1);
  else if (arg2 && state.skills.find(s => s.id === arg2)) editing = state.skills.find(s => s.id === arg2);
  else if (arg1 && SUBJECTS.find(s => s.id === arg1)) presetSubject = arg1;

  const root = el("div", { class: "form-card" });
  root.appendChild(el("h2", {}, editing ? "Edit skill" : "Create a new skill"));
  root.appendChild(el("p", { class: "muted", style: "margin-top:0" }, "Add questions in the IXL style. Mix multiple-choice and typed answers. Learners earn coins for correct answers."));

  const subjectSelect = el("select", {}, ...SUBJECTS.map(s => {
    const opt = el("option", { value: s.id }, s.name);
    if ((editing && editing.subject === s.id) || (!editing && presetSubject === s.id)) opt.selected = true;
    return opt;
  }));
  const gradeSelect = el("select", {}, ...GRADES.map(g => {
    const opt = el("option", { value: g }, g);
    if (editing && editing.grade === g) opt.selected = true;
    return opt;
  }));
  const nameInput = el("input", { placeholder: "e.g. Adding fractions with like denominators", value: editing?.name || "" });
  const groupInput = el("input", { placeholder: "e.g. A. Fractions", value: editing?.group || "A. " });
  const codeInput = el("input", { placeholder: "e.g. A.2", value: editing?.code || "" });

  root.appendChild(el("div", { class: "field" }, el("label", {}, "Skill name"), nameInput));
  root.appendChild(el("div", { class: "row-2" },
    el("div", { class: "field" }, el("label", {}, "Subject"), subjectSelect),
    el("div", { class: "field" }, el("label", {}, "Grade"), gradeSelect),
  ));
  root.appendChild(el("div", { class: "row-2" },
    el("div", { class: "field" }, el("label", {}, "Section heading (use 'A.', 'B.', ...)"), groupInput),
    el("div", { class: "field" }, el("label", {}, "Skill code"), codeInput),
  ));

  const qList = el("div");
  const questions = editing ? JSON.parse(JSON.stringify(editing.questions)) : [
    { type: "mc", prompt: "", choices: ["", "", "", ""], answer: 0 }
  ];

  function refreshQs() {
    qList.innerHTML = "";
    questions.forEach((q, idx) => qList.appendChild(qBuilder(q, idx, refreshQs, () => { questions.splice(idx, 1); refreshQs(); })));
  }
  refreshQs();

  root.appendChild(el("div", { style: "display:flex;justify-content:space-between;align-items:center;margin-top:6px;margin-bottom:8px" },
    el("h3", { style: "margin:0;font-size:16px" }, "Questions"),
    el("span", { class: "muted", style: "font-size:13px" }, "Mix multiple-choice and typed answers")
  ));
  root.appendChild(qList);

  root.appendChild(el("div", { style: "display:flex;gap:8px;margin-top:6px" },
    el("button", { class: "btn btn-sm", onclick: () => { questions.push({ type: "mc", prompt: "", choices: ["","","",""], answer: 0 }); refreshQs(); } }, "+ Multiple choice"),
    el("button", { class: "btn btn-sm", onclick: () => { questions.push({ type: "text", prompt: "", answer: "" }); refreshQs(); } }, "+ Typed answer"),
  ));

  const errBox = el("div", { style: "color:#aa2f2f;margin-top:10px;font-size:14px" });
  root.appendChild(errBox);

  root.appendChild(el("div", { class: "actions" },
    el("button", { class: "btn btn-sm", onclick: () => history.back() }, "Cancel"),
    editing && !editing.builtin ? el("button", { class: "btn btn-sm btn-danger", onclick: () => {
      if (confirm("Delete this skill?")) {
        state.skills = state.skills.filter(s => s.id !== editing.id);
        delete state.progress[editing.id];
        save(); toast("Skill deleted"); go("/subject/custom");
      }
    } }, "Delete") : null,
    el("button", { class: "btn btn-primary", onclick: () => {
      const name = nameInput.value.trim();
      if (!name) return errBox.textContent = "Skill name is required.";
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.prompt.trim()) return errBox.textContent = `Question ${i+1} needs a prompt.`;
        if (q.type === "mc") {
          if (q.choices.filter(c => c.trim()).length < 2) return errBox.textContent = `Question ${i+1} needs at least 2 choices.`;
          if (q.answer == null || !q.choices[q.answer]?.trim()) return errBox.textContent = `Pick the correct answer for question ${i+1}.`;
        } else {
          if (!String(q.answer).trim()) return errBox.textContent = `Question ${i+1} needs an answer.`;
        }
      }
      const skillObj = {
        id: editing?.id || ("s-" + Math.random().toString(36).slice(2, 9)),
        subject: subjectSelect.value,
        grade: gradeSelect.value,
        name,
        group: groupInput.value.trim() || "A. Community",
        code: codeInput.value.trim() || "★",
        questions: questions.map(q => q.type === "mc" ? {
          type: "mc", prompt: q.prompt.trim(),
          choices: q.choices.map(c => c.trim()).filter(c => c.length > 0),
          answer: clampAnswer(q.answer, q.choices),
        } : { type: "text", prompt: q.prompt.trim(), answer: String(q.answer).trim() }),
        builtin: false,
        author: state.profile.name,
      };
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

function clampAnswer(answer, choices) {
  const filtered = choices.map(c => c.trim()).filter(c => c.length > 0);
  if (answer >= filtered.length) return 0;
  return Number(answer) || 0;
}

function qBuilder(q, idx, refresh, onRemove) {
  const card = el("div", { class: "q-builder" });
  card.appendChild(el("h4", {},
    el("span", {}, `Q${idx + 1} · ${q.type === "mc" ? "Multiple choice" : "Typed answer"}`),
    el("button", { class: "btn btn-sm btn-danger", onclick: onRemove }, "Remove")
  ));
  const promptInput = el("textarea", { placeholder: "Enter the question...", rows: 2 });
  promptInput.value = q.prompt;
  promptInput.oninput = () => { q.prompt = promptInput.value; };
  card.appendChild(el("div", { class: "field" }, promptInput));

  if (q.type === "mc") {
    q.choices = q.choices.length ? q.choices : ["","","",""];
    q.choices.forEach((c, i) => {
      const radio = el("input", { type: "radio", name: `q${idx}`, value: i });
      if (q.answer === i) radio.checked = true;
      radio.onchange = () => { q.answer = i; };
      const inp = el("input", { type: "text", placeholder: `Choice ${i+1}`, value: c });
      inp.oninput = () => { q.choices[i] = inp.value; };
      card.appendChild(el("div", { class: "choice-row" }, radio, inp));
    });
    card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" }, "Select the radio next to the correct answer."));
  } else {
    const ans = el("input", { type: "text", placeholder: "Correct answer (case-insensitive)", value: q.answer || "" });
    ans.oninput = () => { q.answer = ans.value; };
    card.appendChild(ans);
  }
  return card;
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
        el("div", { class: "prize-emoji" }, p.emoji),
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
    card.appendChild(el("div", { class: "prize-emoji" }, p.emoji));
    card.appendChild(el("div", { class: "prize-name" }, p.name));
    card.appendChild(el("div", { class: "prize-desc" }, p.desc));
    card.appendChild(el("div", { class: "prize-cost" }, `🪙 ${p.cost}`));
    const btnRow = el("div", { style: "display:flex;gap:6px" });
    btnRow.appendChild(el("button", { class: "btn btn-primary btn-sm", style: "flex:1", disabled: !can ? "true" : null,
      onclick: () => redeemPrize(p) }, can ? "Redeem" : "Need more 🪙"));
    if (!p.builtin) {
      btnRow.appendChild(el("button", { class: "btn btn-sm", onclick: () => go(`/create-prize/${p.id}`) }, "Edit"));
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
    el("div", { style: "font-size:80px;text-align:center" }, p.emoji),
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
  root.appendChild(el("p", { class: "muted", style: "margin-top:0" }, "Add a prize learners can redeem with the coins they earn."));

  const name = el("input", { value: editing?.name || "", placeholder: "Prize name" });
  const emoji = el("input", { value: editing?.emoji || "🎉", placeholder: "Emoji icon", maxlength: 4 });
  const desc = el("textarea", { placeholder: "What is it? Why is it cool?", rows: 3 }); desc.value = editing?.desc || "";
  const cost = el("input", { type: "number", min: "10", value: editing?.cost || 100 });

  root.appendChild(el("div", { class: "field" }, el("label", {}, "Name"), name));
  root.appendChild(el("div", { class: "row-2" },
    el("div", { class: "field" }, el("label", {}, "Emoji"), emoji),
    el("div", { class: "field" }, el("label", {}, "Cost (coins)"), cost),
  ));
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Description"), desc));

  const err = el("div", { style: "color:#aa2f2f;font-size:14px" });
  root.appendChild(err);

  root.appendChild(el("div", { class: "actions" },
    el("button", { class: "btn btn-sm", onclick: () => history.back() }, "Cancel"),
    editing && !editing.builtin ? el("button", { class: "btn btn-sm btn-danger", onclick: () => {
      if (confirm("Delete this prize?")) {
        state.prizes = state.prizes.filter(p => p.id !== editing.id);
        save(); toast("Prize deleted"); go("/prizes");
      }
    } }, "Delete") : null,
    el("button", { class: "btn btn-primary", onclick: () => {
      if (!name.value.trim()) return err.textContent = "Name required.";
      if (Number(cost.value) < 10) return err.textContent = "Cost must be at least 10 coins.";
      const obj = {
        id: editing?.id || ("p-" + Math.random().toString(36).slice(2, 9)),
        name: name.value.trim(),
        emoji: emoji.value.trim() || "🎁",
        desc: desc.value.trim(),
        cost: Number(cost.value),
        redeemable: true,
        builtin: false,
      };
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
  const completed = Object.values(state.progress).filter(p => p.score >= 100).length;
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
      if (confirm("Reset all progress, coins, and your created skills/prizes?")) {
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
    const mastered = skills.filter(sk => (state.progress[sk.id]?.score || 0) >= 100).length;
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

  // Pick: in-progress first, then untouched skills, mix of subjects
  const inProgress = state.skills.filter(s => {
    const sc = state.progress[s.id]?.score || 0;
    return sc > 0 && sc < 100;
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
  if (!q) {
    root.appendChild(el("div", { class: "muted" }, "Type in the search bar above to find skills."));
    return root;
  }
  const matches = state.skills.filter(s =>
    s.name.toLowerCase().includes(q) ||
    (s.group || "").toLowerCase().includes(q) ||
    (s.code || "").toLowerCase().includes(q)
  );
  if (matches.length === 0) {
    root.appendChild(el("div", { class: "empty" }, `No skills matched "${query}".`));
    return root;
  }
  const sec = el("div", { class: "skill-section" });
  matches.forEach(s => sec.appendChild(skillRow(s, state.progress[s.id])));
  root.appendChild(sec);
  return root;
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
