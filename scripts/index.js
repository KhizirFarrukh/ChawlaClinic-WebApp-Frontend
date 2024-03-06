function disableCaseNoInput() {
  if (document.getElementById('caseno').disabled) {
    document.getElementById('caseno').disabled = false;
    document.getElementById('caseno').value = "";
    document.getElementById('caseno').placeholder= "1234";
  } else {
    document.getElementById('caseno').disabled = true;
    document.getElementById('caseno').value = "";
    document.getElementById('caseno').placeholder = "23B-012345";
  }
}