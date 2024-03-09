document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const idParamValue = urlParams.get('id');

  $.ajax({
    url: "/config.json",
    type: "GET",
    dataType: "json",
    success: function (configData) {
      console.log("API URL:", configData.apiUrl);
  
      var endpoint = 'GetPatientById';
  
      var requestData = {
        patientId: idParamValue
      };
  
      requestData = cleanObject(requestData);
  
      var queryString = $.param(requestData);
  
      $.ajax({
        url: configData.apiUrl + '/' + endpoint + "?" + queryString,
        type: "GET",
        dataType: "json",
        success: function (response) {
          console.log("API Response:", response);
  
          if(response === undefined || response === null) {
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
            if(response.status === 'Active') {
              status.style.color = 'green';
            } else if (response.status === 'Closed') {
              status.style.color = 'red';
            } else  {
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
            document.getElementById("patientTypeEdit").value = response.type;
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
          alert("There was an error in retrieving search results.");
        },
      });
    },
    error: function (error) {
      alert("Error retrieving configuration.");
    },
  });
});

function PatientEditMode() {

}