document.addEventListener('DOMContentLoaded', () => {
  const getHintButton = document.getElementById('getHintButton');
  const hintsContainer = document.getElementById('hintsContainer');

  getHintButton.addEventListener('click', async () => {
    hintsContainer.innerHTML = 'Loading hints...';
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url.includes('leetcode.com/problems/')) {
      const problemUrl = tab.url;
      
      chrome.runtime.sendMessage({ type: "getHint", problemUrl: problemUrl }, (response) => {
        if (chrome.runtime.lastError) {
          hintsContainer.innerHTML = `Error: ${chrome.runtime.lastError.message}`;
          return;
        }

        if (response.status === "success") {
          hintsContainer.innerHTML = '';
          const hints = response.hint; 
          if (hints && Array.isArray(hints) && hints.length > 0) {
            hints.forEach((hint) => { // Loop through the already formatted hints
              const hintElement = document.createElement('p');
              hintElement.textContent = hint; // Use textContent to prevent XSS
              hintsContainer.appendChild(hintElement);
            });
          } else {
            hintsContainer.innerHTML = 'No hints found for this problem.';
          }
        } else {
          hintsContainer.innerHTML = `Error: ${response.message}`;
        }
      });
    } else {
      hintsContainer.innerHTML = 'Please navigate to a LeetCode problem page to get hints.';
    }
  });
});