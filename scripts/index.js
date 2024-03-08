function disableCaseNoInput() {
  if (document.getElementById("caseno").disabled) {
    document.getElementById("caseno").disabled = false;
    document.getElementById("caseno").value = "";
    document.getElementById("caseno").placeholder = "1234";
  } else {
    document.getElementById("caseno").disabled = true;
    document.getElementById("caseno").value = "";
    document.getElementById("caseno").placeholder = "23B-012345";
  }
}

function clearSelection(name) {
  var radioButtons = document.getElementsByName(name);
  radioButtons.forEach(function (radio) {
    radio.checked = false;
  });
}

function disabledFunctionality() {
  alert("This functionality is disabled right now.");
}

function cleanObject(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}

function createPaginationButton(text, pageNumber, isActive, isDisabled, container) {
  var li = document.createElement('li');
  li.className = 'page-item' + (isActive ? ' active' : '');
  li.className += isDisabled ? ' disabled' : '';

  var link = document.createElement('a');
  link.className = 'page-link';
  link.href = '#';
  link.innerText = text;

  link.setAttribute('data-page', pageNumber);

  li.appendChild(link);
  container.appendChild(li);

  link.addEventListener('click', function () {
    var clickedPage = parseInt(link.getAttribute('data-page'));
    console.log('Clicked page:', clickedPage);
  });
}

$(document).ready(function () {
  $("#search-patient").on("click", function () {
    $("#search-patient")
      .prop("disabled", true)
      .contents()
      .filter(function () {
        return this.nodeType === 3;
      })
      .remove();

    $("#search-loading").removeClass("d-none");

    $.ajax({
      url: "/config.json",
      type: "GET",
      dataType: "json",
      success: function (configData) {
        console.log("API URL:", configData.apiUrl);

        var requestData = {
          SearchParam: $("#searchParam").val(),
          Type: $('input[name="patient-type"]:checked').val() ?? null,
          Status: $('input[name="patient-status"]:checked').val() ?? null,
          FirstVisitStart: $("#first-visit-start").val() ?? null,
          FirstVisitEnd: $("#first-visit-end").val() ?? null,
          Size: 10,
          Page: 1,
          IsAscending: true,
          SortColumn: null,
        };

        requestData = cleanObject(requestData);

        var queryString = $.param(requestData);

        $.ajax({
          url: configData.apiUrl + "?" + queryString,
          type: "GET",
          dataType: "json",
          success: function (response) {
            console.log("API Response:", response);

            if(response.items.length > 0) {
              document.getElementById("searchResultNotFound").classList.add('d-none');
              document.getElementById("searchResultTable").classList.remove('d-none');
  
              var tableBody = document.getElementById("searchResultTableBody");
  
              while (tableBody.firstChild) {
                tableBody.removeChild(tableBody.firstChild);
              }
  
              for (let i = 0; i < response.items.length; i++) {
                var row = tableBody.insertRow(i);
  
                var cellNumber = row.insertCell(0);
                var cellCaseNo = row.insertCell(1);
                var cellPatientName = row.insertCell(2);
                var cellPhoneNumber = row.insertCell(3);
                var cellDate = row.insertCell(4);
                var cellStatus = row.insertCell(5);
                var cellActions = row.insertCell(6);
  
                cellNumber.innerHTML = i + 1;
                cellCaseNo.innerHTML = response.items[i].caseNo;
                cellPatientName.innerHTML = response.items[i].name;
                cellPhoneNumber.innerHTML = response.items[i].phoneNumber;
                cellDate.innerHTML = new Date(response.items[i].firstVisit).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric'
                });
                cellStatus.innerHTML = response.items[i].status;
  
                var selectLink = document.createElement('a');
                selectLink.href = 'patient.html?id=' + response.items[i].patientId;
                selectLink.className = 'btn btn-primary';
                selectLink.innerHTML = 'Select';
  
                cellActions.appendChild(selectLink);
              }
  
              var currentPage = response.pageNumber;
              var maxPagesToShow = 2;
              var totalPages = response.totalPages;
  
              var paginationContainer = document.getElementById("searchPaginationContainer");
              paginationContainer.parentNode.classList.remove('d-none');
              paginationContainer.innerHTML = '';
  
              var startPage = Math.max(1, currentPage - maxPagesToShow);
              var endPage = Math.min(totalPages, currentPage + maxPagesToShow);
  
              createPaginationButton('Previous', currentPage > 1 ? currentPage - 1 : 1, false, currentPage === 1, paginationContainer);
  
              for (var i = startPage; i <= endPage; i++) {
                createPaginationButton(i, i, i === currentPage, false, paginationContainer);
              }
  
              createPaginationButton('Next', currentPage < totalPages ? currentPage + 1 : totalPages, false, currentPage === totalPages, paginationContainer);

              var countBeforeCurrentPage = (currentPage - 1) * response.pageSize;

              document.getElementById("searchResultRangeText").innerText = (countBeforeCurrentPage + 1) + '-' + (countBeforeCurrentPage + response.items.length);
              document.getElementById("searchResultCountText").innerText = response.totalCount;

            } else {
              document.getElementById("searchResultTable").classList.add('d-none');
              document.getElementById("searchPaginationContainer").parentNode.classList.add('d-none');
              document.getElementById("searchResultNotFound").classList.remove('d-none');
            }

            $("#search-patient").prop("disabled", false).append("Search");
            $("#search-loading").addClass("d-none");
          },
          error: function (xhr, status, error) {
            $("#search-patient").prop("disabled", false).append("Search");
            $("#search-loading").addClass("d-none");

            alert("There was an error in retrieving search results.");
          }
        });

      },
      error: function (error) {
        alert("Error retrieving configuration.");
        $("#search-patient").prop("disabled", false).append("Search");
        $("#search-loading").addClass("d-none");
      },
    });
  });
});
