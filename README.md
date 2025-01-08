# Wordle Solver

## Overview

This app is a tool for solving Wordle puzzles efficiently. It is designed for experimenting with different dictionaries (lists of allowed words) and engines (algorithms for choosing the next best guess) to find the best strategies for solving Wordle. Users can simulate solving games, test new engines, benchmark performance, and more.

### What is Wordle?

Wordle is a word puzzle game where players have six attempts to guess a secret five-letter word. Feedback for each guess is given as:

- **Green**: Correct letter in the correct position.
- **Yellow**: Correct letter but in the wrong position.
- **Grey**: Letter not in the word.

### Key Features

1. **Custom Dictionaries**: Easily swap dictionaries to use different word lists.
2. **Custom Engines**: Create and test algorithms for selecting guesses.
3. **Simulations and Benchmarks**: Run simulations to analyze engine performance across word lists.

## Installation

1. Clone this repository.
2. Run `npm install` to install dependencies.

## Usage

### Commands

- **`npm start`**:

   - Starts a server on port 8080 (configurable in `config/config.js`).
   - Receives guess requests via HTTP GET requests.
   - Example:
      - URL: `http://localhost:8080/get-help?pastGuesses=[{"word":"aerio","results":[false,false,null,null,null]}]`, where pastGuesses includes all previously made guesses and the feedback that they generated
      - Response: `Best weighted guess: aster with score: 1.972480950373796
         Best plain guess: aerio with score: 1.7851523141897074`

- **`npm run test`**:

   - Runs tests to verify the validity of the dictionary and config files.
   - Always run this after changing the configuration or manipulating dictionary files.

- **`npm run update-meta`**:

   - Pre-calculates the first guess for every engine based on the current dictionary.
   - Run this after selecting a new dictionary or engine.

- **`npm run sim`**:

   - Simulates the engine solving a random word from the current dictionary.
   - Enable additional logging in the config file if needed.

- **`npm run bench`**:

   - Simulates the engine solving every word in the current dictionary.
   - Outputs results to a JSON file in the root directory: `[ [word, weight, round], ... ]`, where "round" is the attempt on which the word was solved, or `0` if unsolved.
   - Analyze results using `benchmarking/stats.js`.

## Dictionary Requirements

1. **Dictionaries must only contain lowercase letters.**
2. **According to wordle rules, words should have real meanings (no abbreviations, names, or nonsense), but you are free to use any dictionary.**
3. **File Structure:**
   - `/dictionary/index.js`: Exports the currently enabled dictionary used for word search (change in config).
   - `/dictionaryMetadata.json`: Metadata containing pre-calculated first guesses.

### Sources of Dictionaries

- **Weighted Dictionaries**: `https://www.kaggle.com/datasets/rtatman/english-word-frequency`
- **Scrabble Dictionaries**: Various sources.

## Engines

### Adding a New Engine

Engines must extend the `BaseEngine` class and implement their own logic for selecting guesses.

#### Provided Methods:

- **`firstGuess()`**: Retrieves the first guess from pre-calculated metadata.
- **`getReducedDictionary()`**: Filters out words based on past guesses and feedback.

#### Input Format for Guesses:

- Example past guess:
  ```json
  {
    "word": "aerio",
    "results": [false, false, null, null, null]
  }
  ```
  - `true`: Correct letter and position (green).
  - `false`: Correct letter, wrong position (yellow).
  - `null`: Letter not in the word (grey).

### Enabled Engine and Dictionary

Control which engine and dictionary are active via the `config/config.js` file.

## File Structure

- `/dictionary`: Contains word lists and metadata.
- `/benchmarking`: Scripts for analyzing engine performance.
- `/misc`: Reference files and miscellaneous utilities./misc: Reference files and miscellaneous utilities.
- `/config` the config file and list of allowed characters in dictionaries.
- `/models` All different engine models.
- `/tools` Various tools and useful functions made available to all engines.

## Notes

- **Performance**: Turn off console logging for faster simulations.
- **Testing**: Always run `npm run test` after updating configuration or dictionary files.
- **Pre-Calculation**: Remember to run `npm run update-meta` after selecting a new dictionary.

## License

MIT License

