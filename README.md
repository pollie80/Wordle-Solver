# Wordle Solver

Enter your Wordle guesses and the colours you got back, and the solver shows every word that still fits plus the best word to play next. Live at https://pythonwordlesolver.web.app/

## How it works
- **Matching:** a word stays in the list only if guessing your words against it would give exactly the colours you entered. This handles repeated letters the way Wordle does, and fixing a wrongly coloured tile updates the list immediately.
- **Best next guess:** each candidate guess is scored by the average number of words that would be left after playing it (lower is better). Hard mode only suggests words that fit your clues.
- **Possible answers:** the 5,757-word list is ordered by how common each word is. The 3,000 most common are treated as likely answers, and the rest can be hidden as "unusual".
- **Best starters:** worked out ahead of time, because scoring every word against every other word takes a few seconds.

## ReactJS app (`wordle-solver/`)
```
npm install
npm start          # dev server
npm test           # solver + UI tests
npm run build
firebase deploy    # publishes build/ to pythonwordlesolver.web.app
```
The solver logic lives in `src/solver.js` and the UI in `src/App.js`.

## Python
`Solver.py` is the original Tkinter version.
