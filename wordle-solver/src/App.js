import "./App.css";
import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { TextField, Typography } from "@mui/material";
import Checkbox from "@material-ui/core/Checkbox";

function App() {
	const [currentWord, setCurrentWord] = useState("");

	function checkLetters(params) {}

	function handleLetterChange(event, position) {
		const newWord = currentWord.split("");
		newWord[position] = event.target.value;
		setCurrentWord(newWord.join(""));
	}

	return (
		<div className="App">
			<header className="App-header">
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
						{/* <Checkbox
							checked={checked}
							onChange={handleChange}
							inputProps={{ "aria-label": "controlled" }}
						/> */}
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
				</Grid>

				<button onClick={() => checkLetters(currentWord)}>Check</button>
			</header>
			<body></body>
		</div>
	);
}

export default App;
