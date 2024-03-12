fetch('./files/partials/header.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('header-container').innerHTML = html;
  })
  .catch(error => console.error('Error fetching partial HTML:', error));