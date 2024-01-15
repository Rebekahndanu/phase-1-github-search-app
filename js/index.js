document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const toggleButton = document.getElementById('toggle-search-type');
  
    // Event listener for form submission
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      const searchType = getUserRepoSearchType();
  
      // Decide whether to search for users or repositories based on searchType
      if (searchType === 'user') {
        searchUsers(searchTerm);
      } else {
        searchRepos(searchTerm);
      }
    });
  
    // Event listener for toggle button click
    toggleButton.addEventListener('click', function () {
      const currentType = getUserRepoSearchType();
      
      // Toggle the search type between 'user' and 'repo'
      setSearchType(currentType === 'user' ? 'repo' : 'user');
  
      // Re-run the search with the new search type
      const searchTerm = searchInput.value.trim();
      if (currentType === 'user') {
        searchRepos(searchTerm);
      } else {
        searchUsers(searchTerm);
      }
    });
  
    // Event listener for user list click
    userList.addEventListener('click', function (e) {
      if (e.target.tagName === 'LI') {
        const username = e.target.dataset.username;
        getUserRepos(username);
      }
    });
  
    // Function to get the current search type from sessionStorage
    function getUserRepoSearchType() {
      return sessionStorage.getItem('searchType') || 'user';
    }
  
    // Function to set the search type in sessionStorage
    function setSearchType(type) {
      sessionStorage.setItem('searchType', type);
    }
  
    // Function to search for users
    function searchUsers(query) {
      const url = `https://api.github.com/search/users?q=${query}`;
      fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          displayUsers(data.items);
        })
        .catch(error => console.error('Error searching users:', error));
    }
  
    // Function to display user search results
    function displayUsers(users) {
      userList.innerHTML = '';
      users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<img src='${user.avatar_url}' alt='Avatar'>
                              <a href='${user.html_url}' target='_blank'>${user.login}</a>`;
        listItem.dataset.username = user.login;
        userList.appendChild(listItem);
      });
    }
  
    // Function to search for repositories
    function searchRepos(query) {
      const url = `https://api.github.com/search/repositories?q=${query}`;
      fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          displayRepos(data.items);
        })
        .catch(error => console.error('Error searching repos:', error));
    }
  
    // Function to display repo search results
    function displayRepos(repos) {
      reposList.innerHTML = '';
      repos.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href='${repo.html_url}' target='_blank'>${repo.full_name}</a>`;
        reposList.appendChild(listItem);
      });
    }
  
    // Function to get user repositories
    function getUserRepos(username) {
      const url = `https://api.github.com/users/${username}/repos`;
      fetch(url, {
        headers: {
            
            'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => {
          displayRepos(data);
        })
        .catch(error => console.error('Error getting user repos:', error));
    }
});
  