$(document).ready(function() {

    $("#telephone").mask("00 00 00 00 00");
    RecupererContact();

});

$(document)
.ajaxStart(function(){
    //$("#ajaxSpinnerImage").show();
    $("div#divLoading").addClass('show');
})

.ajaxStop(function(){
    //$("#ajaxSpinnerImage").hide();
    $("div#divLoading").removeClass('show');
});

function showalert(message, alerttype) {

    $('#alert_placeholder').append('<div id="alertdiv" class="alert ' + 
		alerttype + ' input-sm"><span>' + message + '</span></div>')

    setTimeout(function() {

      $("#alertdiv").remove();

    }, 2500);
}


$("#telephone").intlTelInput({

    // whether or not to allow the dropdown
    allowDropdown: true,
    // if there is just a dial code in the input: remove it on blur, and re-add it on focus
    autoHideDialCode: false,
    // add a placeholder in the input with an example number for the selected country
    autoPlaceholder: "polite",
    // modify the auto placeholder
    customPlaceholder: null,
    // append menu to a specific element
    dropdownContainer: "",
    // don't display these countries
    excludeCountries: [],
    // format the input value during initialisation
    formatOnDisplay: true,
    // geoIp lookup function
    geoIpLookup: null,
    // initial country
    initialCountry: "fr",
    // don't insert international dial codes
    nationalMode: true,
    // number type to use for placeholders
    placeholderNumberType: "MOBILE",
    // display only these countries
    onlyCountries: [],
    // the countries at the top of the list. defaults to united states and united kingdom
    preferredCountries: [ "fr", "be", "de", "gb", "es", "ch", "it", "lu", "ad", "mc"],
    // display the country dial code next to the selected flag so it's not part of the typed number
    separateDialCode: false,
    // specify the path to the libphonenumber script to enable validation/formatting
    utilsScript: "js/utils.js"

});

// !!!!!!!!!!!! MANDATORY TO DISPLAY DATA IN TABLE !!!!!!!!!!!!!!
$('#contacts').bootstrapTable({});

function SupprimerContact(){

    selections = $('#contacts').bootstrapTable('getSelections');
    console.log("selections=" + selections);
    if (selections == "") {
        showalert("Aucun contact selectionné.", "alert-warning");
        return;
    }

    var contacts = new Object();
    contacts._ids = [];

    $.each(selections, function(k, v){
        //var _id = v.prenom + "." + v.nom;
        contacts._ids.push(v.prenom + "." + v.nom);
        
    });    

    console.log("contacts=" + contacts);
    console.log("contacts=" + JSON.stringify(contacts));

    $.ajax({
        type: 'POST',
        url: "SupprimerContact",
        dataType: 'json',
        data: JSON.stringify(contacts),

        success: function(data) {
            console.log(data);
            $('#contacts').bootstrapTable("load", data);
            showalert("Contact(s) supprimé(s) avec succès.", "alert-success");
          },
        error: function(data) {
            console.log(data);
            showalert("Erreur lors de la suppression de(s) contact(s).", "alert-danger");
        }        
        
    });    
}

function RecupererContact() {

    $.ajax({
        type: 'POST',
        url: "RecupererContact",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            $('#contacts').bootstrapTable("load", data);
          },
        error: function(data) {
            console.log(data);
            showalert("Erreur lors de la récupération de(s) contact(s).", "alert-danger");
        }        
        
    });
    
}

function EnvoyerContact(){

    console.log("!!!!" + $("#telephone").intlTelInput("getNumber"));

	if ($("#prenom").val() == "") {
		showalert("Saisir un prénom.", "alert-warning");
		return;
	}

	if ($("#nom").val() == "") {
		showalert("Saisir un nom.", "alert-warning");
		return;
	}

    if ($("#telephone").val() == "") {
        showalert("Saisir un téléphone.", "alert-warning");
        return;
    }

    var isValid = $("#telephone").intlTelInput("isValidNumber");

    if (isValid == false) {
        showalert("Téléphone non valide.", "alert-warning");
        return;
    }

	var contact = new Object();
    contact._id = $("#prenom").val() + "." + $("#nom").val();
    contact._rev = null;
	contact.prenom = $("#prenom").val();
	contact.nom = $("#nom").val();
	contact.societe = $("#societe").val();
	contact.email = $("#email").val();
	contact.telephone = $("#telephone").intlTelInput("getNumber");

	console.log("contact=" + contact);

	$.ajax({
        type: 'POST',
        url: "EnvoyerContact",
        dataType: 'json',
        data: JSON.stringify(contact),        

        success: function(data) {
            var conflict = false;
            console.log(data);
            $.each(data, function(k, v){
                console.log(v);
                if (v == "conflict"){
                    conflict = true;                    
                }
            });
            if (conflict == true) {
                showalert("Prénom.Nom dupliqué.", "alert-warning");
                return;
            }
            $('#contacts').bootstrapTable("load", data);
    	    showalert("Contact envoyé avec succès.", "alert-success");
        },
        error: function(data) {
            console.error(data);
            showalert("Erreur lors de l'envoi du contact.", "alert-danger");
        }        
        
	});

}


function Reset() {
	
	var success = "OK";
	
	$.ajax({
        type: 'POST',
        url: "Logout",
        dataType: 'json',

        success: function(data) {
			success = "OK";
        },
        error: function(data) {
            console.log(data);
   			success = "KO";
        }        
        
    });	

	if (success == "KO") {
		showalert("Reset() failed.", "alert-danger");
	}

	location.reload(true);
	
}

/**
 * 
 */

function UploadCSVFile(){
    
    console.log("submit event");
    var fd = new FormData(document.getElementById("fileinfo"));
    $.ajax({
      url: "UploadCSVFile",
      type: "POST",
      data: fd,
      enctype: 'multipart/form-data',
      dataType: 'json',
      processData: false,  // tell jQuery not to process the data
      contentType: false   // tell jQuery not to set contentType
    }).done(function( data ) {
        contacts = data;
        console.log(contacts);
        $("#historique tr").remove();
        $("#historique").append("<tr><th>Name</th><th>Email</th><th>Phone</th></tr>");
        drawContacts(contacts);        
    });

    return false;
}

function GetEventMessage() {

    $.ajax({
        type: 'POST',
        url: "GetEventMessage",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            $("#message").val(data);
          },
        error: function(data) {
            console.log(data);
        }        
        
    });
    
}

function GetSampleMessage() {

    $.ajax({
        type: 'POST',
        url: "GetSampleMessage",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            $("#message").val(data);
          },
        error: function(data) {
            console.log(data);
        }        
        
    });
    
}

function GetEventContacts() {

    $.ajax({
        type: 'POST',
        url: "GetEventContacts",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            contacts = data;
            $("#historique tr").remove();
            $("#historique").append("<tr><th>Name</th><th>Email</th><th>Phone</th></tr>");
            drawContacts(data);
          },
        error: function(data) {
            console.log(data);
        }        
        
    });
    
}

function SendSMS() {
 
    
    console.log(contacts);
    // get inputs
    var parms = new Object();
    parms.message = $('#message').val();
    parms.contacts = contacts;
    parms.gsms = $('#gsms').val().split(',');
    
    $.ajax({
        type: 'POST',
        url: "SendSMS",
        dataType: 'json',
        data: JSON.stringify(parms),        

        success: function(data) {
            console.log(data);
            $("#historique tr").remove();
            $("#historique").append("<tr><th>Sid</th><th>When</th><th>From</th><th>To</th><th>Status</th><th>About</th></tr>");
            drawTable(data);
          },
        error: function(data) {
            console.log(data);
        }        
        
    });
}

function drawContacts(data) {
    
    var gsms = "";
    for (var i = 0; i < data.length; i++) {
        drawContact(data[i]);
        gsms += data[i].gsm + ",";
    }
    console.log(gsms);
    $('#gsms').val(gsms);
    
}

function drawContact(rowData) {
    var row = $("<tr />");
    $("#historique").append(row);
    row.append($("<td>" + rowData.nom + " " + rowData.prenom + "</td>"));
    row.append($("<td>" + rowData.email + "</td>"));
    row.append($("<td>" + rowData.gsm + "</td>"));
}


function drawTable(data) {
    
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
    
}

function drawRow(rowData) {
    var row = $("<tr />");
    $("#historique").append(row);
    row.append($("<td>" + rowData.sid + "</td>"));
    row.append($("<td>" + rowData.hwhen + "</td>"));
    row.append($("<td>" + rowData.from + "</td>"));
    row.append($("<td>" + rowData.to + "</td>"));
    row.append($("<td>" + rowData.status + "</td>"));
    row.append($("<td>" + rowData.body + "</td>"));
}

$(document).on('change', '.btn-file :file', function() {
      var input = $(this),
          numFiles = input.get(0).files ? input.get(0).files.length : 1,
          label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
      console.log("numFiles=" + numFiles);
      console.log("label=" + label);
      $('#infos').text(label + " has been successfully loaded and is now ready to be uploaded.");
});

