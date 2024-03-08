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
  
          if(response === undefined) {
            alert("There was an error in retrieving search results.");
          } else {
            
          }
  
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
