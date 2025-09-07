# 🐝 PycheBee

An interactive spelling bee practice application with car facts as rewards!

🎮 **Play Now:** [https://karthiksuri.com/pycheebee/](https://karthiksuri.com/pycheebee/)

## Features

- 📚 5 alphabet-based word sets (A-C, D-G, H-M, N-R, S-Z)
- 🔊 Voice pronunciation for each word
- 📖 Hints: Definition, Origin, Example (voice-only), Part of Speech
- 🏎️ Fun car facts after each answer
- 📱 Fully responsive design (no scrolling needed)
- 🏆 Score tracking and performance ratings

## How to Play

1. Choose a word set (organized by alphabet groups)
2. Listen to the pronunciation
3. Select the correct spelling from 4 options
4. Use hint buttons if needed:
   - **Definition**: See the word's meaning
   - **Origin**: Learn about the word's etymology
   - **Example**: Hear the word used in a sentence
   - **Part of Speech**: See if it's a noun, verb, etc.
5. Get instant feedback and a car fact!
6. Complete 10 words per set
7. See your final score and star rating

## Files Structure

pycheebee/
├── index.html # Main HTML file
├── styles.css # Styling and responsive design
├── script.js # Game logic and interactions
├── words-database.js # Word sets and car facts
├── LICENSE # MIT License
└── README.md # This file
## Technologies Used

- HTML5
- CSS3 (with responsive design)
- JavaScript (ES6)
- Web Speech API for pronunciation
- No external dependencies - pure vanilla JS!

## Local Development

```bash
# Clone the repository
git clone https://github.com/capsicumsambar/pycheebee.git

# Navigate to the project
cd pycheebee

# Open in browser (no build process needed!)
open index.html  # Mac
# OR
start index.html  # Windows
# OR
xdg-open index.html  # Linux
Browser Compatibility
Works best in:

✅ Chrome (recommended for best speech synthesis)
✅ Firefox
✅ Safari
✅ Edge
Note: Speech synthesis quality varies by browser and OS. Chrome typically provides the best voice quality.

Features in Detail
Word Sets
Set A-C: Words beginning with A, B, or C
Set D-G: Words beginning with D, E, F, or G
Set H-M: Words beginning with H, I, J, K, L, or M
Set N-R: Words beginning with N, O, P, Q, or R
Set S-Z: Words beginning with S, T, U, V, W, X, Y, or Z
Scoring System
✅ Correct on first try: 10 points
💡 Correct after hints: 5 points
❌ Incorrect: 0 points
⭐ Rating based on final score:
90-100 points: ⭐⭐⭐
70-89 points: ⭐⭐
Below 70 points: ⭐
Car Facts
Each answer reveals a random interesting fact about cars, making learning fun and rewarding!

Future Enhancements
🔐 User accounts and progress tracking
📊 Detailed statistics and learning analytics
🌍 More word sets and languages
🎚️ Difficulty levels (Easy, Medium, Hard)
👥 Multiplayer mode
🏆 Leaderboards
📱 Mobile app versions
🎨 Theme customization
🔄 Spaced repetition for better learning
Contributing
Contributions are welcome! Feel free to:

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
License
MIT License - see LICENSE file for details

Author
Karthik Suryanarayanan

Website: karthiksuri.com
GitHub: @capsicumsambar
Acknowledgments
Thanks to all the spelling bee enthusiasts
Car facts curated from various automotive sources
Inspired by the National Spelling Bee competition
Made with 🐝 and 🏎️ by Karthik Suryanarayanan
