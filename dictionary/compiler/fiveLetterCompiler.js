import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to filter 5-letter words and save to a new file
function createFiveLetterDictionary() {
   const inputPath = path.join(__dirname, './compiled/compiled_630k.json');
   const outputPath = path.join(__dirname, './compiled/fiveLetters.json');

   // Read the compiled dictionary
   const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

   // Filter for 5-letter words
   const fiveLetterWords = data.filter(entry => entry[0].length === 5);

   // Save the filtered dictionary with compact nested arrays
   const jsonString = JSON.stringify(fiveLetterWords, null, 3)
   fs.writeFileSync(outputPath, jsonString, 'utf-8');
   console.log(`Five-letter dictionary saved to ${outputPath}`);
}

// Execute the function
createFiveLetterDictionary();
