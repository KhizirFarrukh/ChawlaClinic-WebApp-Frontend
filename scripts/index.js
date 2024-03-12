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

function searchData(pageNumber, ScrollToTable) {
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

      var endpoint = "SearchPatient";

      var requestData = {
        SearchParam: $("#searchParam").val(),
        Type: $('input[name="patient-type"]:checked').val() ?? null,
        Status: $('input[name="patient-status"]:checked').val() ?? null,
        FirstVisitStart: $("#first-visit-start").val() ?? null,
        FirstVisitEnd: $("#first-visit-end").val() ?? null,
        Size: $("#searchResultSize").val(),
        Page: pageNumber,
        IsAscending: true,
        SortColumn: $("#searchSortByField").val(),
      };

      requestData = cleanObject(requestData);

      var queryString = $.param(requestData);

      $.ajax({
        url: configData.apiUrl + "/" + endpoint + "?" + queryString,
        type: "GET",
        dataType: "json",
        success: function (response) {
          console.log("API Response:", response);

          if (response.items.length > 0) {
            document
              .getElementById("searchResultNotFound")
              .classList.add("d-none");
            var table = document.getElementById("searchResultTable");

            table.classList.remove("d-none");

            var tableBody = document.getElementById("searchResultTableBody");

            while (tableBody.firstChild) {
              tableBody.removeChild(tableBody.firstChild);
            }

            for (let i = 0; i < response.items.length; i++) {
              var row = tableBody.insertRow(i);

              var cellNumber = row.insertCell(0);
              var cellCaseNo = row.insertCell(1);
              var cellPatientName = row.insertCell(2);
              var cellGuardianName = row.insertCell(3);
              var cellPhoneNumber = row.insertCell(4);
              var cellDate = row.insertCell(5);
              var cellStatus = row.insertCell(6);
              var cellActions = row.insertCell(7);

              cellNumber.innerHTML = i + 1;
              cellCaseNo.innerHTML = response.items[i].caseNo;
              cellPatientName.innerHTML = response.items[i].name;
              cellGuardianName.innerHTML = response.items[i].guardianName;
              cellPhoneNumber.innerHTML = response.items[i].phoneNumber;
              cellDate.innerHTML = new Date(
                response.items[i].firstVisit
              ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              });
              cellStatus.innerHTML = response.items[i].status;

              var selectLink = document.createElement("a");
              selectLink.href =
                "patient.html?id=" + response.items[i].patientId;
              selectLink.className = "btn btn-primary";
              selectLink.innerHTML = "Select";

              cellActions.appendChild(selectLink);
            }

            var currentPage = response.pageNumber;
            var maxPagesToShow = 2;
            var totalPages = response.totalPages;

            var paginationContainer = document.getElementById(
              "searchPaginationContainer"
            );
            paginationContainer.parentNode.classList.remove("d-none");
            paginationContainer.innerHTML = "";

            var startPage = Math.max(1, currentPage - maxPagesToShow);
            var endPage = Math.min(totalPages, currentPage + maxPagesToShow);

            createPaginationButton(
              "Previous",
              currentPage > 1 ? currentPage - 1 : 1,
              false,
              currentPage === 1,
              paginationContainer,
              searchData
            );

            for (var i = startPage; i <= endPage; i++) {
              createPaginationButton(
                i,
                i,
                i === currentPage,
                false,
                paginationContainer,
                searchData
              );
            }

            createPaginationButton(
              "Next",
              currentPage < totalPages ? currentPage + 1 : totalPages,
              false,
              currentPage === totalPages,
              paginationContainer,
              searchData
            );

            var countBeforeCurrentPage = (currentPage - 1) * response.pageSize;

            document.getElementById("searchResultRangeText").innerText =
              countBeforeCurrentPage +
              1 +
              "-" +
              (countBeforeCurrentPage + response.items.length);
            document.getElementById("searchResultCountText").innerText =
              response.totalCount;
            if (ScrollToTable) {
              table.scrollIntoView({ behavior: "smooth" });
            }
          } else {
            document
              .getElementById("searchResultTable")
              .classList.add("d-none");
            document
              .getElementById("searchPaginationContainer")
              .parentNode.classList.add("d-none");
            document
              .getElementById("searchResultNotFound")
              .classList.remove("d-none");
          }

          $("#search-patient").prop("disabled", false).append("Search");
          $("#search-loading").addClass("d-none");
        },
        error: function (xhr, status, error) {
          $("#search-patient").prop("disabled", false).append("Search");
          $("#search-loading").addClass("d-none");

          alert("There was an error in retrieving search results.");
        },
      });
    },
    error: function (error) {
      alert("Error retrieving configuration.");
      $("#search-patient").prop("disabled", false).append("Search");
      $("#search-loading").addClass("d-none");
    },
  });
}

$(document).ready(function () {
  $("#search-patient").on("click", function () {
    searchData(1, true);
  });
  document
    .getElementById("AddPatientForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      document.getElementById("AddPatientButton").classList.add("d-none");
      document.getElementById("AddPatientLoading").classList.remove("d-none");

      var formData = new FormData(event.target);
      $.ajax({
        url: "/config.json",
        type: "GET",
        dataType: "json",
        success: function (configData) {
          fetch(configData.apiUrl + "/AddPatient", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Object.fromEntries(formData)),
          })
            .then((response) => response.json())
            .then((data) => {
              window.location.href = '/pages/patient.html?id=' + data;
              document.getElementById("AddPatientLoading").classList.add('d-none');
              document.getElementById("AddPatientButton").classList.remove('d-none');
              console.log(data);
            })
            .catch((error) => {
              alert("There was an error in adding patient.");
              document.getElementById("AddPatientLoading").classList.add('d-none');
              document.getElementById("AddPatientButton").classList.remove('d-none');
              console.error("Error:", error);
            });
        },
        error: function (error) {
          alert("Error retrieving configuration.");
        },
      });
    });
});
