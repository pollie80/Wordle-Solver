import "./App.css";
import { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { TextField, Typography } from "@mui/material";
import Checkbox from "@material-ui/core/Checkbox";
import React from "react";
import { fiveletterwords } from "./fiveletterwords";

function App() {
	const [currentWord, setCurrentWord] = useState(["", "", "", "", ""]);
	const [checked, setChecked] = useState([false, false, false, false, false]);
	const [possibleWords, setPossibleWords] = useState(fiveletterwords);
	const [nonoLetters, setNonoLetters] = useState([""]);

	useEffect(() => {
		fetch("./fiveletterwords.txt")
			.then((r) => r.text())
			.then((text) => {
				console.log(text);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	function checkLetters() {
		alert("checking");
		// for (int i = 0; i < 5; i++) {

		//     for letter_entry in letter_entries:
		//         letter = letter_entry.get()
		//         position = letter_entries.index(letter_entry)
		//         no_no_letters = no_no_letters_entry.get()

		//         # get rid of no no words
		//         if no_no_letters:
		//             temp_words_copy = temp_words.copy()
		//             for word in temp_words:
		//                 if bool(re.search('[' + no_no_letters + ']', word)):
		//                     temp_words_copy.remove(word)
		//             temp_words = temp_words_copy

		//         if letter:
		//             limit_words(letter, position, is_sures[position].get(), no_no_letters)

		//         # print(position, letter, is_sures[position].get())

		//     print(temp_words.__len__())
		//     for word in temp_words:
		//         print(word)
		//     print("done")
		//     solutions_var.set(temp_words)
	}

	// def limit_words(letter, position, is_sure, no_no_letters):
	//     global temp_words
	//     print("limiting ", letter, "...")

	//     if is_sure:
	//         # green letter
	//         temp_words_copy = temp_words.copy()

	//         for word in temp_words:
	//             if word[position] != letter or (no_no_letters and bool(re.search('['+no_no_letters+']', word))):
	//                 temp_words_copy.remove(word)
	//     else:
	//         # yellow letter
	//         temp_words_copy = []
	//         for word in temp_words:
	//             if word[position] != letter and letter in word and (no_no_letters and not bool(re.search('['+no_no_letters+']', word))):
	//                 temp_words_copy.append(word)

	//     temp_words = temp_words_copy

	function handleLetterChange(event, position) {
		let newWord = [...currentWord];
		newWord[position] = event.target.value;
		setCurrentWord(newWord);
	}

	function handleCheckBoxChange(event, position) {
		let newChecked = checked.slice();
		newChecked[position] = event.target.checked;
		setChecked(newChecked);
	}

	return (
		<div className="App">
			<h1>Wordle Solver</h1>
			<Grid container spacing={2}>
				<Grid item xs={8}>
					<TextField
						type="text"
						id="l1"
						placeholder="Enter the first letter"
						maxLength={1}
						value={currentWord[0]}
						onChange={(event) => handleLetterChange(event, 0)}
					/>
				</Grid>
				<Grid item xs={4}>
					<Checkbox
						checked={checked[0]}
						onChange={(event) => handleCheckBoxChange(event, 0)}
					/>
				</Grid>
				<Grid item xs={8}>
					<TextField
						type="text"
						id="l2"
						placeholder="Enter the second letter"
						maxLength={1}
						value={currentWord[1]}
						onChange={(event) => handleLetterChange(event, 1)}
					/>
				</Grid>
				<Grid item xs={4}>
					<Checkbox
						checked={checked[1]}
						onChange={(event) => handleCheckBoxChange(event, 1)}
					/>
				</Grid>
				<Grid item xs={8}>
					<TextField
						type="text"
						id="l3"
						placeholder="Enter the third letter"
						maxLength={1}
						value={currentWord[2]}
						onChange={(event) => handleLetterChange(event, 2)}
					/>
				</Grid>
				<Grid item xs={4}>
					<Checkbox
						checked={checked[2]}
						onChange={(event) => handleCheckBoxChange(event, 2)}
					/>
				</Grid>
				<Grid item xs={8}>
					<TextField
						type="text"
						id="l4"
						placeholder="Enter the fourth letter"
						maxLength={1}
						value={currentWord[3]}
						onChange={(event) => handleLetterChange(event, 3)}
					/>
				</Grid>
				<Grid item xs={4}>
					<Checkbox
						checked={checked[3]}
						onChange={(event) => handleCheckBoxChange(event, 3)}
					/>
				</Grid>
				<Grid item xs={8}>
					<TextField
						type="text"
						id="l5"
						placeholder="Enter the fifth letter"
						maxLength={1}
						value={currentWord[4]}
						onChange={(event) => handleLetterChange(event, 4)}
					/>
				</Grid>
				<Grid item xs={4}>
					<Checkbox
						checked={checked[4]}
						onChange={(event) => handleCheckBoxChange(event, 4)}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						type="text"
						id="nonoletters"
						placeholder="Enter the nono letters"
						value={nonoLetters.join("").toString()}
						onChange={(event) => {
							setNonoLetters(...nonoLetters, event.target.value);
						}}
					/>
				</Grid>
			</Grid>

			<button onClick={() => checkLetters(currentWord)}>Check</button>
			<Typography>
				{fiveletterwords.slice(0, 20).map((word) => (
					<li key={word}>{word}</li>
				))}
			</Typography>
		</div>
	);
}

export default App;
