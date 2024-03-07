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

function clearSelection(name) {
  var radioButtons = document.getElementsByName(name);
  radioButtons.forEach(function (radio) {
    radio.checked = false;
  });
}

function disabledFunctionality(){
  alert('This functionality is disabled right now.');
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
  $('#search-patient').on('click', function () {
    $.ajax({
      url: '/config.json', 
      type: 'GET',
      dataType: 'json',
      success: function (configData) {
        console.log('API URL:', configData.apiUrl);

        var requestData = {
          SearchParam: $('#searchParam').val(),
          Type: $('input[name="patient-type"]:checked').val() ?? null,
          Status: $('input[name="patient-status"]:checked').val() ?? null,
          FirstVisitStart: $('#first-visit-start').val() ?? null,
          FirstVisitEnd: $('#first-visit-end').val() ?? null,
          Size: 10,
          Page: 1,
          IsAscending: true,
          SortColumn: null
        };

        requestData = cleanObject(requestData);

        var queryString = $.param(requestData);
        
        $.ajax({
          url: configData.apiUrl + "?" + queryString,
          type: 'GET',
          dataType: 'json',
          success: function (apiResponse) {
            console.log('API Response:', apiResponse);
          },
          error: function (error) {
            console.error('Error:', error);
          }
        });
      },
      error: function (error) {
        console.error('Error:', error);
      }
    });
  });
});