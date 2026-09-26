import "./App.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fiveletterwords } from "./fiveletterwords";
import {
	GREEN,
	filterWords,
	keyStates,
	knownGreens,
	rankGuesses,
} from "./solver";

// The word list is ordered from most to least common, so a word's index is
// a good proxy for how likely it is to be a Wordle answer.
const WORDS = fiveletterwords;
const RANK = new Map(WORDS.map((w, i) => [w, i]));
const COMMON_CUTOFF = 3000;
const isCommon = (w) => RANK.get(w) < COMMON_CUTOFF;

// Scoring every word against every word takes seconds, so the best openers
// were worked out ahead of time with rankGuesses (see README).
const OPENERS = {
	all: [
		["tares", 132.5], ["rates", 135.8], ["aloes", 136.6], ["nares", 139.5], ["tales", 139.5],
		["saner", 142.2], ["lores", 143.7], ["reals", 144.4], ["roles", 144.7], ["lanes", 148.2],
	],
	common: [
		["tares", 62.9], ["tales", 64.9], ["rates", 65.2], ["aloes", 65.5], ["reals", 66.8],
		["saner", 68.2], ["nares", 68.2], ["lores", 68.6], ["roles", 69.7], ["lanes", 71.1],
	],
};

// Upper bound on guess-vs-answer comparisons per ranking, to keep it snappy.
const WORK_BUDGET = 2500000;
const MAX_ROWS = 6;
const ANSWER_PAGE = 60;
const COLOUR_NAMES = ["grey", "yellow", "green"];
const KEY_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

const emptyRow = () => ({ letters: "", colours: [0, 0, 0, 0, 0] });

function load(key, fallback) {
	try {
		const v = JSON.parse(localStorage.getItem(key));
		return v === null ? fallback : v;
	} catch (e) {
		return fallback;
	}
}
function save(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {}
}

function validRows(rows) {
	return (
		Array.isArray(rows) &&
		rows.length > 0 &&
		rows.every((r) => typeof r.letters === "string" && Array.isArray(r.colours))
	);
}

function App() {
	const [rows, setRows] = useState(() => {
		const saved = load("ws.rows", null);
		return validRows(saved) ? saved : [emptyRow()];
	});
	const [tab, setTab] = useState("guesses");
	const [hideRare, setHideRare] = useState(() => load("ws.hideRare", true));
	const [hardMode, setHardMode] = useState(() => load("ws.hardMode", false));
	const [showHelp, setShowHelp] = useState(() => !load("ws.seenHelp", false));
	const [answerLimit, setAnswerLimit] = useState(ANSWER_PAGE);
	const [ranked, setRanked] = useState(null);

	useEffect(() => save("ws.rows", rows), [rows]);
	useEffect(() => save("ws.hideRare", hideRare), [hideRare]);
	useEffect(() => save("ws.hardMode", hardMode), [hardMode]);

	const completeRows = rows.filter((r) => r.letters.length === 5);
	const allMatches = useMemo(() => filterWords(WORDS, rows), [rows]);
	const commonMatches = useMemo(() => allMatches.filter(isCommon), [allMatches]);
	// If every remaining word is "rare", show them rather than an empty list
	const rareFallback = hideRare && commonMatches.length === 0 && allMatches.length > 0;
	const matches = hideRare && !rareFallback ? commonMatches : allMatches;
	const hiddenCount = allMatches.length - matches.length;

	// Rank next guesses off the main render so typing never stutters. The
	// result remembers which inputs it was computed for, so a stale ranking is
	// never shown for a newer board.
	const hasGuesses = completeRows.length > 0;
	useEffect(() => {
		if (!hasGuesses) return;
		const id = setTimeout(() => {
			const n = matches.length;
			let pool;
			if (n <= 2 || hardMode) pool = matches;
			else if (n * WORDS.length <= WORK_BUDGET) pool = WORDS;
			else {
				const extra = WORDS.slice(0, Math.floor(WORK_BUDGET / n));
				pool = Array.from(new Set([...matches.slice(0, 300), ...extra]));
			}
			setRanked({ matches, hardMode, list: rankGuesses(matches, pool, 12) });
		}, 30);
		return () => clearTimeout(id);
	}, [hasGuesses, matches, hardMode]);

	useEffect(() => setAnswerLimit(ANSWER_PAGE), [matches]);

	let suggestions; // undefined while a ranking is being computed
	if (!hasGuesses) {
		suggestions = OPENERS[hideRare ? "common" : "all"].map(([word, expected]) => ({
			word,
			expected,
			isCandidate: true,
		}));
	} else if (ranked && ranked.matches === matches && ranked.hardMode === hardMode) {
		suggestions = ranked.list;
	}

	/* ---------- Board editing ---------- */
	const addLetter = useCallback((letter) => {
		setRows((prev) => {
			const next = prev.map((r) => ({ ...r, colours: [...r.colours] }));
			let last = next[next.length - 1];
			if (last.letters.length === 5) {
				if (next.length >= MAX_ROWS) return prev;
				last = emptyRow();
				next.push(last);
			}
			const pos = last.letters.length;
			// Pre-colour letters already confirmed green in that slot
			const greens = knownGreens(next.slice(0, -1));
			last.letters += letter;
			last.colours[pos] = greens[pos] === letter ? GREEN : 0;
			return next;
		});
	}, []);

	const removeLetter = useCallback(() => {
		setRows((prev) => {
			const next = prev.map((r) => ({ ...r, colours: [...r.colours] }));
			let last = next[next.length - 1];
			if (last.letters.length === 0) {
				if (next.length === 1) return prev;
				next.pop();
				last = next[next.length - 1];
			}
			last.colours[last.letters.length - 1] = 0;
			last.letters = last.letters.slice(0, -1);
			return next;
		});
	}, []);

	const newRow = useCallback(() => {
		setRows((prev) => {
			const last = prev[prev.length - 1];
			if (last.letters.length !== 5 || prev.length >= MAX_ROWS) return prev;
			return [...prev, emptyRow()];
		});
	}, []);

	function cycleColour(rowIndex, i) {
		setRows((prev) =>
			prev.map((r, ri) => {
				if (ri !== rowIndex || !r.letters[i]) return r;
				const colours = [...r.colours];
				colours[i] = (colours[i] + 1) % 3;
				return { ...r, colours };
			})
		);
	}

	function deleteRow(rowIndex) {
		setRows((prev) => {
			const next = prev.filter((_, ri) => ri !== rowIndex);
			return next.length ? next : [emptyRow()];
		});
	}

	function pickWord(word) {
		setRows((prev) => {
			const next = [...prev];
			const last = next[next.length - 1];
			let target;
			if (last.letters.length < 5) target = next.length - 1;
			else if (next.length < MAX_ROWS) target = next.length;
			else return prev;
			const greens = knownGreens(next.slice(0, target));
			next[target] = {
				letters: word,
				colours: [...word].map((l, i) => (greens[i] === l ? GREEN : 0)),
			};
			return next;
		});
	}

	function reset() {
		setRows([emptyRow()]);
	}

	function closeHelp() {
		setShowHelp(false);
		save("ws.seenHelp", true);
	}

	// Physical keyboard support
	useEffect(() => {
		function onKey(e) {
			if (e.ctrlKey || e.metaKey || e.altKey) return;
			if (e.target.closest && e.target.closest("button, input, a")) {
				if (e.key === "Enter" || e.key === " ") return; // let buttons work
			}
			const k = e.key.toLowerCase();
			if (/^[a-z]$/.test(k)) {
				addLetter(k);
				e.preventDefault();
			} else if (e.key === "Backspace") {
				removeLetter();
				e.preventDefault();
			} else if (e.key === "Enter") {
				newRow();
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [addLetter, removeLetter, newRow]);

	/* ---------- Render ---------- */
	const keys = keyStates(rows);
	const last = rows[rows.length - 1];
	const lastComplete = completeRows[completeRows.length - 1];
	const solved = !!lastComplete && lastComplete.colours.every((c) => c === GREEN);
	const boardRows = [...rows];
	if (last.letters.length === 5 && rows.length < MAX_ROWS && !solved) boardRows.push(null);
	const boardFull = last.letters.length === 5 && rows.length >= MAX_ROWS;

	let status;
	if (solved) {
		status = (
			<>
				<strong>Solved in {completeRows.length}!</strong> Nice work. Hit <b>New game</b> for tomorrow's.
			</>
		);
	} else if (completeRows.length === 0) {
		status = (
			<>
				<strong>Type your first guess</strong>, or tap a starter word below.
			</>
		);
	} else if (allMatches.length === 0) {
		status = (
			<>
				<strong>No words fit those colours.</strong> Check for a tile that's the wrong colour.
			</>
		);
	} else if (matches.length === 1) {
		status = (
			<>
				It's <strong className="answer">{matches[0]}</strong>!{" "}
				<button className="link" onClick={() => pickWord(matches[0])}>
					Put it on the board
				</button>
			</>
		);
	} else {
		status = (
			<>
				<strong className="count">{matches.length.toLocaleString()}</strong> possible
				{matches.length === 1 ? " word" : " words"} left
			</>
		);
	}

	return (
		<div className="app">
			<header className="top">
				<h1>
					Wordle <span>Solver</span>
				</h1>
				<div className="top-actions">
					<button className="ghost" onClick={() => setShowHelp((s) => !s)} aria-expanded={showHelp}>
						How it works
					</button>
					<button className="ghost" onClick={reset} disabled={rows.length === 1 && !rows[0].letters}>
						New game
					</button>
				</div>
			</header>

			{showHelp && (
				<section className="help" aria-label="How it works">
					<ol>
						<li>
							<b>Type the word you guessed</b> in Wordle (or tap a suggestion).
						</li>
						<li>
							<b>Tap each tile</b> to match Wordle's colours:{" "}
							<span className="mini c0">grey</span> <span className="mini c1">yellow</span>{" "}
							<span className="mini c2">green</span>.
						</li>
						<li>
							<b>Pick your next word</b> from the lists. Press Enter or just keep typing for the next row.
						</li>
					</ol>
					<button className="ghost" onClick={closeHelp}>
						Got it
					</button>
				</section>
			)}

			<main className="layout">
				<section className="board-wrap" aria-label="Your guesses">
					<div className="board">
						{boardRows.map((row, ri) =>
							row === null ? (
								<div className="row ghost-row" key="next" aria-hidden="true">
									{[0, 1, 2, 3, 4].map((i) => (
										<span className="tile empty" key={i} />
									))}
								</div>
							) : (
								<div className="row" key={ri}>
									{[0, 1, 2, 3, 4].map((i) => {
										const letter = row.letters[i];
										return (
											<button
												key={i}
												className={`tile ${letter ? "c" + row.colours[i] : "empty"}`}
												onClick={() => cycleColour(ri, i)}
												disabled={!letter}
												aria-label={
													letter
														? `${letter.toUpperCase()}, ${COLOUR_NAMES[row.colours[i]]}. Tap to change colour`
														: "Empty"
												}
											>
												{letter}
											</button>
										);
									})}
									{row.letters.length > 0 && (
										<button className="row-x" onClick={() => deleteRow(ri)} aria-label={`Remove row ${ri + 1}`}>
											×
										</button>
									)}
								</div>
							)
						)}
					</div>
					<p className="hint">
						{solved
							? "All green. Tap a tile if you need to fix a colour."
							: boardFull
							? "That's six guesses. Good luck!"
							: "Tap a tile to change its colour."}
					</p>

					<div className="keyboard" aria-label="Keyboard">
						{KEY_ROWS.map((row, ri) => (
							<div className="key-row" key={row}>
								{ri === 2 && (
									<button className="key wide" onClick={newRow}>
										Enter
									</button>
								)}
								{[...row].map((k) => (
									<button
										key={k}
										className={`key ${keys[k] !== undefined ? "c" + keys[k] : ""}`}
										onClick={() => addLetter(k)}
									>
										{k}
									</button>
								))}
								{ri === 2 && (
									<button className="key wide" onClick={removeLetter} aria-label="Backspace">
										⌫
									</button>
								)}
							</div>
						))}
					</div>
				</section>

				<section className="panel" aria-label="Suggestions">
					<p className="status" aria-live="polite">
						{status}
					</p>

					<div className="tabs" role="tablist">
						<button role="tab" aria-selected={tab === "guesses"} onClick={() => setTab("guesses")}>
							{completeRows.length === 0 ? "Best starters" : "Best next guess"}
						</button>
						<button role="tab" aria-selected={tab === "answers"} onClick={() => setTab("answers")}>
							Possible answers <span className="pill">{matches.length.toLocaleString()}</span>
						</button>
					</div>

					<div className="toggles">
						<label>
							<input type="checkbox" checked={hideRare} onChange={(e) => setHideRare(e.target.checked)} />
							Hide unusual words
						</label>
						{tab === "guesses" && completeRows.length > 0 && (
							<label>
								<input type="checkbox" checked={hardMode} onChange={(e) => setHardMode(e.target.checked)} />
								Hard mode (only words that fit the clues)
							</label>
						)}
					</div>

					{tab === "guesses" ? (
						<div className="guess-list">
							{suggestions === undefined ? (
								<p className="muted">Crunching the numbers…</p>
							) : suggestions && suggestions.length ? (
								<>
									<p className="muted small">
										Ranked by how many words are left on average after guessing. Lower is better.
									</p>
									<ol>
										{suggestions.map((s, i) => {
											const best = suggestions[0].expected || 1;
											const worst = Math.max(suggestions[suggestions.length - 1].expected, best);
											const width = worst === best ? 100 : 100 - ((s.expected - best) / (worst - best)) * 55;
											return (
												<li key={s.word}>
													<button className="guess" onClick={() => pickWord(s.word)} title="Use this word">
														<span className="rank">{i + 1}</span>
														<span className="word">{s.word}</span>
														<span className="meter" aria-hidden="true">
															<span style={{ width: `${width}%` }} />
														</span>
														<span className="left">
															{s.expected === 0
																? "0 left"
																: `~${s.expected < 10 ? s.expected.toFixed(1) : Math.round(s.expected)} left`}
														</span>
														{completeRows.length > 0 && s.isCandidate && (
															<span className="tag">could be it</span>
														)}
													</button>
												</li>
											);
										})}
									</ol>
								</>
							) : (
								<p className="muted">Nothing to suggest yet.</p>
							)}
						</div>
					) : (
						<div className="answers">
							{matches.length === 0 ? (
								<p className="muted">No matches.</p>
							) : (
								<>
									<p className="muted small">Most common words first. Tap one to use it.</p>
									<div className="chips">
										{matches.slice(0, answerLimit).map((w) => (
											<button
												key={w}
												className={`chip ${isCommon(w) ? "" : "rare"}`}
												onClick={() => pickWord(w)}
												title={isCommon(w) ? "Use this word" : "Unusual word, less likely to be the answer"}
											>
												{w}
											</button>
										))}
									</div>
									{matches.length > answerLimit && (
										<button className="link more" onClick={() => setAnswerLimit((l) => l + 240)}>
											Show more ({(matches.length - answerLimit).toLocaleString()} left)
										</button>
									)}
								</>
							)}
							{rareFallback && (
								<p className="muted small">Only unusual words fit, so they're shown anyway.</p>
							)}
							{hiddenCount > 0 && (
								<button className="link" onClick={() => setHideRare(false)}>
									+ {hiddenCount.toLocaleString()} unusual {hiddenCount === 1 ? "word" : "words"} hidden
								</button>
							)}
						</div>
					)}
				</section>
			</main>

			<footer className="foot">
				Made by{" "}
				<a href="https://pollie80.github.io/PersonalWebsite/" target="_blank" rel="noreferrer">
					Tian Welgemoed
				</a>
				. Not affiliated with Wordle or The New York Times.
			</footer>
		</div>
	);
}

export default App;
