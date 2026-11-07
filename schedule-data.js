/* ============================================================================
 * FOM DAILY SCHEDULE v2.1 — READ-ONLY DATA LAYER  (schedule-data.js)
 * ----------------------------------------------------------------------------
 * This file contains ONLY static configuration and schedule templates.
 * It never touches the DOM and never mutates anything at runtime.
 *
 * Contract with app.js:
 *   window.FOM_DATA = {
 *     VERSION, CATEGORIES, MODES, TEMPLATES, SLEEPINESS_CHECKPOINTS,
 *     SHUTDOWN, ERROR_CODES, SCORE_FIELDS, MODULES, ZONES, STORAGE_KEY
 *   }
 *
 * Contract with style.css (do not rename freely):
 *   - Category keys are used verbatim in "cat-<Key>" classes with spaces
 *     removed, e.g. "Night Sleep" -> .cat-NightSleep, "Free Zone" -> .cat-FreeZone
 *   - Mode keys: full | modified | recovery | essential (professional names;
 *     legacy Green/Lite/Yellow/Red terminology is intentionally NOT used).
 * ==========================================================================*/
"use strict";

(function (global) {

  /* --------------------------------------------------------------------------
   * 1. CATEGORY TAXONOMY
   *    Every block carries exactly one category. Icon + short label are used
   *    for chips, badges and block cards.
   * ------------------------------------------------------------------------*/
  const CATEGORIES = {
    "Study":        { icon: "\u{1F4D6}", short: "STUDY" },
    "Analysis":     { icon: "\u{1F9E0}", short: "ANALY" },
    "Revision":     { icon: "\u{1F501}", short: "REV" },
    "Breakfast":    { icon: "\u{1F373}", short: "MEAL" },
    "Lunch":        { icon: "\u{1F35B}", short: "MEAL" },
    "Dinner":       { icon: "\u{1F37D}", short: "MEAL" },
    "Nap":          { icon: "\u{1F634}", short: "NAP" },
    "Night Sleep":  { icon: "\u{1F319}", short: "SLEEP" },
    "Workout":      { icon: "\u{1F3CB}", short: "TRAIN" },
    "Break":        { icon: "\u2615", short: "BREAK" },
    "Free":         { icon: "\u{1F33F}", short: "FREE" },
    "Planning":     { icon: "\u{1F4CB}", short: "PLAN" },
    "Fuel":         { icon: "\u26FD", short: "FUEL" },
    "Recovery":     { icon: "\u{1F6C2}", short: "RECOV" },
    "Free Zone":    { icon: "\u{1F533}", short: "ZONE" }
  };

  /* --------------------------------------------------------------------------
   * 2. PROFESSIONAL DAY MODES  (manual selection at morning check)
   *    order drives the mode-group button row.
   * ------------------------------------------------------------------------*/
  const MODES = {
    full:      { key: "full",      label: "Full Capacity", desc: "All blocks as templated",     legacy: "Green" },
    modified:  { key: "modified",  label: "Modified Load", desc: "Deep-work trimmed ~30%",      legacy: "Lite" },
    recovery:  { key: "recovery",  label: "Recovery Plan", desc: "Meals · nap · workout only",  legacy: "Yellow" },
    essential: { key: "essential", label: "Essential Plan", desc: "Shutdown + sleep anchor",    legacy: "Red" }
  };

  /* Helper used by every template below — keeps block rows terse & uniform. */
  function B(start, end, name, category, note) {
    return { start: start, end: end, name: name, category: category, note: note || "" };
  }

  /* --------------------------------------------------------------------------
   * 3. WEEKDAY TEMPLATE (Mon–Fri) — fixed times, read-only in UI
   * ------------------------------------------------------------------------*/
  const WEEKDAY_BLOCKS = [
    B("05:45", "06:00", "Wake · Hydrate",              "Fuel",        "No phone first 10 min"),
    B("06:00", "06:45", "Workout",                     "Workout"),
    B("06:45", "07:15", "Shower + Get Ready",          "Recovery"),
    B("07:15", "07:45", "Breakfast",                   "Breakfast"),
    B("07:45", "08:00", "Planning / Day Milestones",   "Planning",    "Draft digitally · finalise on paper"),
    B("08:00", "09:30", "Deep Work I — New Theory",    "Study"),
    B("09:30", "09:45", "Break",                       "Break"),
    B("09:45", "11:05", "Problem Set I",               "Analysis"),
    B("11:05", "11:15", "Sleepiness Check #1 + Reset", "Break",       "Log 11:05 checkpoint"),
    B("11:15", "12:30", "Deep Work II — Proofs",       "Study"),
    B("12:30", "13:15", "Lunch",                       "Lunch"),
    B("13:15", "13:45", "Nap",                         "Nap",         "Set external alarm"),
    B("13:45", "15:25", "Problem Set II",              "Analysis"),
    B("15:25", "15:35", "Sleepiness Check #2 + Fuel",  "Fuel",        "Log 15:25 checkpoint"),
    B("15:35", "16:45", "Revision Sprint",             "Revision"),
    B("16:45", "16:55", "Sleepiness Check #3",         "Break",       "Log 16:45 checkpoint"),
    B("16:55", "18:15", "Mixed Practice / Timed",      "Analysis"),
    B("18:15", "19:00", "Dinner",                      "Dinner"),
    B("19:00", "20:30", "Error Log + Doubt Clearing",  "Revision",    "FOM-4 tally lives here"),
    B("20:30", "20:45", "Free Zone",                   "Free Zone"),
    B("20:45", "21:00", "Shutdown Protocol",           "Planning",    "HIT/MISS · carry-forward"),
    B("21:00", "21:45", "Light Revision / Read",       "Revision"),
    B("21:45", "22:00", "Wind Down",                   "Recovery",    "Screens off"),
    B("22:00", "05:45", "Night Sleep",                 "Night Sleep", "Non-negotiable anchor")
  ];

  /* --------------------------------------------------------------------------
   * 4. SATURDAY TEMPLATE — long-form practice day
   * ------------------------------------------------------------------------*/
  const SATURDAY_BLOCKS = [
    B("06:30", "06:45", "Wake · Hydrate",            "Fuel"),
    B("06:45", "07:30", "Workout",                   "Workout"),
    B("07:30", "08:00", "Breakfast",                 "Breakfast"),
    B("08:00", "08:15", "Weekly Planning",           "Planning"),
    B("08:15", "11:15", "Timed Mock Session",        "Analysis",    "Exam conditions"),
    B("11:15", "11:25", "Sleepiness Check #1",       "Break",       "Log 11:05 slot late-morning"),
    B("11:25", "12:30", "Mock Review — Part 1",      "Revision"),
    B("12:30", "13:15", "Lunch",                     "Lunch"),
    B("13:15", "13:45", "Nap",                       "Nap"),
    B("13:45", "15:25", "Mock Review — Part 2",      "Revision"),
    B("15:25", "15:35", "Sleepiness Check #2 + Fuel","Fuel"),
    B("15:35", "16:45", "Weak-Topic Study Block",    "Study"),
    B("16:45", "16:55", "Sleepiness Check #3",       "Break"),
    B("16:55", "18:15", "Free Zone",                 "Free Zone"),
    B("18:15", "19:00", "Dinner",                    "Dinner"),
    B("19:00", "20:30", "Error Codes + Doubt Log",   "Revision"),
    B("20:30", "20:45", "Leisure",                   "Free"),
    B("20:45", "21:00", "Shutdown Protocol",         "Planning"),
    B("21:00", "21:45", "Light Reading",             "Revision"),
    B("21:45", "22:00", "Wind Down",                 "Recovery"),
    B("22:00", "06:30", "Night Sleep",               "Night Sleep")
  ];

  /* --------------------------------------------------------------------------
   * 5. SUNDAY TEMPLATE — lighter load + weekly review
   * ------------------------------------------------------------------------*/
  const SUNDAY_BLOCKS = [
    B("07:30", "07:45", "Wake · Hydrate",            "Fuel"),
    B("07:45", "08:30", "Movement / Walk",           "Workout"),
    B("08:30", "09:00", "Breakfast",                 "Breakfast"),
    B("09:00", "10:30", "Concept Consolidation",     "Study"),
    B("10:30", "10:40", "Sleepiness Check #1",       "Break"),
    B("10:40", "12:00", "Flashcard / Formula Pass",  "Revision"),
    B("12:00", "12:45", "Lunch",                     "Lunch"),
    B("12:45", "13:15", "Nap",                       "Nap"),
    B("13:15", "15:25", "Free Zone",                 "Free Zone"),
    B("15:25", "15:35", "Sleepiness Check #2 + Fuel","Fuel"),
    B("15:35", "16:45", "Prep for Week — Materials", "Planning"),
    B("16:45", "16:55", "Sleepiness Check #3",       "Break"),
    B("16:55", "18:15", "Weekly Review Draft",       "Planning",    "Mirror into Weekly Review view"),
    B("18:15", "19:00", "Dinner",                    "Dinner"),
    B("19:00", "20:30", "Social / Recovery",         "Recovery"),
    B("20:30", "20:45", "Free Zone",                 "Free Zone"),
    B("20:45", "21:00", "Shutdown Protocol",         "Planning"),
    B("21:00", "21:45", "Read",                      "Revision"),
    B("21:45", "22:00", "Wind Down",                 "Recovery"),
    B("22:00", "07:30", "Night Sleep",               "Night Sleep")
  ];

  /* --------------------------------------------------------------------------
   * 6. TEMPLATES MAP — day-of-week auto-selection uses getDay():
   *    0 = Sunday -> sunday | 6 = Saturday -> saturday | 1–5 -> weekday
   * ------------------------------------------------------------------------*/
  const TEMPLATES = {
    weekday: {
      key: "weekday",
      name: "Weekday",
      subtitle: "Mon – Fri · two deep-work cycles",
      days: [1, 2, 3, 4, 5],
      blocks: WEEKDAY_BLOCKS
    },
    saturday: {
      key: "saturday",
      name: "Saturday",
      subtitle: "Timed mock + review architecture",
      days: [6],
      blocks: SATURDAY_BLOCKS
    },
    sunday: {
      key: "sunday",
      name: "Sunday",
      subtitle: "Consolidation + weekly review",
      days: [0],
      blocks: SUNDAY_BLOCKS
    }
  };

  /* --------------------------------------------------------------------------
   * 7. SLEEPINESS CHECKPOINTS — three fixed 1–5 logs per day
   * ------------------------------------------------------------------------*/
  const SLEEPINESS_CHECKPOINTS = [
    { id: "s1", time: "11:05", label: "Mid-morning dip" },
    { id: "s2", time: "15:25", label: "Post-lunch trough" },
    { id: "s3", time: "16:45", label: "Late-afternoon wall" }
  ];

  /* --------------------------------------------------------------------------
   * 8. SHUTDOWN PROTOCOL CONFIG
   * ------------------------------------------------------------------------*/
  const SHUTDOWN = {
    start: "20:45",
    end: "21:00",
    verdicts: ["HIT", "MISS"],
    fields: ["unfinishedItems", "hardestTenMinutes", "notes"]
  };

  /* --------------------------------------------------------------------------
   * 9. ERROR CODES (single-letter taxonomy)
   * ------------------------------------------------------------------------*/
  const ERROR_CODES = [
    { code: "C", name: "Concept" },
    { code: "T", name: "Technique" },
    { code: "A", name: "Algebra" },
    { code: "P", name: "Proof" },
    { code: "M", name: "Misread" },
    { code: "S", name: "Speed" },
    { code: "D", name: "Didn't try" }
  ];

  /* --------------------------------------------------------------------------
   * 10. DAILY SCORE FIELDS (1–5)
   * ------------------------------------------------------------------------*/
  const SCORE_FIELDS = [
    { id: "sleepQuality", label: "Sleep Quality" },
    { id: "energy",       label: "Energy" },
    { id: "mood",         label: "Mood" },
    { id: "focus",        label: "Focus" },
    { id: "motivation",   label: "Motivation" }
  ];

  /* --------------------------------------------------------------------------
   * 11. MODULES — editable progress percentages live in localStorage data,
   *     but the canonical module list is defined here.
   * ------------------------------------------------------------------------*/
  const MODULES = [
    "Linear Algebra",
    "Calculus",
    "Real Analysis",
    "Complex Analysis",
    "ODEs",
    "PDEs",
    "Abstract Algebra",
    "Number Theory",
    "Topology",
    "Probability & Statistics"
  ];

  /* --------------------------------------------------------------------------
   * 12. BURNOUT ZONE RULES — evaluated newest-first over recent days.
   *     zone keys align with MODES keys so labels stay professional.
   * ------------------------------------------------------------------------*/
  const ZONES = [
    { zone: "essential", label: "Essential Plan", rule: "≥2 MISS in last 3 days OR avg Energy ≤ 2",
      action: "Switch to Essential Plan tomorrow. Sleep anchor first, everything else optional." },
    { zone: "recovery",  label: "Recovery Plan",  rule: "Avg Energy ≤ 2.5 OR any sleepiness ≥ 4 twice",
      action: "Run Recovery Plan: meals, nap, workout, one light revision block only." },
    { zone: "modified",  label: "Modified Load",  rule: "Avg Focus ≤ 3 OR completion < 60% over 3 days",
      action: "Trim deep-work blocks by ~30% and protect the shutdown ritual." },
    { zone: "full",      label: "Full Capacity",  rule: "Stable scores, HIT trend, completion ≥ 70%",
      action: "Hold the full template. Do not add extra load out of optimism." }
  ];

  /* --------------------------------------------------------------------------
   * Public, frozen namespace. app.js reads this; nothing writes to it.
   * ------------------------------------------------------------------------*/
  global.FOM_DATA = Object.freeze({
    VERSION: "2.1",
    APP_NAME: "FOM Daily Schedule",
    STORAGE_KEY: "fom-daily-schedule-v2.1",
    EXPORT_PREFIX: "fom-backup",
    CATEGORIES: CATEGORIES,
    MODES: MODES,
    TEMPLATES: TEMPLATES,
    SLEEPINESS_CHECKPOINTS: SLEEPINESS_CHECKPOINTS,
    SHUTDOWN: SHUTDOWN,
    ERROR_CODES: ERROR_CODES,
    SCORE_FIELDS: SCORE_FIELDS,
    MODULES: MODULES,
    ZONES: ZONES,
    /** Resolve template key from a JS Date's getDay() value. */
    templateKeyForDay: function (jsDay) {
      if (jsDay === 0) return "sunday";
      if (jsDay === 6) return "saturday";
      return "weekday";
    }
  });

})(window);
