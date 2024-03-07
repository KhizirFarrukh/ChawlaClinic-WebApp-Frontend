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

            var table = document.getElementById("searchResultTable");
            table.classList.remove('d-none');

            var tableBody = document.getElementById("searchResultTableBody");
            
            for(let i = 0; i < response.length; i++) {
              var row = tableBody.insertRow(i);

              var cellNumber = row.insertCell(0);
              var cellCaseNo = row.insertCell(1);
              var cellPatientName = row.insertCell(2);
              var cellPhoneNumber = row.insertCell(3);
              var cellDate = row.insertCell(4);
              var cellStatus = row.insertCell(5);
              var cellActions = row.insertCell(6);

              cellNumber.innerHTML = i + 1;
              cellCaseNo.innerHTML = response[i].caseNo;
              cellPatientName.innerHTML = response[i].name;
              cellPhoneNumber.innerHTML = response[i].phoneNumber;
              cellDate.innerHTML = new Date(response[i].firstVisit).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
              });
              cellStatus.innerHTML = response[i].status;

              var selectLink = document.createElement('a');
              selectLink.href = 'patient.html?id=' + response[i].patientId;
              selectLink.className = 'btn btn-primary';
              selectLink.innerHTML = 'Select';

              cellActions.appendChild(selectLink);
            }
            
            $("#search-patient").prop("disabled", false).append("Search");
            $("#search-loading").addClass("d-none");
          },
          error: function (error) {
            console.error("Error:", error);
            $("#search-patient").prop("disabled", false).append("Search");
            $("#search-loading").addClass("d-none");
          },
        });

      },
      error: function (error) {
        console.error("Error:", error);

        $("#search-patient").prop("disabled", false).append("Search");
        $("#search-loading").addClass("d-none");
      },
    });
  });
});
