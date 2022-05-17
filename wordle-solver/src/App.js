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
	const [nonoLetters, setNonoLetters] = useState([]);

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
		console.log("start", possibleWords.length);
		alert("checking");
		let possibleWordsCopy = [...possibleWords];

		if (nonoLetters.length > 0) {
			//print empty
			console.log("nonoLetters exist");
			//get rid of words that include nono letters
			for (let j = 0; j < nonoLetters.length; j++) {
				let nonoLetter = nonoLetters[j];
				let newPossibleWords = possibleWordsCopy.filter(
					(word) => !word.includes(nonoLetter)
				);
				possibleWordsCopy = newPossibleWords;
			}
		} else {
			console.log("nonoLetters do not exist");
		}

		//only keep words that have all the letters in the right positions and if they are checked
		possibleWordsCopy = possibleWordsCopy.filter((word) => {
			let aLetterIsWrong = false;
			for (let i = 0; i < 5; i++) {
				//check ticked letter
				if (checked[i] === true) {
					if (word[i] !== currentWord[i]) aLetterIsWrong = true;
				}
				//check unticked letter
				else {
					if (currentWord[i] !== "") {
						if (word[i] === currentWord[i]) aLetterIsWrong = true;
					}
				}
			}
			return !aLetterIsWrong;
		});

		//

		alert("done");
		setPossibleWords(possibleWordsCopy);
		console.log("end", possibleWordsCopy.length);
	}

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
						value={nonoLetters.toString()}
						onChange={(event) => {
							setNonoLetters(event.target.value);
						}}
					/>
				</Grid>
			</Grid>

			<button onClick={() => checkLetters(currentWord)}>Check</button>
			<Typography style={{ maxHeight: 200, overflow: "auto" }}>
				{possibleWords.slice(0, 20).map((word) => (
					<li key={word}>{word}</li>
				))}
			</Typography>
		</div>
	);
}

export default App;
