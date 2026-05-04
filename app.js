// 1XL — IXL-style learning platform with user-authored skills & prizes.
// Pure client-side, persisted in localStorage.

const STORAGE_KEY = "1xl-state-v1";

const SUBJECTS = [
  { id: "math",     name: "Math",            icon: "➗", color: "#068982" },
  { id: "ela",      name: "Language arts",   icon: "📖", color: "#e7569b" },
  { id: "science",  name: "Science",         icon: "🔬", color: "#4cb15c" },
  { id: "social",   name: "Social studies",  icon: "🌎", color: "#f08c2e" },
  { id: "spanish",  name: "Spanish",         icon: "💬", color: "#8a4fc1" },
  { id: "custom",   name: "My skills",       icon: "⭐", color: "#f5b400" },
];

const GRADES = ["Pre-K","K","1","2","3","4","5","6","7","8","Algebra 1","Geometry","Algebra 2"];

// Seed skills shipped with the app — IXL-flavored examples.
const SEED_SKILLS = [
  { id: "s-m-1", subject: "math", grade: "3", group: "Multiplication",
    code: "A.1", name: "Multiplication facts up to 10",
    questions: [
      { type: "mc",   prompt: "What is 7 × 8?", choices: ["54","56","63","64"], answer: 1 },
      { type: "text", prompt: "Solve: 6 × 9 = ?", answer: "54" },
      { type: "mc",   prompt: "What is 4 × 7?", choices: ["28","24","32","21"], answer: 0 },
    ]},
  { id: "s-m-2", subject: "math", grade: "3", group: "Fractions",
    code: "B.4", name: "Identify fractions on a number line",
    questions: [
      { type: "mc", prompt: "Which fraction is halfway between 0 and 1?", choices: ["1/4","1/2","3/4","1/3"], answer: 1 },
      { type: "text", prompt: "Write the fraction shown by 3 of 4 equal parts.", answer: "3/4" },
    ]},
  { id: "s-m-3", subject: "math", grade: "5", group: "Decimals",
    code: "C.2", name: "Add and subtract decimals",
    questions: [
      { type: "text", prompt: "0.7 + 0.45 = ?", answer: "1.15" },
      { type: "mc", prompt: "5.2 - 1.75 = ?", choices: ["3.45","3.55","4.45","3.25"], answer: 0 },
    ]},
  { id: "s-e-1", subject: "ela", grade: "4", group: "Vocabulary",
    code: "V.1", name: "Synonyms and antonyms",
    questions: [
      { type: "mc", prompt: "Choose the synonym for 'happy'.", choices: ["sad","joyful","tired","angry"], answer: 1 },
      { type: "mc", prompt: "Choose the antonym for 'brave'.", choices: ["bold","fearless","cowardly","strong"], answer: 2 },
    ]},
  { id: "s-e-2", subject: "ela", grade: "5", group: "Grammar",
    code: "G.3", name: "Identify the verb in a sentence",
    questions: [
      { type: "text", prompt: "What is the verb in: 'The dog runs fast.'?", answer: "runs" },
      { type: "text", prompt: "What is the verb in: 'She painted a portrait.'?", answer: "painted" },
    ]},
  { id: "s-s-1", subject: "science", grade: "4", group: "Life science",
    code: "L.1", name: "Plant and animal cells",
    questions: [
      { type: "mc", prompt: "Which structure is found in plant cells but NOT animal cells?",
        choices: ["Nucleus","Cell wall","Mitochondria","Membrane"], answer: 1 },
      { type: "text", prompt: "What organelle does photosynthesis happen in?", answer: "chloroplast" },
    ]},
  { id: "s-soc-1", subject: "social", grade: "5", group: "U.S. geography",
    code: "U.2", name: "Name the U.S. states",
    questions: [
      { type: "text", prompt: "Which state's capital is Sacramento?", answer: "california" },
      { type: "mc", prompt: "Which state is known as 'The Sunshine State'?",
        choices: ["Texas","Florida","Arizona","Nevada"], answer: 1 },
    ]},
  { id: "s-sp-1", subject: "spanish", grade: "K", group: "Greetings",
    code: "S.1", name: "Common greetings",
    questions: [
      { type: "mc", prompt: "How do you say 'Hello' in Spanish?",
        choices: ["Adiós","Hola","Gracias","Por favor"], answer: 1 },
      { type: "text", prompt: "Translate 'Good night' to Spanish (two words).", answer: "buenas noches" },
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
    progress: {},   // skillId -> { score: 0..100, attempts, completed }
    coins: 0,
    redeemed: [],   // array of {prizeId, at}
    profile: { name: "Learner", avatar: "L" },
  };
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // Ensure built-in seeds are present in case of upgrade
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

// ---------- Render ----------
function render() {
  renderTopnav();
  const { path, args } = parseHash();
  const view = document.getElementById("view");
  view.innerHTML = "";
  document.getElementById("coin-count").textContent = state.coins;
  document.getElementById("avatar").textContent = state.profile.avatar;

  switch (path) {
    case "home":     view.appendChild(renderHome()); break;
    case "subject":  view.appendChild(renderSubject(args[0], args[1])); break;
    case "skill":    view.appendChild(renderQuiz(args[0])); break;
    case "create-skill": view.appendChild(renderSkillBuilder(args[0])); break;
    case "prizes":   view.appendChild(renderPrizes()); break;
    case "create-prize": view.appendChild(renderPrizeBuilder(args[0])); break;
    case "profile":  view.appendChild(renderProfile()); break;
    case "search":   view.appendChild(renderSearch(decodeURIComponent(args[0] || ""))); break;
    default:         view.appendChild(renderHome()); break;
  }
  renderSubnav(path, args);
}

function renderTopnav() {
  const nav = document.getElementById("subject-nav");
  nav.innerHTML = "";
  const { path, args } = parseHash();
  SUBJECTS.forEach(s => {
    const a = document.createElement("a");
    a.href = `#/subject/${s.id}`;
    a.textContent = s.name;
    if (path === "subject" && args[0] === s.id) a.classList.add("active");
    nav.appendChild(a);
  });
  const prizeLink = document.createElement("a");
  prizeLink.href = "#/prizes";
  prizeLink.textContent = "🏆 Prizes";
  if (path === "prizes" || path === "create-prize") prizeLink.classList.add("active");
  nav.appendChild(prizeLink);
}

function renderSubnav(path, args) {
  const sub = document.getElementById("subnav");
  sub.innerHTML = "";
  if (path === "subject") {
    GRADES.forEach(g => {
      const b = document.createElement("button");
      b.textContent = g;
      if ((args[1] || "all") === g || (!args[1] && g === "all")) {} // no-op
      if (args[1] === g) b.classList.add("active");
      b.onclick = () => go(`/subject/${args[0]}/${g}`);
      sub.appendChild(b);
    });
    const all = document.createElement("button");
    all.textContent = "All grades";
    if (!args[1]) all.classList.add("active");
    all.onclick = () => go(`/subject/${args[0]}`);
    sub.insertBefore(all, sub.firstChild);
  }
}

// ---------- Views ----------
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

function renderHome() {
  const wrap = document.createDocumentFragment();
  const root = el("div");

  const hero = el("div", { class: "hero" },
    el("div", {},
      el("h1", {}, "Learn anything. Win prizes."),
      el("p", {}, "1XL is a community learning playground. Practice skills like on IXL, then build your own questions and earn coins for prizes you create.")
    ),
    el("div", { class: "hero-actions" },
      el("button", { class: "btn btn-gold", onclick: () => go("/create-skill") }, "+ Create a skill"),
      el("button", { class: "btn btn-ghost", onclick: () => go("/prizes") }, "🏆 Prize shop")
    )
  );
  root.appendChild(hero);

  // Continue learning
  const inProgress = state.skills
    .map(s => ({ s, p: state.progress[s.id] }))
    .filter(x => x.p && x.p.score < 100)
    .slice(0, 4);
  if (inProgress.length > 0) {
    root.appendChild(el("div", { class: "section-head" }, el("h2", {}, "Continue where you left off")));
    const grid = el("div", { class: "skill-group" });
    inProgress.forEach(({ s, p }) => grid.appendChild(skillRow(s, p)));
    root.appendChild(grid);
  }

  root.appendChild(el("div", { class: "section-head" }, el("h2", {}, "Choose a subject")));
  const grid = el("div", { class: "subject-grid" });
  SUBJECTS.forEach(s => {
    const count = state.skills.filter(sk => sk.subject === s.id).length;
    grid.appendChild(el("div", {
      class: "subject-card",
      onclick: () => go(`/subject/${s.id}`)
    },
      el("div", { class: "subject-icon", style: `background:${s.color}` }, s.icon),
      el("h3", {}, s.name),
      el("div", { class: "count" }, `${count} skill${count === 1 ? "" : "s"}`)
    ));
  });
  root.appendChild(grid);

  // Recently created skills
  const userSkills = state.skills.filter(s => !s.builtin).slice(-6).reverse();
  if (userSkills.length > 0) {
    root.appendChild(el("div", { class: "section-head" },
      el("h2", {}, "Newest community skills"),
      el("a", { href: "#/subject/custom" }, "See all →")
    ));
    const grp = el("div", { class: "skill-group" });
    userSkills.forEach(s => grp.appendChild(skillRow(s, state.progress[s.id])));
    root.appendChild(grp);
  }

  wrap.appendChild(root);
  return wrap;
}

function skillRow(s, p) {
  const score = p ? p.score : 0;
  return el("div", { class: "skill-row", onclick: () => go(`/skill/${s.id}`) },
    el("div", { class: "skill-code" }, s.code || "—"),
    el("div", { class: "skill-name" },
      s.name,
      !s.builtin ? el("span", { class: "tag badge-new", style: "margin-left:8px" }, "Community") : null
    ),
    el("div", { class: "skill-meta" },
      el("span", {}, `${s.questions.length} Q`),
      el("span", { class: "smartscore" + (score >= 100 ? " done" : "") }, score + "")
    )
  );
}

function renderSubject(subjectId, grade) {
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const root = el("div");
  if (!subject) {
    root.appendChild(el("div", { class: "empty" }, "Subject not found."));
    return root;
  }

  root.appendChild(el("div", { class: "hero", style: `background: linear-gradient(135deg, ${subject.color}, ${shade(subject.color, 20)})` },
    el("div", {},
      el("h1", {}, `${subject.icon} ${subject.name}`),
      el("p", {}, grade ? `Skills for grade ${grade}.` : "Pick a grade above, or browse all skills below.")
    ),
    el("div", { class: "hero-actions" },
      el("button", { class: "btn btn-gold", onclick: () => go(`/create-skill/${subject.id}`) }, "+ Add a skill")
    )
  ));

  let skills = state.skills.filter(s => s.subject === subjectId);
  if (grade) skills = skills.filter(s => s.grade === grade);

  if (skills.length === 0) {
    root.appendChild(el("div", { class: "empty" },
      "No skills here yet. ",
      el("a", { href: `#/create-skill/${subject.id}` }, "Be the first to add one!")
    ));
    return root;
  }

  // Group by group
  const groups = {};
  skills.forEach(s => {
    const k = s.group || "Other";
    (groups[k] = groups[k] || []).push(s);
  });

  Object.entries(groups).forEach(([groupName, list]) => {
    const card = el("div", { class: "skill-group" });
    card.appendChild(el("div", { class: "skill-group-head" },
      el("span", {}, groupName),
      el("span", { class: "muted" }, `${list.length} skill${list.length === 1 ? "" : "s"}`)
    ));
    list.forEach(s => card.appendChild(skillRow(s, state.progress[s.id])));
    root.appendChild(card);
  });

  return root;
}

function renderQuiz(skillId) {
  const skill = state.skills.find(s => s.id === skillId);
  const root = el("div");
  if (!skill) {
    root.appendChild(el("div", { class: "empty" }, "Skill not found."));
    return root;
  }
  if (!skill.questions || skill.questions.length === 0) {
    root.appendChild(el("div", { class: "empty" }, "This skill has no questions yet."));
    return root;
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
  };

  function renderSide() {
    side.innerHTML = "";
    const ring = el("div", { class: "score-ring", style: `--p:${session.score}` }, el("span", {}, session.score + ""));
    side.appendChild(el("h3", { style: "margin:0 0 8px;text-align:center" }, "SmartScore"));
    side.appendChild(ring);
    side.appendChild(el("div", { class: "muted", style: "text-align:center;margin-bottom:14px" }, session.score >= 100 ? "Mastered! 🎉" : "Score increases with correct answers."));
    side.appendChild(el("div", { class: "bar-row" }, el("span", {}, "Questions answered"), el("b", {}, session.answeredCount + "")));
    side.appendChild(el("div", { class: "bar-row" }, el("span", {}, "Correct"), el("b", {}, session.rightCount + "")));
    side.appendChild(el("div", { class: "bar-row" }, el("span", {}, "Coins earned"), el("b", {}, "🪙 " + (session.coinsEarned || 0))));
    if (!skill.builtin) {
      side.appendChild(el("hr", { style: "border:none;border-top:1px solid var(--line);margin:14px 0" }));
      side.appendChild(el("button", { class: "btn btn-sm", style: "width:100%", onclick: () => go(`/create-skill/${skill.subject}/${skill.id}`) }, "Edit skill"));
    }
  }

  function renderQuestion() {
    main.innerHTML = "";
    const q = skill.questions[session.qIdx % skill.questions.length];
    main.appendChild(el("div", { class: "quiz-bread" }, `${subject?.name || ""} › ${skill.group || ""} › ${skill.code || ""}`));
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
      btn.onclick = () => {
        const correct = normalize(input.value) === normalize(q.answer);
        grade(correct, null, input.value);
      };
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") btn.click(); });
      main.appendChild(input);
      main.appendChild(btn);
    }
  }

  function grade(correct, choiceBtn, given) {
    session.answeredCount++;
    if (correct) {
      session.rightCount++;
      session.correctRun++;
      const inc = Math.min(15, 8 + session.correctRun);
      session.score = Math.min(100, session.score + inc);
      const coins = correct ? 5 + (session.score >= 100 ? 20 : 0) : 0;
      session.coinsEarned = (session.coinsEarned || 0) + coins;
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

    const fb = el("div", { class: "feedback " + (correct ? "right" : "wrong") },
      correct ? "✅ Correct! +" + Math.min(15, 8 + session.correctRun - (correct ? 0 : 0)) + " SmartScore"
              : "❌ Not quite. The answer was: " + answerText(skill.questions[session.qIdx % skill.questions.length])
    );
    main.appendChild(fb);
    const next = el("button", { class: "btn btn-primary", style: "margin-top:14px" },
      session.score >= 100 ? "Finish! 🎉" : "Next question"
    );
    next.onclick = () => {
      if (session.score >= 100) {
        toast("Skill mastered! +20 bonus coins 🪙");
        go(`/subject/${skill.subject}`);
        return;
      }
      session.qIdx++;
      renderQuestion();
      renderSide();
    };
    main.appendChild(next);
    renderSide();
    document.getElementById("coin-count").textContent = state.coins;
  }

  renderQuestion();
  renderSide();
  return root;
}

function answerText(q) {
  if (q.type === "mc") return q.choices[q.answer];
  return q.answer;
}
function normalize(s) { return (s || "").toString().trim().toLowerCase().replace(/\s+/g, " "); }

function renderSkillBuilder(arg1, arg2) {
  // arg1 = subjectId OR existing skillId; arg2 = existing skillId for edit
  let editing = null;
  let presetSubject = null;
  if (arg1 && state.skills.find(s => s.id === arg1)) editing = state.skills.find(s => s.id === arg1);
  else if (arg2 && state.skills.find(s => s.id === arg2)) editing = state.skills.find(s => s.id === arg2);
  else if (arg1 && SUBJECTS.find(s => s.id === arg1)) presetSubject = arg1;

  const root = el("div", { class: "form-card" });
  root.appendChild(el("h2", {}, editing ? "Edit skill" : "Create a new skill"));
  root.appendChild(el("p", { class: "muted" }, "Build a practice skill in the IXL style. Add a series of questions; learners earn coins for correct answers."));

  const subjectSelect = el("select", { id: "f-subject" }, ...SUBJECTS.map(s => {
    const opt = el("option", { value: s.id }, s.name);
    if ((editing && editing.subject === s.id) || (!editing && presetSubject === s.id)) opt.selected = true;
    return opt;
  }));
  const gradeSelect = el("select", { id: "f-grade" }, ...GRADES.map(g => {
    const opt = el("option", { value: g }, g);
    if (editing && editing.grade === g) opt.selected = true;
    return opt;
  }));

  const nameInput = el("input", { id: "f-name", placeholder: "e.g. Adding fractions with like denominators", value: editing?.name || "" });
  const groupInput = el("input", { id: "f-group", placeholder: "e.g. Fractions", value: editing?.group || "" });
  const codeInput = el("input", { id: "f-code", placeholder: "e.g. F.2", value: editing?.code || "" });

  root.appendChild(el("div", { class: "field" }, el("label", {}, "Skill name"), nameInput));
  root.appendChild(el("div", { class: "row-2" },
    el("div", { class: "field" }, el("label", {}, "Subject"), subjectSelect),
    el("div", { class: "field" }, el("label", {}, "Grade"), gradeSelect),
  ));
  root.appendChild(el("div", { class: "row-2" },
    el("div", { class: "field" }, el("label", {}, "Topic group"), groupInput),
    el("div", { class: "field" }, el("label", {}, "Skill code (optional)"), codeInput),
  ));

  const qList = el("div", { id: "qs" });
  const questions = editing ? structuredClone(editing.questions) : [
    { type: "mc", prompt: "", choices: ["", "", "", ""], answer: 0 }
  ];

  function refreshQs() {
    qList.innerHTML = "";
    questions.forEach((q, idx) => qList.appendChild(qBuilder(q, idx, refreshQs, () => { questions.splice(idx, 1); refreshQs(); })));
  }
  refreshQs();

  root.appendChild(el("div", { class: "section-head" }, el("h3", { style: "margin:0;font-size:17px" }, "Questions"),
    el("span", { class: "muted" }, "Mix multiple-choice and typed answers")
  ));
  root.appendChild(qList);

  const addRow = el("div", { style: "display:flex;gap:8px;margin-top:6px" },
    el("button", { class: "btn btn-sm", onclick: () => { questions.push({ type: "mc", prompt: "", choices: ["","","",""], answer: 0 }); refreshQs(); } }, "+ Multiple choice"),
    el("button", { class: "btn btn-sm", onclick: () => { questions.push({ type: "text", prompt: "", answer: "" }); refreshQs(); } }, "+ Typed answer"),
  );
  root.appendChild(addRow);

  const errBox = el("div", { class: "muted", style: "color:#aa2f2f;margin-top:10px" });
  root.appendChild(errBox);

  const actions = el("div", { class: "actions" },
    el("button", { class: "btn btn-sm", onclick: () => history.back() }, "Cancel"),
    editing && !editing.builtin ? el("button", { class: "btn btn-sm btn-danger", onclick: () => {
      if (confirm("Delete this skill?")) {
        state.skills = state.skills.filter(s => s.id !== editing.id);
        delete state.progress[editing.id];
        save();
        toast("Skill deleted");
        go("/subject/custom");
      }
    } }, "Delete") : null,
    el("button", { class: "btn btn-primary", onclick: () => {
      const name = nameInput.value.trim();
      if (!name) return errBox.textContent = "Skill name is required.";
      // Validate questions
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
        group: groupInput.value.trim() || "Community",
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
        state.coins += 10; // reward for contributing
        toast("Skill published! +10 🪙");
      }
      save();
      go(`/skill/${skillObj.id}`);
    } }, editing ? "Save changes" : "Publish skill")
  );
  root.appendChild(actions);

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
    el("span", {}, `Question ${idx + 1} · ${q.type === "mc" ? "Multiple choice" : "Typed answer"}`),
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
      const row = el("div", { class: "choice-row" }, radio, inp);
      card.appendChild(row);
    });
    card.appendChild(el("div", { class: "muted", style: "font-size:12px" }, "Select the radio next to the correct answer."));
  } else {
    const ans = el("input", { type: "text", placeholder: "Correct answer (case-insensitive)", value: q.answer || "" });
    ans.oninput = () => { q.answer = ans.value; };
    card.appendChild(ans);
  }
  return card;
}

function renderPrizes() {
  const root = el("div");
  root.appendChild(el("div", { class: "hero", style: "background: linear-gradient(135deg, #f5b400, #f08c2e)" },
    el("div", {},
      el("h1", {}, "🏆 Prize shop"),
      el("p", {}, `You have ${state.coins} 🪙. Spend coins on prizes — or invent your own and offer them to the community.`)
    ),
    el("div", { class: "hero-actions" },
      el("button", { class: "btn btn-gold", onclick: () => go("/create-prize") }, "+ Create a prize")
    )
  ));

  if (state.redeemed.length > 0) {
    root.appendChild(el("div", { class: "section-head" }, el("h2", {}, "Your trophy case")));
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
  }

  root.appendChild(el("div", { class: "section-head" }, el("h2", {}, "Available prizes")));
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
  showModal(
    el("div", {},
      el("div", { style: "font-size:80px;text-align:center" }, p.emoji),
      el("h3", { style: "text-align:center" }, "You won " + p.name + "!"),
      el("p", { class: "muted", style: "text-align:center" }, p.desc),
      el("div", { class: "actions" }, el("button", { class: "btn btn-primary", onclick: closeModal }, "Awesome"))
    )
  );
  render();
}

function renderPrizeBuilder(prizeId) {
  const editing = prizeId ? state.prizes.find(p => p.id === prizeId) : null;
  const root = el("div", { class: "form-card" });
  root.appendChild(el("h2", {}, editing ? "Edit prize" : "Create a prize"));
  root.appendChild(el("p", { class: "muted" }, "Add a prize learners can redeem with the coins they earn."));

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

  const err = el("div", { class: "muted", style: "color:#aa2f2f" });
  root.appendChild(err);

  const actions = el("div", { class: "actions" },
    el("button", { class: "btn btn-sm", onclick: () => history.back() }, "Cancel"),
    editing && !editing.builtin ? el("button", { class: "btn btn-sm btn-danger", onclick: () => {
      if (confirm("Delete this prize?")) {
        state.prizes = state.prizes.filter(p => p.id !== editing.id);
        save();
        toast("Prize deleted");
        go("/prizes");
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
  );
  root.appendChild(actions);
  return root;
}

function renderProfile() {
  const root = el("div", { class: "form-card" });
  root.appendChild(el("h2", {}, "Your profile"));
  const completed = Object.values(state.progress).filter(p => p.score >= 100).length;
  const totalAttempts = Object.values(state.progress).reduce((a, p) => a + (p.attempts || 0), 0);

  const stats = el("div", { class: "row-2", style: "margin-bottom:18px" },
    el("div", { class: "subject-card", style: "cursor:default" },
      el("div", { class: "subject-icon", style: "background: var(--gold)" }, "🏆"),
      el("h3", {}, completed + ""),
      el("div", { class: "count" }, "Skills mastered")
    ),
    el("div", { class: "subject-card", style: "cursor:default" },
      el("div", { class: "subject-icon", style: "background: var(--teal)" }, "🎯"),
      el("h3", {}, totalAttempts + ""),
      el("div", { class: "count" }, "Questions answered")
    ),
  );
  root.appendChild(stats);

  const nameI = el("input", { value: state.profile.name });
  const avI = el("input", { value: state.profile.avatar, maxlength: 2, style: "max-width:80px" });
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Display name"), nameI));
  root.appendChild(el("div", { class: "field" }, el("label", {}, "Avatar (1-2 chars)"), avI));

  const danger = el("div", { class: "actions" },
    el("button", { class: "btn btn-danger btn-sm", onclick: () => {
      if (confirm("Reset all progress, coins, and your created skills/prizes?")) {
        state = defaultState();
        save();
        toast("Reset complete");
        go("/");
      }
    } }, "Reset everything"),
    el("button", { class: "btn btn-primary", onclick: () => {
      state.profile.name = nameI.value.trim() || "Learner";
      state.profile.avatar = (avI.value.trim() || "L").slice(0, 2);
      save();
      toast("Profile saved");
      render();
    } }, "Save")
  );
  root.appendChild(danger);
  return root;
}

function renderSearch(query) {
  const root = el("div");
  const q = query.trim().toLowerCase();
  root.appendChild(el("h2", {}, q ? `Results for "${query}"` : "Search"));
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
  const grp = el("div", { class: "skill-group" });
  matches.forEach(s => grp.appendChild(skillRow(s, state.progress[s.id])));
  root.appendChild(grp);
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

function shade(hex, amount) {
  // crude lighten
  const c = hex.replace("#", "");
  const num = parseInt(c, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0xff) + amount;
  let b = (num & 0xff) + amount;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}
