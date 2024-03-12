document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const idParamValue = urlParams.get('id');

  $.ajax({
    url: "../config.json",
    type: "GET",
    dataType: "json",
    success: function (configData) {
      GetPatientData(idParamValue, configData);
      GetPayments(1, false);

      var paymentHistorySize = document.getElementById('paymentHistorySize');

      paymentHistorySize.addEventListener('change', function () {
        GetPayments(1, true);
      });
    },
    error: function (error) {
      alert("Error retrieving configuration.");
    },
  });
});

function GetPatientData(PatientId, ConfigData) {
  var endpoint = 'GetPatientById';

  var requestData = {
    patientId: PatientId
  };

  requestData = cleanObject(requestData);

  var queryString = $.param(requestData);

  console.log("Request URL:", ConfigData.apiUrl + '/' + endpoint + "?" + queryString);

  $.ajax({
    url: ConfigData.apiUrl + '/' + endpoint + "?" + queryString,
    type: "GET",
    dataType: "json",
    success: function (response) {
      console.log("Patient API Response:", response);

      if (response === undefined || response === null) {
        document.getElementById("patientNotFound").classList.remove('d-none');
      } else {
        document.getElementById("patientName").innerText = response.name;
        document.getElementById("age").innerText = response.ageYears + ' years, ' + response.ageMonths + ' months';
        document.getElementById("gender").innerText = response.gender === 'M' ? 'Male' : 'Female';
        document.getElementById("guardianName").innerText = response.guardianName;
        document.getElementById("patientType").innerText = response.type === 'B' ? 'Burns' : 'General';
        document.getElementById("disease").innerText = response.disease;
        document.getElementById("address").innerText = response.address;
        document.getElementById("caseNo").innerText = response.caseNo;
        var status = document.getElementById("status");
        status.innerText = response.status;
        if (response.status === 'Active') {
          status.style.color = 'green';
        } else if (response.status === 'Closed') {
          status.style.color = 'red';
        } else {
          status.style.color = 'black';
        }
        document.getElementById("phoneNumber").innerText = response.phoneNumber;
        document.getElementById("firstVisit").innerText = new Date(
          response.firstVisit
        ).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
        document.getElementById("discountMode").innerText = response.discount.title;
        document.getElementById("descriptionReadOnly").value = response.description;

        document.getElementById("patientNameEdit").value = response.name;
        document.getElementById("ageYearsEdit").value = response.ageYears;
        document.getElementById("ageMonthsEdit").value = response.ageMonths;
        document.getElementById("genderEdit").value = response.gender;
        document.getElementById("guardianNameEdit").value = response.guardianName;
        document.getElementById("patientTypeEdit").innerText = response.type === 'B' ? ' (Burns)' : ' (General)';
        document.getElementById("diseaseEdit").value = response.disease;
        document.getElementById("addressEdit").value = response.address;
        document.getElementById("caseNoEdit").innerText = response.caseNo;
        document.getElementById("statusEdit").value = response.status;
        document.getElementById("phoneNumberEdit").value = response.phoneNumber;
        document.getElementById("firstVisitEdit").value = response.firstVisit.split('T')[0];
        document.getElementById("discountModeEdit").value = response.discount.discountId;
        document.getElementById("descriptionEdit").value = response.description;

        document.getElementById("patientData").classList.remove('d-none');

      }

      document.getElementById("patientPageLoading").classList.add('d-none');
    },
    error: function (xhr, status, error) {
      alert("There was an error in retrieving patient record.");
      document.getElementById("patientPageLoading").classList.add('d-none');
      document.getElementById("patientLoadingFailed").classList.remove('d-none');
    },
  });
}

function PatientEditMode() {
  document.getElementById("viewPatientContainer").classList.add('d-none');
  document.getElementById("editPatientContainer").classList.remove('d-none');
}

function SavePatientRecord() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParamValue = urlParams.get('id');

  $.ajax({
    url: "../config.json",
    type: "GET",
    dataType: "json",
    success: function (configData) {
      var endpoint = 'UpdatePatient';

      var requestBody = {
        patientId: idParamValue,
        name: $("#patientNameEdit").val(),
        description: $("#descriptionEdit").val(),
        guardianName: $("#guardianNameEdit").val(),
        ageYears: $("#ageYearsEdit").val(),
        ageMonths: $("#ageMonthsEdit").val(),
        gender: $("#genderEdit").val(),
        disease: $("#diseaseEdit").val(),
        address: $("#addressEdit").val(),
        phoneNumber: $("#phoneNumberEdit").val(),
        status: $("#statusEdit").val(),
        firstVisit: $("#firstVisitEdit").val(),
        discountId: $("#discountModeEdit").val(),
      };

      requestBody = cleanObject(requestBody);

      console.log("Request URL:", configData.apiUrl + '/' + endpoint);

      $.ajax({
        url: configData.apiUrl + '/' + endpoint,
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
        success: function (response) {
          console.log("Patient Update API Response:", response);
          window.location.reload();
        },
        error: function (xhr, status, error) {
          alert("There was an error in updating patient.");
        },
      });
    },
    error: function (error) {
      alert("Error retrieving configuration.");
    },
  });
}

function AddPayment() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParamValue = urlParams.get('id');

  $.ajax({
    url: "../config.json",
    type: "GET",
    dataType: "json",
    success: function (configData) {
      var endpoint = 'AddPayment';

      var requestBody = {
        patientId: idParamValue,
        amountPaid: $("#paymentAmount").val(),
        dateTime: $("#paymentDate").val(),
        printReceipt: document.getElementById("printPaymentReceipt").checked
      };

      requestBody = cleanObject(requestBody);

      console.log("Request URL:", configData.apiUrl + '/' + endpoint);

      $.ajax({
        url: configData.apiUrl + '/' + endpoint,
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
        success: function (response) {
          console.log("Add Payment API Response:", response);
          window.location.reload();
        },
        error: function (xhr, status, error) {
          alert("There was an error in adding payment.");
        },
      });
    },
    error: function (error) {
      alert("Error retrieving configuration.");
    },
  });
}

function GetPayments(PageNumber, ScrollToTable) {
  const urlParams = new URLSearchParams(window.location.search);
  const idParamValue = urlParams.get('id');

  $.ajax({
    url: "../config.json",
    type: "GET",
    dataType: "json",
    success: function (configData) {
      var getPaymentEndpoint = "GetPaymentsByPatientId";

      var requestData = {
        PatientId: idParamValue,
        Size: $('#paymentHistorySize').val(),
        Page: PageNumber,
        IsAscending: false,
        SortColumn: "DateTime",
      };
console.log(requestData)
      requestData = cleanObject(requestData);

      var getPaymentQueryString = $.param(requestData);

      $.ajax({
        url: configData.apiUrl + '/' + getPaymentEndpoint + "?" + getPaymentQueryString,
        type: "GET",
        dataType: "json",
        success: function (response) {
          console.log("Payment API Response:", response);

          if (response === undefined || response === null || response.totalCount === 0) {
            document.getElementById("paymentRecordsNotFound").classList.remove('d-none');
          } else {
            var paymentTableBody = document.getElementById("paymentHistoryBody");

            paymentTableBody.innerHTML = "";

            for (let i = 0; i < response.items.length; i++) {
              var row = paymentTableBody.insertRow(i);

              var cellNumber = row.insertCell(0);
              var cellDate = row.insertCell(1);
              var cellPaymentAmount = row.insertCell(2);
              // var cellDeletePayment = row.insertCell(3);

              cellNumber.innerHTML = i + 1;
              cellDate.innerHTML = new Date(
                response.items[i].dateTime
              ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              });
              cellPaymentAmount.innerHTML = response.items[i].amountPaid;
              // cellDeletePayment.innerHTML = response.items[i].paymentId;

            }

            var currentPage = response.pageNumber;
            var maxPagesToShow = 2;
            var totalPages = response.totalPages;

            var paginationContainer = document.getElementById(
              "paymentPaginationContainer"
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
              GetPayments
            );

            for (var i = startPage; i <= endPage; i++) {
              createPaginationButton(
                i,
                i,
                i === currentPage,
                false,
                paginationContainer,
                GetPayments
              );
            }

            createPaginationButton(
              "Next",
              currentPage < totalPages ? currentPage + 1 : totalPages,
              false,
              currentPage === totalPages,
              paginationContainer,
              GetPayments
            );

            var countBeforeCurrentPage = (currentPage - 1) * response.pageSize;

            document.getElementById("paymentHistoryRangeText").innerText =
              countBeforeCurrentPage +
              1 +
              "-" +
              (countBeforeCurrentPage + response.items.length);
            document.getElementById("paymentHistoryCountText").innerText =
              response.totalCount;

            document.getElementById("paymentHistory").classList.remove('d-none');
            if (ScrollToTable) {
              document.getElementById("paymentHistoryTable").scrollIntoView(true);
            }

          }

          document.getElementById("patientPageLoading").classList.add('d-none');
        },
        error: function (xhr, status, error) {
          alert("There was an error in retrieving payment records.");
        },
      });
    },
    error: function (error) {
      alert("Error retrieving configuration.");
    },
  });
}