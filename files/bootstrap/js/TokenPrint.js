//WebSocket settings
// JSPM.JSPrintManager.auto_reconnect = true;
// JSPM.JSPrintManager.start();


// JSPM.JSPrintManager.WS.onStatusChanged = function () {
//     if (jspmWSStatus()) {
//         //get client installed printers
//         JSPM.JSPrintManager.getPrinters().then(function (myPrinters) {
//             var options = '';
//             for (var i = 0; i < myPrinters.length; i++) {
//                 options += '<option>' + myPrinters[i] + '</option>';
//             }
//             $('#installedPrinterName').html(options);
//         });
//     }
// };

//Check JSPM WebSocket status
// function jspmWSStatus() {
//   if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open)
//     return true;
//   else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Closed) {
//     alert('JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm');
//     return false;
//   }
//   else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Blocked) {
//     alert('JSPM has blocked this website!');
//     return false;
//   }
// }
//Do printing...
function print(o) {
  // if (jspmWSStatus()) {
  var PatientName = document.getElementById("PatientNameInput").value;
  var PatientType = document.getElementById("PatientTypeSelect").value;
  var TokenNumber = undefined;
  var validEntry = true;
  if (PatientName == "") {
    validEntry = false;
    alert("Name cannot be empty");
  }
  if (!(/^[A-Za-z\s]*$/.test(PatientName))) {
    validEntry = false;
    alert("Name can only contain alphabets and spaces");
  }
  if (PatientType != "Male" && PatientType != "Female" && PatientType != "Child") {
    validEntry = false;
    alert("Please select valid patient type");
  } else {
    TokenNumber = document.getElementById(PatientType + "TokenCount").value;
    if(/^\d+$/.test(TokenNumber)) {
      TokenNumber = parseInt(TokenNumber);
    } else {
      validEntry = false;
    }
  }
  if(TokenNumber == undefined || typeof TokenNumber != 'number' || isNaN(TokenNumber)) {
    validEntry = false;
  }
  console.log(validEntry);
  if (validEntry) {
    document.getElementById("PatientNameInput").value = "";
    document.getElementById("PatientTypeSelect").value = "Select Type";
    var currentDateTime = new Date();
    console.log(currentDateTime);
    var currentDate=String(currentDateTime.getDate()).padStart(2, '0') + "-" + String(currentDateTime.getMonth() + 1).padStart(2, '0') + "-" + currentDateTime.getFullYear(); 
    console.log(currentDate);
    var currentHour = currentDateTime.getHours();
    var currentTime;
    if(currentHour < 12) {
      if(currentHour == 0) {
        currentHour = 12;
      }
      currentTime = String(currentHour).padStart(2, '0') + ":" + String(currentDateTime.getMinutes()).padStart(2, '0') + " AM";
    } else {
      currentHour -= 12;
      if(currentHour == 0) {
        currentHour = 12;
      }
      currentTime = String(currentHour).padStart(2, '0') + ":" + String(currentDateTime.getMinutes()).padStart(2, '0') + " PM";
    }
    console.log(currentTime);
    //Create a ClientPrintJob
    // var cpj = new JSPM.ClientPrintJob();
    // //Set Printer type (Refer to the help, there many of them!)
    // cpj.clientPrinter = new JSPM.InstalledPrinter("BCPrinter");
    // console.log(cpj.clientPrinter._name);
    //Set content to print...
    //Create ESP/POS commands for sample label
    var esc = '\x1B'; //ESC byte in hex notation
    var gs = '\x1D'
    var newLine = '\x0A'; //LF byte in hex notation

    var cmds = esc + "@"; //Initializes the printer (ESC @)
    cmds += esc + '!' + '\x38'; //Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
    cmds += '      CHAWLA CLINIC'; //text to print
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
    cmds += '            ' + currentDate + '          ' + currentTime + '          ';
    cmds += newLine + newLine;
    cmds += '------------------------------------------------';
    cmds += newLine + newLine;
    cmds += esc + '!' + '\x38';
    cmds += PatientType.toUpperCase() + ' TOKEN NUMBER';
    cmds += esc + '!' + '\x00';
    cmds += newLine;
    cmds += '------------------------------------------------';
    cmds += newLine;
    cmds += esc + '!' + '\x38';
    cmds += '                 ' + TokenNumber;
    cmds += esc + '!' + '\x00'; //Character font A selected (ESC ! 0)
    cmds += newLine + newLine + newLine + newLine + newLine + newLine + newLine;
    cmds += gs + 'V' + '\x30';
    // cpj.printerCommands = cmds;
    console.log(cmds);
    //Send print job to printer!
    // cpj.sendToClient();

    const form = document.createElement('form');
    form.method = 'post';
    var params = {Name: PatientName,
                  Type: PatientType,
                  TokenDateTime: currentDateTime};
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", "/token-generation", true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify({
    //     Name: PatientName,
    //     Type: PatientType,
    //     TokenDateTime: currentDateTime
    // }));
  }
}
function resetdata() {
  document.getElementById("resetdata").remove();
  const form = document.createElement('form');
  form.method = 'post';
  var params = {ResetTokenData:'true'};
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];
      form.appendChild(hiddenField);
    }
  }
  document.body.appendChild(form);
  form.submit();
}