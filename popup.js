document.getElementById('fetchTitle').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    let title = activeTab.title;
    document.getElementById('title').innerText = `Title: ${title}`;
    addTitleToList(title);
  });
});

function addTitleToList(title) {
  chrome.storage.local.get({ titles: [] }, (result) => {
    let titles = result.titles;
    titles.push(title);
    chrome.storage.local.set({ titles }, () => {
      displayTitles(titles);
    });
  });
}

function displayTitles(titles) {
  const titleList = document.getElementById('titleList');
  titleList.innerHTML = '';
  titles.forEach((title, index) => {
    const titleItem = document.createElement('div');
    titleItem.className = 'title-item';
    titleItem.innerHTML = `<span>${title}</span> <button data-index="${index}" class="delete-button">Delete</button>`;
    titleList.appendChild(titleItem);
  });

  // Attach event listeners to delete buttons after they are added to the DOM
  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', () => {
      let index = button.getAttribute('data-index');
      removeTitle(index);
    });
  });
}

function removeTitle(index) {
  chrome.storage.local.get({ titles: [] }, (result) => {
    let titles = result.titles;
    titles.splice(index, 1);
    chrome.storage.local.set({ titles }, () => {
      displayTitles(titles);
    });
  });
}

// Load and display titles on popup open
chrome.storage.local.get({ titles: [] }, (result) => {
  displayTitles(result.titles);
});
