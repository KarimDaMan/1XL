# 1XL

A learning playground inspired by IXL's layout and UI. Practice skills like
multiplication, vocabulary, or U.S. geography — and **author your own skills
and prizes** for the community.

## Run it

It's a static site. Open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

State (skills, prizes, progress, coins) is saved to `localStorage`.

## Features

- IXL-style topbar with subjects, sub-grade nav, sticky search bar
- Subject pages grouped by topic with SmartScore per skill
- Quiz view with multiple-choice + typed answers and a SmartScore ring
- Coin economy: earn coins for correct answers, bonus for mastery
- **Skill builder** — anyone can publish a skill with mixed question types
- **Prize shop** — redeem coins for built-in prizes or design your own
- Profile with mastery stats and reset
