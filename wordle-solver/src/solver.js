// Core Wordle logic, kept free of React so it can be tested and reused.
//
// Colours are numbers: 0 = grey (not in word), 1 = yellow (wrong spot),
// 2 = green (right spot). A row's five colours are packed into one base-3
// number (0..242) so patterns can be compared and bucketed cheaply.

export const GREY = 0;
export const YELLOW = 1;
export const GREEN = 2;

const A = 97; // 'a'

// Pack an array of five colours into a single pattern id.
export function packPattern(colours) {
	let p = 0;
	for (let i = 4; i >= 0; i--) p = p * 3 + colours[i];
	return p;
}

// The pattern Wordle would show for `guess` if the answer were `answer`.
// Handles repeated letters the way Wordle does: greens are claimed first,
// then yellows are handed out left to right only while unclaimed copies of
// that letter remain in the answer.
export function scoreGuess(guess, answer) {
	const counts = new Uint8Array(26);
	const colours = [0, 0, 0, 0, 0];
	for (let i = 0; i < 5; i++) {
		if (guess.charCodeAt(i) === answer.charCodeAt(i)) colours[i] = GREEN;
		else counts[answer.charCodeAt(i) - A]++;
	}
	for (let i = 0; i < 5; i++) {
		if (colours[i] === GREEN) continue;
		const c = guess.charCodeAt(i) - A;
		if (counts[c] > 0) {
			colours[i] = YELLOW;
			counts[c]--;
		}
	}
	return packPattern(colours);
}

// Words consistent with every completed row. A word fits if guessing each
// row's word against it would have produced exactly the colours entered.
export function filterWords(words, rows) {
	const complete = rows
		.filter((r) => r.letters.length === 5)
		.map((r) => ({ word: r.letters, pattern: packPattern(r.colours) }));
	if (complete.length === 0) return words;
	return words.filter((w) => complete.every((r) => scoreGuess(r.word, w) === r.pattern));
}

// Rank guesses by how well they split the remaining candidates: the lower the
// expected number of words left after guessing, the better. Candidates get a
// small edge on ties because they might win outright.
export function rankGuesses(candidates, pool, limit = 10) {
	const n = candidates.length;
	if (n === 0) return [];
	const candidateSet = new Set(candidates);
	const buckets = new Uint16Array(243);
	const results = [];

	for (const guess of pool) {
		buckets.fill(0);
		for (const answer of candidates) buckets[scoreGuess(guess, answer)]++;

		let sumSquares = 0;
		let groups = 0;
		for (let p = 0; p < 243; p++) {
			const b = buckets[p];
			if (b) {
				sumSquares += b * b;
				groups++;
			}
		}
		const isCandidate = candidateSet.has(guess);
		// A candidate that is the answer leaves 0 words, so it removes one
		// word's worth from the expectation.
		const expected = (sumSquares - (isCandidate ? 1 : 0)) / n;
		results.push({ word: guess, expected, groups, isCandidate });
	}

	results.sort(
		(a, b) =>
			a.expected - b.expected ||
			(b.isCandidate ? 1 : 0) - (a.isCandidate ? 1 : 0) ||
			b.groups - a.groups
	);
	return results.slice(0, limit);
}

// Best letter state per key for the on-screen keyboard (green beats yellow
// beats grey). Letters never tried are absent from the map.
export function keyStates(rows) {
	const states = {};
	for (const r of rows) {
		if (r.letters.length !== 5) continue;
		for (let i = 0; i < 5; i++) {
			const l = r.letters[i];
			const c = r.colours[i];
			if (states[l] === undefined || c > states[l]) states[l] = c;
		}
	}
	return states;
}

// Positions already confirmed green by earlier rows, so a new guess can be
// pre-coloured: if the answer has 'r' in slot 2, any guess with 'r' there
// will be green too.
export function knownGreens(rows) {
	const greens = [null, null, null, null, null];
	for (const r of rows) {
		if (r.letters.length !== 5) continue;
		for (let i = 0; i < 5; i++) if (r.colours[i] === GREEN) greens[i] = r.letters[i];
	}
	return greens;
}
