document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const idParamValue = urlParams.get('id');

  $.ajax({
    url: "/config.json",
    type: "GET",
    dataType: "json",
    success: function (configData) {
      var endpoint = 'GetPatientById';

      var requestData = {
        patientId: idParamValue
      };

      requestData = cleanObject(requestData);

      var queryString = $.param(requestData);

      console.log("Request URL:", configData.apiUrl + '/' + endpoint + "?" + queryString);

      $.ajax({
        url: configData.apiUrl + '/' + endpoint + "?" + queryString,
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

            var getPaymentEndpoint = "GetPaymentsByPatientId";

            var requestData = {
              PatientId: idParamValue,
              Size: 10,
              Page: 1,
              IsAscending: false,
              SortColumn: "DateTime",
            };

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
                  document.getElementById("paymentHistory").classList.remove('d-none');
                }

                document.getElementById("patientPageLoading").classList.add('d-none');
              },
              error: function (xhr, status, error) {
                alert("There was an error in retrieving payment records.");
              },
            });
          }

          document.getElementById("patientPageLoading").classList.add('d-none');
        },
        error: function (xhr, status, error) {
          alert("There was an error in retrieving patient record.");
          document.getElementById("patientPageLoading").classList.add('d-none');
          document.getElementById("patientLoadingFailed").classList.remove('d-none');
        },
      });
    },
    error: function (error) {
      alert("Error retrieving configuration.");
    },
  });
});

function PatientEditMode() {
  document.getElementById("viewPatientContainer").classList.add('d-none');
  document.getElementById("editPatientContainer").classList.remove('d-none');
}

function SavePatientRecord() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParamValue = urlParams.get('id');

  $.ajax({
    url: "/config.json",
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