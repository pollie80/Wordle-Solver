import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";

beforeEach(() => localStorage.clear());

function type(word) {
	for (const k of word) fireEvent.keyDown(window, { key: k });
}

test("shows starter suggestions before any guess", () => {
	render(<App />);
	expect(screen.getByText(/type your first guess/i)).toBeInTheDocument();
	expect(screen.getByRole("tab", { name: /best starters/i })).toBeInTheDocument();
});

test("typing a guess and tapping tiles narrows the answers", () => {
	render(<App />);
	type("crane");
	// All grey by default: many words remain
	expect(screen.getByText(/possible words left/i)).toBeInTheDocument();

	// Tap every tile twice to make them all green: solved
	const board = screen.getByRole("region", { name: /your guesses/i });
	const tiles = within(board).getAllByRole("button", { name: /tap to change colour/i });
	tiles.forEach((t) => {
		fireEvent.click(t);
		fireEvent.click(t);
	});
	expect(screen.getByText(/solved in 1/i)).toBeInTheDocument();
	expect(screen.getByRole("tab", { name: /possible answers/i })).toHaveTextContent("1");
});

test("backspace removes letters and New game clears the board", () => {
	render(<App />);
	type("cra");
	fireEvent.keyDown(window, { key: "Backspace" });
	const board = screen.getByRole("region", { name: /your guesses/i });
	expect(within(board).getAllByRole("button", { name: /tap to change colour/i })).toHaveLength(2);
	fireEvent.click(screen.getByRole("button", { name: /new game/i }));
	expect(within(board).queryAllByRole("button", { name: /tap to change colour/i })).toHaveLength(0);
});

test("words listed as possible answers always fit the clues", async () => {
	// The board from a bug report: WATER and COILS with only E and L yellow
	localStorage.setItem(
		"ws.rows",
		JSON.stringify([
			{ letters: "water", colours: [0, 0, 0, 1, 0] },
			{ letters: "coils", colours: [0, 0, 0, 1, 0] },
		])
	);
	render(<App />);
	const heading = await screen.findByRole("heading", { name: /could be the answer/i });
	const list = heading.nextElementSibling;
	const words = within(list)
		.getAllByRole("button")
		.map((b) => b.querySelector(".word").textContent);
	expect(words.length).toBeGreaterThan(0);
	for (const w of words) {
		expect(w).not.toMatch(/[watrcois]/); // greys never appear
		expect(w).toMatch(/e/);
		expect(w).toMatch(/l/);
	}
});
