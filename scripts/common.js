function cleanObject(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}

function createPaginationButton(
  text,
  pageNumber,
  isActive,
  isDisabled,
  container
) {
  var li = document.createElement("li");
  li.className = "page-item" + (isActive ? " active" : "");
  li.className += isDisabled ? " disabled" : "";

  var link = document.createElement("a");
  link.className = "page-link";
  link.href = "#";
  link.innerText = text;

  link.setAttribute("data-page", pageNumber);

  li.appendChild(link);
  container.appendChild(li);

  link.addEventListener("click", function () {
    var pageNumber = parseInt(link.getAttribute("data-page"));
    searchData(pageNumber);
  });
}
