import { GREEN, GREY, YELLOW, filterWords, knownGreens, packPattern, rankGuesses, scoreGuess } from "./solver";

const pat = (s) => packPattern([...s].map((c) => ({ b: GREY, y: YELLOW, g: GREEN }[c])));
const row = (letters, s) => ({ letters, colours: [...s].map((c) => ({ b: GREY, y: YELLOW, g: GREEN }[c])) });

describe("scoreGuess", () => {
	test("all green for the answer itself", () => {
		expect(scoreGuess("crane", "crane")).toBe(pat("ggggg"));
	});

	test("yellow for right letter, wrong spot", () => {
		expect(scoreGuess("crane", "react")).toBe(pat("yygby"));
	});

	test("a repeated guess letter is only yellow as often as it appears in the answer", () => {
		// "speed" vs "abide": one e in the answer, so only the first e scores
		expect(scoreGuess("speed", "abide")).toBe(pat("bbyby"));
	});

	test("green takes priority over an earlier yellow for the same letter", () => {
		// "geese" vs "those": the final s and e are green, so no e is left for a yellow
		expect(scoreGuess("geese", "those")).toBe(pat("bbbgg"));
	});
});

describe("filterWords", () => {
	const words = ["crane", "react", "trace", "cater", "abide", "those", "speed"];

	test("no rows leaves every word", () => {
		expect(filterWords(words, [])).toEqual(words);
	});

	test("incomplete rows are ignored", () => {
		expect(filterWords(words, [row("cra", "ggg")])).toEqual(words);
	});

	test("keeps only words that would give the same colours", () => {
		expect(filterWords(words, [row("crane", "yygby")])).toEqual(["react"]);
	});

	test("a grey repeated letter does not rule out a word that has it once", () => {
		// Guessing "speed" at "abide" makes the 2nd e grey, but abide still fits
		expect(filterWords(words, [row("speed", "bbyby")])).toContain("abide");
	});

	test("correcting a colour widens the list again (no stale filtering)", () => {
		const narrowed = filterWords(words, [row("crane", "ggggg")]);
		const fixed = filterWords(words, [row("crane", "yygby")]);
		expect(narrowed).toEqual(["crane"]);
		expect(fixed).toEqual(["react"]);
	});
});

describe("rankGuesses", () => {
	test("prefers a guess that splits the candidates apart", () => {
		const candidates = ["batch", "catch", "hatch", "latch", "match", "patch", "watch"];
		const pool = [...candidates, "chimp", "plumb"];
		const [best] = rankGuesses(candidates, pool, 1);
		// Any single candidate leaves ~6 grouped together; a word testing
		// several first letters at once does better
		expect(best.expected).toBeLessThan(rankGuesses(candidates, ["batch"], 1)[0].expected);
	});

	test("with one candidate left, that word is the top guess", () => {
		expect(rankGuesses(["crane"], ["crane", "slate"], 1)[0]).toMatchObject({ word: "crane", expected: 0, isCandidate: true });
	});
});

test("knownGreens collects confirmed letters by position", () => {
	expect(knownGreens([row("crane", "gbbbg"), row("ch", "gg")])).toEqual(["c", null, null, null, "e"]);
});
