LeetCode Hint Helper


LeetCode Hint Helper is a Chrome extension that provides helpful hints for LeetCode problems. The extension uses an API to fetch hints based on the name of the currently open LeetCode problem.
Features


Automatically detects the LeetCode problem name from the active tab.
Fetches hints using a backend server connected to an external API.
Displays the hints in a clean and intuitive popup interface.






https://github.com/user-attachments/assets/2d818f90-ab59-47b2-a2f7-7d9fe0b71e34


Installation
Clone the repository:
git clone https://github.com/your-username/leetlift.git
Navigate to the project directory:
cd leetlift

Install dependencies for the server:

npm install

Create a .env file in the root directory and add your API key:

GEMINI_API_KEY=your-api-key-here

Build the Chrome extension:

Ensure the manifest.json and related files are correctly set up.

Place the icon.png file in the root directory.


Usage


Load the extension:

Go to chrome://extensions/ in your browser.

Enable "Developer mode" in the top-right corner.

Click "Load unpacked" and select the project directory.

Start the server:

node server.mjs

