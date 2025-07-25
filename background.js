chrome.runtime.onInstalled.addListener(() => {
  console.log('LeetCode Hint Extension installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getHint") {
    console.log("Received a request for a hint for URL:", request.problemUrl);
    
    fetch('http://localhost:3000/api/getHint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ problemUrl: request.problemUrl }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Hint received from server:', data);
      sendResponse({ status: "success", hint: data.hint });
    })
    .catch(error => {
      console.error('Error fetching hint:', error);
      sendResponse({ status: "error", message: error.toString() });
    });

    // Return true to indicate you will send a response asynchronously
    return true; 
  }
});