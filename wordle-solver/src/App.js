import "./App.css";
import { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { TextField, Typography } from "@mui/material";
import Checkbox from "@material-ui/core/Checkbox";
import React from "react";
import { fiveletterwords } from "./fiveletterwords";
import { Button } from "@material-ui/core";

function App() {
	const [currentWord, setCurrentWord] = useState(["", "", "", "", ""]);
	const [checked, setChecked] = useState([false, false, false, false, false]);
	const [possibleWords, setPossibleWords] = useState(fiveletterwords);
	const [nonoLetters, setNonoLetters] = useState([]);
	const [showHelp, setShowHelp] = useState(false);
	const numbersAsLetters = ["first", "second", "third", "fourth", "fifth"];

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
				//if there is no currentWord letter, skip it
				if (currentWord[i] === "") continue;
				//check ticked letter
				if (checked[i] === true) {
					if (word[i] !== currentWord[i]) aLetterIsWrong = true;
				}
				//check unticked letter
				else {
					if (
						word[i] === currentWord[i] ||
						!word.includes(currentWord[i])
					)
						aLetterIsWrong = true;
				}
			}
			return !aLetterIsWrong;
		});

		setPossibleWords(possibleWordsCopy);
		console.log("end", possibleWordsCopy.length);
	}

	function handleLetterChange(event, position) {
		let newWord = [...currentWord];
		newWord[position] = event.target.value;
		newWord[position] = newWord[position].toLowerCase();
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
			<Button onClick={() => setShowHelp(!showHelp)}>
				{showHelp ? "Hide Help" : "Show Help"}
			</Button>
			{showHelp && (
				<Typography maxWidth={"90%"}>
					How to use this website:
					<ol>
						<li>
							Guess a word in Wordle, then enter the word you
							guessed into the according boxes below.
						</li>
						<li>
							Check the boxes if you know the letter is (green) in
							the right position.
						</li>
						<li>
							Uncheck the boxes if you know the letter is (yellow)
							in the word but in wrong position.
						</li>
						<li>
							Enter the letters you know are not in the word into
							the nono letters box.
						</li>
					</ol>
				</Typography>
			)}
			<Grid container spacing={2}>
				{currentWord.map((letter, i) => (
					<Grid container item xs={12} key={i}>
						<Grid item xs={8}>
							<TextField
								type="text"
								id="l1"
								placeholder={
									"Enter the " +
									numbersAsLetters[i] +
									" letter"
								}
								maxLength={1}
								value={letter}
								onChange={(event) =>
									handleLetterChange(event, i)
								}
							/>
						</Grid>
						<Grid item xs={4}>
							<Checkbox
								checked={checked[i]}
								onChange={(event) =>
									handleCheckBoxChange(event, i)
								}
								style={{ color: "green" }}
							/>
						</Grid>
					</Grid>
				))}
				<Grid item xs={12}>
					<TextField
						type="text"
						id="nonoletters"
						placeholder="Enter the nono letters"
						value={nonoLetters.toString()}
						onChange={(event) => {
							setNonoLetters(event.target.value.toLowerCase());
						}}
						fullWidth
					/>
				</Grid>
			</Grid>

			<Button
				variant="contained"
				onClick={() => checkLetters(currentWord)}
				style={{ marginTop: "10px" }}
			>
				Check for words
			</Button>
			<Typography
				style={{ marginTop: "10px", maxHeight: 300, overflow: "auto" }}
			>
				Possible words:
				{possibleWords.slice(0, 20).map((word) => (
					<li key={word}>{word}</li>
				))}
			</Typography>
		</div>
	);
}

export default App;
