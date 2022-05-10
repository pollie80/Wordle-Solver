import "./App.css";
import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { TextField, Typography } from "@mui/material";
import Checkbox from "@material-ui/core/Checkbox";

function App() {
	const [currentWord, setCurrentWord] = useState(["", "", "", "", ""]);
	const [checked, setChecked] = useState([false, false, false, false, false]);
	const [possibleWords, setPossibleWords] = useState(["brain", "whats"]);

	function checkLetters(params) {
		alert("checking");
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
			</Grid>

			<button onClick={() => checkLetters(currentWord)}>Check</button>
			<Typography variant="h6">
				{possibleWords.map((word) => (
					<li key={word}>{word}</li>
				))}
			</Typography>
		</div>
	);
}

export default App;
