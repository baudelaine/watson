
var datas = [];
var tables = [];
var modelList = [];
var $tableList = $('#tables');
var $datasTable = $('#DatasTable');
var $navTab = $('#navTab');
var $refTab = $("a[href='#Reference']");
var $finTab = $("a[href='#Final']");
var $qsTab = $("a[href='#QuerySubject']");



var activeTab = "Mails";
var $MailsTab = $("a[href='#Mails']");
var $TATab = $("a[href='#TA']");
var $NLUTab = $("a[href='#NLU']");
var $DTab = $("a[href='#D']");
var $VRTab = $("a[href='#VR']");
var $FRTab = $("a[href='#FR']");
var $TRTab = $("a[href='#TR']");

var previousTab;
var $activeSubDatasTable;
var $newRowModal = $('#newRowModal');
var $modelListModal = $('#modModelList');
var $projectFileModal = $('#modProjectFile');
// var url = "js/PROJECT.json";
var qs2rm = {qs: "", row: "", qsList: [], removed: false};

var relationCols = [];
// relationCols.push({field:"checkbox", checkbox: "true"});
relationCols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
relationCols.push({field:"_id", title: "_id", sortable: true});
relationCols.push({field:"key_name", title: "key_name", sortable: true});
relationCols.push({field:"key_type", title: "key_type", sortable: true});
relationCols.push({field:"pktable_name", title: "pktable_name", sortable: true});
relationCols.push({field:"pktable_alias", title: "pktable_alias", class: "pktable_alias", editable: {type: "text"}, sortable: true, events: "pktable_aliasEvents"});
relationCols.push({field:"relationship", title: "relationship", editable: {type: "textarea", rows: 4}});
relationCols.push({field:"fin", title: "fin", formatter: "boolFormatter", align: "center"});
relationCols.push({field:"ref", title: "ref", formatter: "boolFormatter", align: "center"});
relationCols.push({field:"nommageRep", title: "RepTableName", formatter: "boolFormatter", align: "center"});
relationCols.push({field:"duplicate", title: '<i class="glyphicon glyphicon-duplicate"></i>', formatter: "duplicateFormatter", align: "center"});
relationCols.push({field:"remove", title: '<i class="glyphicon glyphicon-trash"></i>', formatter: "removeFormatter", align: "center"});
// relationCols.push({field:"operate", title: "operate", formatter: "operateRelationFormatter", align: "center", events: "operateRelationEvents"});

// relationCols.push({field:"linker", formatter: "boolFormatter", align: "center", title: "linker"});
// relationCols.push({field:"linker_ids", title: "linker_ids"});

window.pktable_aliasEvents = {
      'change .pktable_alias': function (e, value, row, index) {
        alert("value=" + value);
      }
}

// function pktable_aliasFormatter(value, row, index){
//   return '<a href="#" id="pktable_alias">' + value + 'superuser</a>'
// }
//
// $('pktable_alias .editable').on('update', function(e, editable) {
//     alert('new value: ' + editable.value);
// });

var newRelationCols = [];

newRelationCols.push();

var qsCols = [];
// qsCols.push({field:"checkbox", checkbox: "true"});
qsCols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
qsCols.push({field:"_id", title: "_id", sortable: true});
qsCols.push({field:"table_name", title: "table_name", sortable: true});
qsCols.push({field:"table_alias", title: "table_alias", editable: false, sortable: true});
qsCols.push({field:"type", title: "type", sortable: true});
qsCols.push({field:"visible", title: "visible", formatter: "boolFormatter", align: "center", sortable: false});
qsCols.push({field:"filter", title: "filter", editable: {type: "textarea"}, sortable: true});
qsCols.push({field:"label", title: "label", editable: {type: "textarea"}, sortable: true});
  qsCols.push({field:"recurseCount", title: '<i class="glyphicon glyphicon-repeat" title="Set recurse count"></i>', editable: {
    type: "select",
    value: 1,
  //   source: [
  //     {value: 1, text: 1},
  //     {value: 2, text: 2},
  //     {value: 3, text: 3},
  //     {value: 4, text: 4},
  //     {value: 5, text: 5}
  //     ],
    source: function(){
      var result = [];
      for(var i = 1; i < 21; i++){
        var option = {};
        option.value = i;
        option.text = i;
        result.push(option);
      }
      return result;
    },
    align: "center"}
  });
qsCols.push({field:"addPKRelation", title: '<i class="glyphicon glyphicon-magnet" title="Add PK relation(s)"></i>', formatter: "addPKRelationFormatter", align: "center"});
qsCols.push({field:"addRelation", title: '<i class="glyphicon glyphicon-plus-sign" title="Add new relation"></i>', formatter: "addRelationFormatter", align: "center"});
qsCols.push({field:"linker", formatter: "boolFormatter", title: "linker", align: "center"});
qsCols.push({field:"linker_ids", title: "linker_ids"});

var fieldCols = [];
fieldCols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
fieldCols.push({field:"field_name", title: "field_name", sortable: true });
fieldCols.push({field:"label", title: "label", editable: {type: "text"}, sortable: true});
fieldCols.push({field:"traduction", title: "traduction", formatter: "boolFormatter", align: "center", sortable: false});
fieldCols.push({field:"visible", title: "visible", formatter: "boolFormatter", align: "center", sortable: false});
fieldCols.push({field:"field_type", title: "field_type", editable: false, sortable: true});
fieldCols.push({field:"timezone", title: "timezone", formatter: "boolFormatter", align: "center", sortable: false});


$(document)
.ready(function() {
  $('#DatasToolbar').hide();
  // ChooseTable($tableList);
  buildMailsTable($datasTable, mailsCols, datas, false);

})
.ajaxStart(function(){
    $("div#divLoading").addClass('show');
		$("div#modDivLoading").addClass('show');
})
.ajaxStop(function(){
    $("div#divLoading").removeClass('show');
		$("div#modDivLoading").removeClass('show');
});

$tableList.change(function () {
    var selectedText = $(this).find("option:selected").val();
		$('#alias').val(selectedText);
});

// $navTab.on('shown.bs.tab', function(event){
//     activeTab = $(event.target).text();         // active tab
// 		console.log("Event shown.bs.tab: activeTab=" + activeTab);
//     previousTab = $(event.relatedTarget).text();  // previous tab
// 		console.log("Event shown.bs.tab: previousTab=" + previousTab);
// });

$('#pktable_alias').on('save', function(e, params) {
    alert('Saved value: ' + params.newValue);
});

$navTab.on('show.bs.tab', function(event){
    activeTab = $(event.target).text();         // active tab
		console.log("Event show.bs.tab: activeTab=" + activeTab);
    previousTab = $(event.relatedTarget).text();  // previous tab
		console.log("Event show.bs.tab: previousTab=" + previousTab);
});


$qsTab.on('shown.bs.tab', function(e) {
  buildTable($datasTable, qsCols, datas, true, fieldCols, "fields");
  $datasTable.bootstrapTable("filterBy", {type: ['Final', 'Ref']});
  $datasTable.bootstrapTable('showColumn', 'visible');
  $datasTable.bootstrapTable('showColumn', 'filter');
  $datasTable.bootstrapTable('showColumn', 'label');
  $datasTable.bootstrapTable('hideColumn', 'operate');
  $datasTable.bootstrapTable('hideColumn', 'addRelation');
  $datasTable.bootstrapTable('hideColumn', 'addPKRelation');
  $datasTable.bootstrapTable('hideColumn', 'recurseCount');
  $datasTable.bootstrapTable('hideColumn', '_id');
});

$finTab.on('shown.bs.tab', function(e) {
  buildTable($datasTable, qsCols, datas, true, relationCols, "relations");
  $datasTable.bootstrapTable("filterBy", {type: ['Final']});
  $datasTable.bootstrapTable('showColumn', 'operate');
  $datasTable.bootstrapTable('hideColumn', 'visible');
  $datasTable.bootstrapTable('hideColumn', 'filter');
  $datasTable.bootstrapTable('hideColumn', 'label');
  $datasTable.bootstrapTable('hideColumn', 'recurseCount');
  $datasTable.bootstrapTable('showColumn', 'addRelation');
  $datasTable.bootstrapTable('hideColumn', 'addPKRelation');
  $datasTable.bootstrapTable('hideColumn', 'nommageRep');
  $datasTable.bootstrapTable('hideColumn', '_id');
  // $datasTable.bootstrapTable('showColumn', 'linker');
  // $datasTable.bootstrapTable('showColumn', 'linker_ids');

});

$refTab.on('shown.bs.tab', function(e) {
  buildTable($datasTable, qsCols, datas, true, relationCols, "relations");
  $datasTable.bootstrapTable("filterBy", {type: ['Final', 'Ref']});
  $datasTable.bootstrapTable('showColumn', 'operate');
  $datasTable.bootstrapTable('hideColumn', 'visible');
  $datasTable.bootstrapTable('hideColumn', 'filter');
  $datasTable.bootstrapTable('hideColumn', 'label');
  $datasTable.bootstrapTable('showColumn', 'addPKRelation');
  $datasTable.bootstrapTable('showColumn', 'addRelation');
  $datasTable.bootstrapTable('showColumn', 'recurseCount');
  $datasTable.bootstrapTable('showColumn', 'nommageRep');
  $datasTable.bootstrapTable('hideColumn', '_id');
  // $datasTable.bootstrapTable('showColumn', 'linker');
  // $datasTable.bootstrapTable('showColumn', 'linker_ids');
});

$datasTable.on('editable-save.bs.table', function (editable, field, row, oldValue, $el) {
  if(field == "pktable_alias"){
    var newValue = row.pktable_alias;
    if($activeSubDatasTable != undefined){
      updateCell($activeSubDatasTable, row.index, 'relationship', row.relationship.split("[" + oldValue + "]").join("[" + newValue + "]"));
    }
  }
});

$datasTable.on('reset-view.bs.table', function(){
  // console.log("++++++++++++++on passe dans reset-view");
  // console.log("activeTab=" + activeTab);
  // console.log("previousTab=" + previousTab);
  if($activeSubDatasTable != undefined){
    var v = $activeSubDatasTable.bootstrapTable('getData');
    // console.log("+++++++++++ $activeSubDatasTable");
    // console.log(v);
    var $tableRows = $activeSubDatasTable.find('tbody tr');
    // console.log("++++++++++ $tableRows");
    // console.log($tableRows);
    $.each(v, function(i, row){
      // console.log("row.ref");
      // console.log(row.ref);
      // console.log("row.fin");
      // console.log(row.fin);
      if(activeTab == "Reference" && !row.ref){
        $tableRows.eq(i).find('a').eq(3).editable('disable');
        // $tableRows.eq(i).find('a').editable('disable');
      }
      if(row.fin || row.ref){
        $tableRows.eq(i).find('a').eq(0).editable('disable');
        // $tableRows.eq(i).find('a').editable('disable');
      }
      if(row.fin && activeTab == "Reference"){
        $tableRows.eq(i).find('a').eq(2).editable('disable');
        $tableRows.eq(i).find('a').eq(1).editable('disable');
      }
      if(row.ref && activeTab == "Final"){
        $tableRows.eq(i).find('a').eq(2).editable('disable');
        $tableRows.eq(i).find('a').eq(1).editable('disable');
      }

    });
  }
});

$datasTable.on('expand-row.bs.table', function (index, row, $detail) {
  console.log("index: ");
  console.log(index);
  console.log("row: ");
  console.log(row);
  console.log("$detail: ");
  console.log($detail);

});

$newRowModal.on('show.bs.modal', function (e) {
  // do something...
	// ChooseQuerySubject($('#modQuerySubject'));
  $('#modPKTables').empty();
  $('#modPKColumn').empty();
  $('#modPKColumn').selectpicker('refresh');
  $.each(tables, function(i, obj){
    var option = '<option class="fontsize" value=' + obj.name + '>' + obj.name + ' (' + obj.FKCount + ') (' + obj.FKSeqCount + ')'
     + ' (' + obj.PKCount + ') (' + obj.PKSeqCount + ') (' + obj.RecCount + ')' + '</option>';
    $('#modPKTables').append(option);
  });
  $('#modPKTables').selectpicker('refresh');
	// ChooseTable($('#modPKTables'));
  // $(this)
  // .find('.modal-body')
  // .load("sqel.html", function(){
  //});

})

$modelListModal.on('shown.bs.modal', function() {
    $(this).find('.modal-body').empty();
    var models = modelList;
    var list = '<div class="container-fluid"><div class="row"><div class="list-group">';

    $.each(models, function(i, obj){
        list += '<a href="#" class="list-group-item" onClick="OpenModel(' + obj.id + '); return false;">' + obj.name + '</a>';
    });
    list += '<div class="list-group"></div></div>';
    $(this).find('.modal-body').append(list);

});


$projectFileModal.on('shown.bs.modal', function() {
    $(this).find('.modal-body').empty();
    var html = [
      '<div class="container-fluid"><div class="row"><div class="form-group"><div class="input-group">',
	'<span class="input-group-addon">model-</span>',
      '<input type="text" id="filePath" class="form-control">',
      '</div></div></div></div>',
    ].join('');

    $(this).find('.modal-body').append(html);
    $(this).find('#filePath').focus().val("NNN");


});

$('#modKeyType').change(function () {
  updateKeyName();
});

var mailsCols = [];
// relationCols.push({field:"checkbox", checkbox: "true"});
mailsCols.push({field:"index", title: "index", formatter: "indexFormatter", sortable: false});
// mailsCols.push({field:"subject", title: "Subject", formatter: "subjectFormatter", sortable: true});
mailsCols.push({field:"subject", title: "Subject", footerFormatter: "subjectFormatter", editable: {type: "textarea", rows: 4}, sortable: true});
mailsCols.push({field:"content", title: "Content", editable: {type: "textarea", rows: 8}, sortable: true});
// mailsCols.push({field:"url", title: "Url", editable: {type: "textarea", rows: 4}, sortable: true});
mailsCols.push({field:"attached", title: '<i class="glyphicon glyphicon-paperclip"></i>', align: "center"});
mailsCols.push({field:"picture", title: '<i class="glyphicon glyphicon-picture"></i>', align: "center"});
mailsCols.push({field:"face", title: '<i class="glyphicon glyphicon-user"></i>', align: "center"});
mailsCols.push({field:"tip", title: '<i class="glyphicon glyphicon-text-background"></i>', align: "center"});

var taCols = [];
taCols.push({value: "tone", field:"tone", title: "Tone", formatter: "toneFormatter", sortable: false});
taCols.push({value:"score", field:"score", title: "Score", formatter: "scoreFormatter", sortable: true});

var nluCols = [];
nluCols.push({field:"label", title: "Label", formatter: "labelFormatter", sortable: false});
nluCols.push({field:"score", title: "Score", formatter: "scoreFormatter", sortable: true});

var dCols = [];
dCols.push({field:"dbpedia_resource", title: "Dbpedia Resource", formatter: "dbpedia_resourceFormatter", sortable: false});
dCols.push({field:"relevance", title: "Relevance", formatter: "relevanceFormatter", sortable: true});
dCols.push({field:"text", title: "Text", formatter: "textFormatter", sortable: true});

var vrCols = [];
vrCols.push({field:"class", title: "Class", formatter: "classFormatter", sortable: true});
vrCols.push({field:"score", title: "Score", formatter: "scoreFormatter", sortable: true});
vrCols.push({field:"type_hierarchy", title: "Type Hierarchy", formatter: "type_hierarchyFormatter", sortable: true});

var frCols = [];
frCols.push({field:"ageMin", title: "Age Min", formatter: "ageMinFormatter", sortable: true});
frCols.push({field:"ageMax", title: "Age Max", formatter: "ageMaxFormatter", sortable: true});
frCols.push({field:"ageScore", title: "Age Score", formatter: "ageScoreFormatter", sortable: true});
frCols.push({field:"gender", title: "Gender", formatter: "genderFormatter", sortable: true});
frCols.push({field:"genderScore", title: "Gender Score", formatter: "genderScoreFormatter", sortable: true});

var trCols = [];
trCols.push({field:"word", title: "Word", formatter: "wordFormatter", sortable: true});
trCols.push({field:"score", title: "Score", formatter: "scoreFormatter", sortable: true});
trCols.push({field:"height", title: "Height", formatter: "trHeightFormatter", sortable: true});
trCols.push({field:"left", title: "Left", formatter: "trLeftFormatter", sortable: true});
trCols.push({field:"top", title: "Top", formatter: "trTopFormatter", sortable: true});
trCols.push({field:"width", title: "Width", formatter: "trWidthFormatter", sortable: true});

function trHeightFormatter(value, row, index) {
  return row.location.height;
}
function trLeftFormatter(value, row, index) {
  return row.location.left;
}
function trWidthFormatter(value, row, index) {
  return row.location.width;
}
function trTopFormatter(value, row, index) {
  return row.location.top;
}
function ageMinFormatter(value, row, index) {
  return row.age.min;
}
function ageMaxFormatter(value, row, index) {
  return row.age.max;
}
function ageScoreFormatter(value, row, index) {
  return row.age.score;
}
function genderFormatter(value, row, index) {
  return row.gender.gender;
}
function genderScoreFormatter(value, row, index) {
  return row.gender.score;
}
function dbpedia_resourceFormatter(value, row, index) {
  return row.dbpedia_resource;
}
function relevanceFormatter(value, row, index) {
  return row.relevance;
}
function textFormatter(value, row, index) {
  return row.text;
}
function type_hierarchyFormatter(value, row, index) {
  return row.type_hierarchy;
}
function classFormatter(value, row, index) {
  return row.class;
}
function toneFormatter(value, row, index) {
  return row.tone_name;
}
function labelFormatter(value, row, index) {
  return row.label;
}
function scoreFormatter(value, row, index) {
  return row.score;
}
function wordFormatter(value, row, index) {
  return row.word;
}

$MailsTab.on('shown.bs.tab', function(e) {
  buildMailsTable($datasTable, qsCols, datas, false);
  $datasTable.bootstrapTable("collapseAllRows");
});
$TATab.on('shown.bs.tab', function(e) {
  buildMailsTable($datasTable, qsCols, datas, true);
  $datasTable.bootstrapTable("collapseAllRows");
});
$NLUTab.on('shown.bs.tab', function(e) {
  buildMailsTable($datasTable, qsCols, datas, true);
  $datasTable.bootstrapTable("collapseAllRows");
});
$DTab.on('shown.bs.tab', function(e) {
  buildMailsTable($datasTable, qsCols, datas, true);
  $datasTable.bootstrapTable("collapseAllRows");
});
$VRTab.on('shown.bs.tab', function(e) {
  buildMailsTable($datasTable, qsCols, datas, true);
  $datasTable.bootstrapTable("collapseAllRows");
});
$FRTab.on('shown.bs.tab', function(e) {
  buildMailsTable($datasTable, qsCols, datas, true);
  $datasTable.bootstrapTable("collapseAllRows");
});
$TRTab.on('shown.bs.tab', function(e) {
  buildMailsTable($datasTable, qsCols, datas, true);
  $datasTable.bootstrapTable("collapseAllRows");
});

function buildMailsTable($el, cols, data, detailView) {

  console.log("detailView=" + detailView);

    $el.bootstrapTable({
        columns: cols,
        // url: url,
        // data: data,
        search: false,
				showRefresh: false,
				showColumns: false,
				showToggle: false,
				pagination: false,
				showPaginationSwitch: false,
        idField: "index",
				// toolbar: "#DatasToolbar",
        detailView: true,
        onClickCell: function (field, value, row, $element){

        },
        onExpandRow: function (index, row, $detail) {

          var analysis;
          switch(activeTab) {
              case "Tone Analyzer":
                  analysis = row.analysis.ta.document_tone.tone_categories[0].tones;
                  console.log("*****************row.analysis.ta");
                  console.log(row.analysis.ta.document_tone.tone_categories[0].category_name);
                  expandMailsTable($detail, taCols, row.analysis.ta.document_tone.tone_categories[0].tones, row);
                  break;
              case "Natural Language Understanding":
                  analysis = row.analysis.nlu.categories;
                  expandMailsTable($detail, nluCols, analysis, row);
                  break;
              case "Discovery":
                analysis = row.analysis.d.results[0].enriched_text.concepts;
                expandMailsTable($detail, dCols, analysis, row);
                  break;
              case "Visual Recognition":
                analysis = row.analysis.vr.images[0].classifiers[0].classes;
                expandMailsTable($detail, vrCols, analysis, row);
                  break;
              case "Face Recognition":
                analysis = row.analysis.fr.images[0].faces;
                console.log("*****************row.analysis.fr.images[0].faces");
                console.log(row.analysis.fr.images[0].faces);
                $.each(analysis, function(k, v){
                  console.log("k");
                  console.log(k);
                  console.log("v");
                  console.log(v);
                });
                var fields = Object.values(analysis);
                expandMailsTable($detail, frCols, analysis, row);
                  break;
              case "Text Recognition":
                analysis = row.analysis.tr.images[0].words;
                expandMailsTable($detail, trCols, analysis, row);
                  break;
              default:
                break;
          }

        }
    });
}

function expandMailsTable($detail, cols, data, parentData) {
    $subtable = $detail.html('<table></table>').find('table');
    console.log("expandTable.data=");
    console.log(data);
    $activeSubDatasTable = $subtable;
    buildMailsSubTable($subtable, cols, data, parentData);
}

function buildMailsSubTable($el, cols, data, parentData){

  console.log("buildSubTable: activeTab=" + activeTab);
  console.log("buildSubTable: previousTab=" + previousTab);

  $el.bootstrapTable({
      columns: cols,
      // url: url,
      data: data,
      showToggle: false,
      search: false,
      checkboxHeader: false,
      idField: "index",
      onEditableInit: function(){
        //Fired when all columns was initialized by $().editable() method.
      },
      onEditableShown: function(editable, field, row, $el){
        //Fired when an editable cell is opened for edits.
      },
      onEditableHidden: function(field, row, $el, reason){
        //Fired when an editable cell is hidden / closed.
      },
      onEditableSave: function (field, row, oldValue, editable) {
        //Fired when an editable cell is saved.
        console.log("---------- buildSubTable: onEditableSave -------------");
        console.log("editable=");
        console.log(editable);
        console.log("field=");
        console.log(field);
        console.log("row=");
        console.log(row);
        console.log("oldValue=");
        console.log(oldValue);
        console.log("---------- buildSubTable: onEditableSave -------------");
      },
      onClickCell: function (field, value, row, $element){

      }
  });
}

function GetMails(){

  var fd = new FormData();
  var file = new Blob(['file contents'], {type: 'plain/text'});

  fd.append('formFieldName', file, 'fileName.txt');

  $.ajax({
    url: "Analyze",
    type: "POST",
    data: fd,
    enctype: 'multipart/form-data',
    dataType: 'json',
    processData: false,  // tell jQuery not to process the data
    contentType: false,   // tell jQuery not to set contentType

    success: function(data) {
      console.log(data);
      $.each(data, function(i, obj){
        if(i == "MAILS"){
          console.log(obj);
          $datasTable.bootstrapTable('load', obj);
        }
      });
			showalert("GetMails()", "Mails downloaded successfully.", "alert-success", "bottom");
		},
		error: function(data) {
			showalert("GetMails()", "Downloading mails failed.", "alert-danger", "bottom");
		}
  });

}

function AnalyzeMails(){

  if($datasTable.bootstrapTable("getData").length == 0){
    showalert("AnalyzeMails()", "No mail to analyze", "alert-info", "bottom");
  }

  $.ajax({
    type: 'POST',
    url: "Analyze",
    dataType: 'json',
    data: '{"text": "text", "integer": 1, "boolean": false}',

    success: function(data) {
			console.log(data);
			if (data.length == 0) {
				showalert("AnalyzeMails()", "No analysis returned", "alert-info", "bottom");
				// return;
			}
      $.each(data, function(i, obj){
        if(i == "MAILS"){
          console.log(obj);
          $datasTable.bootstrapTable('load', obj);
        }
      });
      showalert("AnalyzeMails()", "Mails analyzed successfully.", "alert-success", "bottom");

  	},
      error: function(data) {
          console.log(data);
          showalert("AnalyzeMails()", "Analysis failed.", "alert-danger", "bottom");
    }

  });

}

function updateKeyName(){
  var keyType = $('#modKeyType').find("option:selected").val();
  var newText = 'CK_';
  if(keyType == "P"){
   newText += $('#modQuerySubject').text().split(" - ")[0] + '_' + $('#modPKTableAlias').val();
  }
  if(keyType == "F"){
   newText +=  $('#modPKTableAlias').val() + '_' + $('#modQuerySubject').text().split(" - ")[0];
  }
  $('#modKeyName').val(newText);
}

$('#modPKTables').change(function () {
    var selectedText = $(this).find("option:selected").val();
		$('#modPKTableAlias').val(selectedText);
    updateKeyName();
    // var relationship = $('#modRelationship').text() + "[" + selectedText + "].[]";
    // $('#modRelationship').val(relationship);
    ChooseField($('#modPKColumn'), selectedText);
});

$('#modPKTableAlias').change(function () {
  updateKeyName();
    // var relationship = $('#modRelationship').text() + "[" + $('#modPKTableAlias').val() + "].[]";
    // $('#modRelationship').val(relationship);
});

window.operateRelationEvents = {
    'click .duplicate': function (e, value, row, index) {
      console.log("+++++ on entre dans click .duplicate");
      console.log(e);
      console.log(value);
      console.log(row);
      console.log(index);

        nextIndex = row.index + 1;
        console.log("nextIndex=" + nextIndex);
        var newRow = $.extend({}, row);
        newRow.checkbox = false;
        newRow.pktable_alias = "";
        newRow.fin = false;
        newRow.ref = false;
        newRow.relationship = newRow.relationship.replace(/ = \[FINAL\]\./g, " = ");
        newRow.relationship = newRow.relationship.replace(/ = \[REF\]\./g, " = ");
        console.log("newRow");
        console.log(newRow);
        $activeSubDatasTable.bootstrapTable('insertRow', {index: nextIndex, row: newRow});
        console.log("+++++ on sort de click .duplicate");

    },
    'click .remove': function (e, value, row, index) {
        $activeSubDatasTable.bootstrapTable('remove', {
            field: 'index',
            values: [row.index]
        });
    }
};

window.operateQSEvents = {
    'click .addRelation': function (e, value, row, index) {

      console.log("index=" + index);
      // $datasTable.bootstrapTable('expandAllRows');
      $datasTable.bootstrapTable('expandRow', index);

      console.log("++++++++++++++on passe dans window.operateQSEvents.add");
      if($activeSubDatasTable != ""){

        var v = $activeSubDatasTable.bootstrapTable('getData');
        console.log("+++++++++++ $activeSubDatasTable");

        console.log(v);
        $newRowModal.modal('toggle');
        var qs = row.table_alias + ' - ' + row.type + ' - ' + row.table_name;
        // $('#modQuerySubject').selectpicker('val', qs);

        $('#modQuerySubject').text(qs);
        $('#modKeyName').val("CK_" + row.table_alias);
        $('#modPKTableAlias').val("");
        // $('#modRelathionship').val("[" + row.type.toUpperCase() + "].[" + row.table_alias + "].[] = ");
      }

    },
    'click .expandAllQS': function (e, value, row, index) {
      $datasTable.bootstrapTable("expandAllRows")
    },
    'click .collapseAllQS': function (e, value, row, index) {
      $datasTable.bootstrapTable("collapseAllRows")
    }
};

function operateRelationFormatter(value, row, index) {
    return [
        '<a class="duplicate" href="javascript:void(0)" title="Duplicate">',
        '<i class="glyphicon glyphicon-duplicate"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-trash"></i>',
        '</a>'
    ].join('');
}

function operateQSFormatter(value, row, index) {
    return [
        '<a class="addRelation" href="javascript:void(0)" title="Add Relation">',
        '<i class="glyphicon glyphicon-plus-sign"></i>',
        '</a>  ',
        '<a class="expandAllQS" href="javascript:void(0)" title="Expand all QS">',
        '<i class="glyphicon glyphicon-resize-full"></i>',
        '</a>  ',
        '<a class="collapseAllQS" href="javascript:void(0)" title="Collapse all QS">',
        '<i class="glyphicon glyphicon-resize-small"></i>',
        '</a>'
    ].join('');
}

function addPKRelationFormatter(value, row, index) {
    return [
        '<a class="addPKRelation" href="javascript:void(0)" title="Add PK relation(s)">',
        '<i class="glyphicon glyphicon-magnet"></i>',
        '</a>'
    ].join('');
}

function addRelationFormatter(value, row, index) {
    return [
        '<a class="addRelation" href="javascript:void(0)" title="Add new relation">',
        '<i class="glyphicon glyphicon-plus-sign"></i>',
        '</a>'
    ].join('');
}

function boolFormatter(value, row, index) {

  // console.log("****** VALUE *********" + value);
  //
  // if(value == undefined){
  //   value = false;
  // }
  var icon = value == true ? 'glyphicon-check' : 'glyphicon-unchecked'
  if(value == undefined){
      console.log("****** VALUE *********" + value);
      console.log(row);
      icon = 'glyphicon-unchecked';
  }
  return [
    '<a href="javascript:void(0)">',
    '<i class="glyphicon ' + icon + '"></i> ',
    '</a>'
  ].join('');
}

function duplicateFormatter(value, row, index) {
  return [
      '<a class="duplicate" href="javascript:void(0)" title="Duplicate">',
      '<i class="glyphicon glyphicon-duplicate"></i>',
      '</a>'
  ].join('');
}

function removeFormatter(value, row, index) {
  return [
      '<a class="remove" href="javascript:void(0)" title="Remove">',
      '<i class="glyphicon glyphicon-trash"></i>',
      '</a>'
  ].join('');
}

function indexFormatter(value, row, index) {
  row.index = index;
  return index;
}

// function recurseCountFormatter(value, row, index) {
//   return 1;
// }

function modValidate(){

  if ($("#modPKTables").find("option:selected").text() == 'Choose a pktable...') {
    showalert("modValidate()", "No pktable selected.", "alert-warning", "bottom");
    return;
  }

  if ($("#modPKColumn").find("option:selected").text() == 'Choose a pkcolumn...') {
    showalert("modValidate()", "No pkcolumn selected.", "alert-warning", "bottom");
    return;
  }

  if ($("#modColumn").find("option:selected").text() == 'Choose a column...') {
    showalert("modValidate()", "No column selected.", "alert-warning", "bottom");
    return;
  }

  if( $activeSubDatasTable == undefined){
    showalert("modValidate()", "$activeSubDatasTable not initialized", "alert-danger", "bottom");
  }

  var relation = {};
  var seq = {};

  relation.ref = null;
  relation.table_name = $('#modQuerySubject').text().split(" - ")[2];
  relation.key_name = $('#modKeyName').val();
  relation.fk_name = "";
  relation.pk_name = "";
  relation.key_type = $('#modKeyType').find("option:selected").text();
  relation.pktable_name = $('#modPKTables').find("option:selected").val();
  relation.pktable_alias = $('#modPKTableAlias').val();
  relation.fin = false;
  relation.ref = false;
  relation.withPK = false;
  seq.column_name = $('#modColumn').find("option:selected").val();
  seq.pkcolumn_name = $('#modPKColumn').find("option:selected").val();
  seq.key_seq = 1;
  relation.seqs = [];
  relation.seqs.push(seq);
  relation._id = $('#modKeyName').val() + relation.key_type;
  relation.relationship = "[" + $('#modQuerySubject').text().split(" - ")[1].toUpperCase() + "].[" + $('#modQuerySubject').text().split(" - ")[0] +
    "].[" + seq.column_name + "] = [" + relation.pktable_alias + "].[" + seq.pkcolumn_name + "]";

  var data = $datasTable.bootstrapTable("getData");

  var qs = $('#modQuerySubject').text().split(" - ")[0] + $('#modQuerySubject').text().split(" - ")[1]

  $.each(data, function(i, obj){
    //console.log(obj.name);
    if(obj._id.match(qs)){
      if(obj.relations.length == 0){
        obj.relations.push(relation);
      }
      console.log("+++ obj +++");
      console.log(obj);
    }
  });

  AddRow($activeSubDatasTable, relation);

  $newRowModal.modal('toggle');

}


function buildSubTable($el, cols, data, parentData){

  console.log("buildSubTable: activeTab=" + activeTab);
  console.log("buildSubTable: previousTab=" + previousTab);

  $el.bootstrapTable({
      columns: cols,
      // url: url,
      data: data,
      showToggle: false,
      search: false,
      checkboxHeader: false,
      idField: "index",
      onEditableInit: function(){
        //Fired when all columns was initialized by $().editable() method.
      },
      onEditableShown: function(editable, field, row, $el){
        //Fired when an editable cell is opened for edits.
      },
      onEditableHidden: function(field, row, $el, reason){
        //Fired when an editable cell is hidden / closed.
      },
      onEditableSave: function (field, row, oldValue, editable) {
        //Fired when an editable cell is saved.
        console.log("---------- buildSubTable: onEditableSave -------------");
        console.log("editable=");
        console.log(editable);
        console.log("field=");
        console.log(field);
        console.log("row=");
        console.log(row);
        console.log("oldValue=");
        console.log(oldValue);
        console.log("---------- buildSubTable: onEditableSave -------------");

        var newValue = row._id.substr(0,3);
        if(newValue.match("DK_|CK_")){
          if(row.key_type == "F"){
            newValue += row.pktable_alias + "_" + parentData.table_alias;
            updateCell($activeSubDatasTable, row.index, '_id', newValue + "F" );
            updateCell($activeSubDatasTable, row.index, 'key_name', newValue);
          }
          if(row.key_type == "P"){
            newValue += parentData.table_alias + "_" +  row.pktable_alias;
            updateCell($activeSubDatasTable, row.index, '_id', newValue + "P" );
            updateCell($activeSubDatasTable, row.index, 'key_name', newValue);
          }
        }

      },
      onClickCell: function (field, value, row, $element){

        if(field.match("traduction|visible|timezone|fin|ref|nommageRep")){

          console.log($(this).bootstrapTable("getData"));

          console.log("buildSubTable: row.ref=" + row.ref);

          if(field == "fin" && row.ref){
            showalert("buildSubTable()", row._id + " is already checked as REF.", "alert-warning", "bottom");
            return;
          }

          if(field == "ref" && row.fin){
            showalert("buildSubTable()", row._id + " is already checked as FINAL.", "alert-warning", "bottom");
            return;
          }

          var allowNommageRep = true;

          if(field == "nommageRep" && !row.ref){
            allowNommageRep = false;
          }

          if(!allowNommageRep){
            showalert("buildSubTable()", "Ref for " + row.pktable_alias + " has to be checked first.", "alert-warning", "bottom");
            return;
          }

          if(field == "nommageRep" && value == false){
            // interdire de cocher n fois pour un même pkAlias dans un qs donné
            $.each($el.bootstrapTable("getData"), function(i, obj){
              console.log(obj);
              console.log(obj.pktable_alias + " -> " + obj.nommageRep);
              if((obj.pktable_alias == row.pktable_alias) && obj.nommageRep){
                allowNommageRep = false;
              }
            });

          }

          if(!allowNommageRep){
            showalert("buildSubTable()", "RepTableName for pktable_alias " + row.pktable_alias + " already checked.", "alert-warning", "bottom");
            return;
          }

          if(field.match("fin|ref") && value == true){
            RemoveKeys(row, parentData);
            return;
          }

          // console.log("+++++++ qs2rm +++++++");
          // console.log(qs2rm.row);
          // console.log(qs2rm.qsList);
          // console.log(qs2rm.removed);
          // console.log("+++++++ qs2rm +++++++");
          //
          // if(!qs2rm.removed){
          //   return;
          // }
          //
          // if(field.match("fin|ref") && qs2rm.removed){
          //   var linked = false;
          //   $.each(parentData.relations, function(i, obj){
          //     if(obj.fin || obj.ref){
          //       linked = true;
          //     }
          //   });
          //   updateCell($datasTable, parentData.index, "linker", linked);
          // }

          var newValue = value == false ? true : false;
          var pkAlias = '[' + row.pktable_alias + ']';

          console.log("row.index=" + row.index);
          console.log("field=" + field);
          console.log("newValue=" + newValue);
          console.log("row.pktable_alias=" + row.pktable_alias);


          if(field.match("fin|ref") && row.pktable_alias == ""){
            showalert("buildSubTable()", "Empty is not a valid pktable_alias.", "alert-warning", "bottom");
            return;
          }


          if(field == "fin" && newValue == true){
            row.relationship = row.relationship.split(pkAlias).join("[FINAL]." + pkAlias);
          }
          if(field == "fin" && newValue == false){
            row.relationship = row.relationship.split("[FINAL]." + pkAlias).join(pkAlias);
          }
          if(field == "ref" && newValue == true){
            row.relationship = row.relationship.split(pkAlias).join("[REF]." + pkAlias);
          }
          if(field == "ref" && newValue == false){
            row.relationship = row.relationship.split("[REF]." + pkAlias).join(pkAlias);
          }


          updateCell($el, row.index, field, newValue);

          if(field == "fin" && newValue == true){
            GetQuerySubjects(row.pktable_name, row.pktable_alias, "Final", row._id);
            updateCell($datasTable, parentData.index, "linker", true);

          }

          if(field == "ref" && newValue == true){
            GetQuerySubjects(row.pktable_name, row.pktable_alias, "Ref", row._id);
            updateCell($datasTable, parentData.index, "linker", true);
          }


        }

        if(field.match("duplicate")){
          $el.bootstrapTable("filterBy", {});
          nextIndex = row.index + 1;
          console.log("nextIndex=" + nextIndex);
          var newRow = $.extend({}, row);
          newRow.checkbox = false;
          newRow.pktable_alias = "";
          newRow.fin = false;
          newRow.ref = false;
          newRow.relationship = newRow.relationship.replace(/\s{1,}=\s{1,}\[FINAL\]\./g, " = ");
          newRow.relationship = newRow.relationship.replace(/\s{1,}=\s{1,}\[REF\]\./g, " = ");
          newRow.relationship = newRow.relationship.split("[" + row.pktable_alias + "]").join("[]");
          newRow.nommageRep = false;
          if(newRow.key_type == "F"){
            newRow.key_name = "DK_" + newRow.pktable_name + "_" + parentData.table_alias;
            newRow._id = newRow.key_name + "F";
          }
          if(newRow.key_type == "P"){
            newRow.key_name = "DK_" + parentData.table_alias + "_" + newRow.pktable_name;
            newRow._id = newRow.key_name + "P";
          }
          console.log("newRow");
          console.log(newRow);
          $el.bootstrapTable('insertRow', {index: nextIndex, row: newRow});
        }

        if(field.match("remove")){
          $el.bootstrapTable('remove', {
              field: 'index',
              values: [row.index]
          });
        }

      }

  });

  $el.bootstrapTable('hideColumn', '_id');

  if(activeTab == "Reference"){
    $el.bootstrapTable('hideColumn', 'fin');
    $el.bootstrapTable('showColumn', 'ref');
    $el.bootstrapTable('showColumn', 'nommageRep');

  }

  if(activeTab == "Final"){
    $el.bootstrapTable('hideColumn', 'ref');
    $el.bootstrapTable('showColumn', 'fin');
    $el.bootstrapTable('hideColumn', 'nommageRep');
  }

  ApplyFilter();

}

function RemoveKeys(o, qs){

        var indexes2rm = [];
        var row = o;

        var recurse = function(o){
                var tableData = $datasTable.bootstrapTable("getData");
                tableData.forEach(function(e){
                        if(e.linker_ids.indexOf(o._id) > -1){
                                console.log("RemoveKeys _id found: " + o._id + " in QS " + e._id );
                                console.log("RemoveKeys linker_ids.length for QS " + e._id + " is: " + e.linker_ids.length);
                                if(e.linker_ids.length == 1){
                                  console.log("RemoveKeys linker_ids for QS " + e._id + " == 1");
                                  console.log("RemoveKeys linker_ids for QS " + e._id + " relations:");
                                  $.each(e.relations, function(k, v){
                                    console.log(k + " -> " + v);
                                    if(v.fin || v.ref){
                                      console.log("RemoveKeys: " + v._id + " is checked. Recurse...");
                                      return recurse(v);
                                    }
                                  });
                                  indexes2rm.push(e._id);
                                  console.log("RemoveImportedKeys push to indexes2rm: " + e._id);
                                }
                                if(e.linker_ids.length > 1){
                                        e.linker_ids.splice(e.linker_ids.indexOf(o._id), 1);
                                        var newValue = e.linker_ids;
                                        console.log("newValue=" + newValue);
                                        updateCell($datasTable, e.index, "linker_ids", newValue);
                                        console.log("RemoveImportedKeys remove from linker_ids: " + e._id);
                                }
                                // return recurse(tableData[e.index]);
                        }
                        else {
                                return;
                        }
                });
        };
        recurse(o);

        $("#removeKeysModal").modal('toggle');
        $("#removeKeysModal").find('.modal-body').empty();
        var html = '<div class="container-fluid"><div class="row"><div class="list-group">';

        $.each(indexes2rm, function(i, obj){
            html += '<a href="#" class="list-group-item">' + obj + '</a>';
        });
        html += '<div class="list-group"></div></div>';

        $("#removeKeysModal").find('.modal-body').append(html);

        qs2rm.qs = qs;
        qs2rm.row = row;
        qs2rm.qsList = indexes2rm;
        qs2rm.removed = false;

}

function RemoveKeysAccepted(){
  if(qs2rm != undefined && $activeSubDatasTable != undefined){
    console.log("qs2rm.row.index="+qs2rm.row.index);
    console.log("qs2rm.row.fin="+qs2rm.row.fin);
    if(qs2rm.row.fin){
     updateCell($activeSubDatasTable, qs2rm.row.index, "fin", false);
    }
    if(qs2rm.row.ref){
     updateCell($activeSubDatasTable, qs2rm.row.index, "ref", false);
    }

    var linked = false;
    $.each(qs2rm.qs.relations, function(i, obj){
      if(obj.fin || obj.ref){
        linked = true;
      }
    });
    updateCell($datasTable, qs2rm.qs.index, "linker", linked);

    $datasTable.bootstrapTable('remove', {
      field: '_id',
      values: qs2rm.qsList
    });
    qs2rm.removed = true;

  }
  $("#removeKeysModal").modal('toggle');
}

function buildTable($el, cols, data) {

    $el.bootstrapTable({
        columns: cols,
        // url: url,
        // data: data,
        search: false,
				showRefresh: false,
				showColumns: false,
				showToggle: false,
				pagination: false,
				showPaginationSwitch: false,
        idField: "index",
				// toolbar: "#DatasToolbar",
        detailView: true,
        onClickCell: function (field, value, row, $element){

          // RemoveFilter();

          if(field == "visible"){
            var newValue = value == false ? true : false;

            console.log($el.bootstrapTable("getData"));

            console.log("row.index=" + row.index);
            console.log("field=" + field);
            console.log("newValue=" + newValue);

            updateCell($el, row.index, field, newValue);

          }

          if(field.match("addRelation")){
            $el.bootstrapTable('expandRow', row.index);

            console.log("++++++++++++++on passe dans window.operateQSEvents.add");
            if($activeSubDatasTable != undefined){
              $newRowModal.modal('toggle');
              var qs = row.table_alias + ' - ' + row.type + ' - ' + row.table_name;
              // $('#modQuerySubject').selectpicker('val', qs);

              $('#modQuerySubject').text(qs);
              $('#modKeyName').val("CK_");
              $('#modPKTableAlias').val("");
              ChooseField($('#modColumn'), row._id);
            }
          }
          if(field.match("addPKRelation")){
            $el.bootstrapTable('expandRow', row.index);
            GetPKRelations(row.table_name, row.table_alias, row.type);
          }


        },
        onExpandRow: function (index, row, $detail) {
          if(activeTab == "Final" || activeTab == "Reference"){
            expandTable($detail, relationCols, row.relations, row);
          }
          else{
            expandTable($detail, fieldCols, row.fields, row);
          }
        }
    });

    $el.bootstrapTable('hideColumn', 'visible');
    $el.bootstrapTable('hideColumn', 'filter');
    $el.bootstrapTable('hideColumn', 'label');
    $el.bootstrapTable('hideColumn', 'recurseCount');
    $el.bootstrapTable('hideColumn', 'addPKRelation');
    $el.bootstrapTable('hideColumn', '_id');
    $el.bootstrapTable('hideColumn', 'linker');
    $el.bootstrapTable('hideColumn', 'linker_ids');

    console.log("in buildTable: activeTab="+activeTab);
    console.log("in buildTable: previousTab="+previousTab);

    if(activeTab == "Reference"){
    }

    if(activeTab == "Final"){
    }

    if(activeTab == "Query Subject"){
    }

    // ApplyFilter();

}

function updateCell($table, index, field, newValue){

  $table.bootstrapTable("updateCell", {
    index: index,
    field: field,
    value: newValue
  });

}

function updateRow($table, index, row){

  $table.bootstrapTable("updateRow", {
    index: index,
    row: row
  });

}

function AddRow($table, row){

  $table.bootstrapTable("filterBy", {});
	nextIndex = $table.bootstrapTable("getData").length;
	console.log("nextIndex=" + nextIndex);
	$table.bootstrapTable('insertRow', {index: nextIndex, row: row});


}

function GetQuerySubjectsWithPK(){
  GetQuerySubjects(null, null, null, true);
}

function GetPKRelations(table_name, table_alias, type){

  var parms = "table=" + table_name + "&alias=" + table_alias + "&type=" + type;

	console.log("calling GetQuerySubjectsWithPK with: " + parms);

  $.ajax({
    type: 'POST',
    url: "GetPKRelations",
    dataType: 'json',
    data: parms,

    success: function(data) {
			console.log(data);
			if (data.length == 0) {
				showalert("GetPKRelations()", table_name + " has no PK.", "alert-info", "bottom");
				return;
			}

      if($activeSubDatasTable != undefined){
        // console.log("datas");
        // console.log(datas);
        var index;
        var datas = $datasTable.bootstrapTable("getData");
        $.each(datas, function(i, obj){
          // console.log("obj._id");
          // console.log(obj._id);
          if(obj._id == table_alias + type){
            // console.log("hhhhhhhhhhhhhhhhhhhh");
            index = i;
          }
        })
        // console.log("index=" + index);
        var relations = datas[index].relations;
        // console.log("relations");
        // console.log(relations);
        //
        // console.log("data.length=" + data.length)
        $.each(data, function(i, obj){
          if(i < data.length -1){
            relations.push(obj);
          }
          if(i == data.length -1){
            AddRow($activeSubDatasTable, obj);
          }
        });
      }

  	},
      error: function(data) {
          console.log(data);
          showalert("GetPKRelations()", "Operation failed.", "alert-danger", "bottom");
    }

  });

}

function GetQuerySubjects(table_name, table_alias, type, linker_id) {

	var table_name, table_alias, type, linker_id;

  if(linker_id == undefined){
    linker_id = "Root";
  }

	if (table_name == undefined){
		table_name = $tableList.find("option:selected").val();
	}

  console.log("table_name=" + table_name)

  if (table_name == 'Choose a table...' || table_name == '') {
		showalert("GetQuerySubjects()", "No table selected.", "alert-warning", "bottom");
		return;
	}

	if(table_alias == undefined){
		table_alias = $('#alias').val();
	}

	if(type == undefined){
		type = 'Final';
	}

  var qsAlreadyExist = false;

  $.each($datasTable.bootstrapTable("getData"), function(i, obj){
		//console.log(obj.name);
    if(obj._id == table_alias + type){
      qsAlreadyExist = true;
      var newValue = obj.linker_ids;
      newValue.push(linker_id);
      updateCell($datasTable, i, "linker_ids", newValue);

      showalert("GetQuerySubjects()", table_alias + type + " already exists.", "alert-info", "bottom");
    }
  });

  if(qsAlreadyExist){
    return;
  }

	var parms = "table=" + table_name + "&alias=" + table_alias + "&type=" + type + "&linker_id=" + linker_id;

	console.log("calling GetKeys with: " + parms);

  $.ajax({
    type: 'POST',
    url: "GetQuerySubjects",
    dataType: 'json',
    data: parms,

    success: function(data) {
			console.log(data);
			if (data[0].relations.length == 0) {
				showalert("GetQuerySubjects()", table_name + " has no key.", "alert-info", "bottom");
				// return;
			}

			$datasTable.bootstrapTable('append', data);
      datas = $datasTable.bootstrapTable("getData");

  	},
      error: function(data) {
          console.log(data);
          showalert("GetQuerySubjects()", "Operation failed.", "alert-danger", "bottom");
    }

  });

}

function RemoveFilter(){
  $datasTable.bootstrapTable("filterBy", {});
  if($activeSubDatasTable != undefined){
    $activeSubDatasTable.bootstrapTable("filterBy", {});
  }
}

function ApplyFilter(){
  if(activeTab == 'Final'){
    if($activeSubDatasTable != undefined){
      $activeSubDatasTable.bootstrapTable("filterBy", {key_type: 'F'});
    }
  }
}

function ChooseQuerySubject(table) {

	table.empty();

  var data = $datasTable.bootstrapTable("getData");

  $.each(data, function(i, obj){
		//console.log(obj.name);
		table.append('<option class="fontsize">' + obj._id + ' - ' + obj.table_name +'</option>');
  });
  table.selectpicker('refresh');

}

function ChooseTable(table) {

	table.empty();

    $.ajax({
        type: 'POST',
        url: "Scan",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            data.sort(function(a, b) {
              // return parseInt(b.FKCount) - parseInt(a.FKCount);
              return parseInt(b.FKSeqCount) - parseInt(a.FKSeqCount);
            });
            tables = data;
            $.each(data, function(i, obj){
							//console.log(obj.name);
              var option = '<option class="fontsize" value=' + obj.name + '>' + obj.name + ' (' + obj.FKCount + ') (' + obj.FKSeqCount + ')'
               + ' (' + obj.PKCount + ') (' + obj.PKSeqCount + ') (' + obj.RecCount + ')' + '</option>';
							table.append(option);
              // $('#modPKTables').append(option);
              // table.append('<option class="fontsize" value=' + obj.name + '>' + obj.name + '</option>');
			      });
			      table.selectpicker('refresh');
            // $('#modPKTables').selectpicker('refresh');
			  },
        error: function(data) {
            console.log(data);
            showalert("ChooseTable()", "Operation failed.", "alert-danger", "bottom");
        }
		});

}

function ChooseField(table, id){
  table.empty();

  var datas = $datasTable.bootstrapTable('getData');
  $.each(datas, function(i, obj){
    if(obj._id == id){
      console.log("!!!!!!!!!!" + obj._id);
      $.each(obj.fields, function(j, field){
        var icon = "";
        console.log("field.pk="+field.pk);
        if(field.pk){
          icon = "<i class='glyphicon glyphicon-star'></i>";
        }
        table.append('<option class="fontsize" value="' + field.field_name + '" data-subtext="' + icon + '">' + field.field_name + '</option>');
      });
      table.selectpicker('refresh');
    }
  });

  if( table.has('option').length == 0 ) {
    console.log("!!!!!!!!!! NO VALUE FOUND FOR " + id);
    $.ajax({
        type: 'POST',
        url: "GetFields",
        dataType: 'json',
        data: "table=" + id,

        success: function(data) {
            console.log(data);
            var fields = Object.values(data);
            console.log(fields);
            fields.sort(function(a, b) {
              // return parseInt(b.FKCount) - parseInt(a.FKCount);
              return b.PK - a.PK;
            });
            console.log(fields);
            $.each(fields, function(index, detail){
              var icon = "";
              console.log("field.pk="+detail.PK);
              if(detail.PK){
                icon = "<i class='glyphicon glyphicon-star'></i>";
              }
              table.append('<option class="fontsize" value"' + detail.COLUMN_NAME + '" data-subtext="' + icon + '">' + detail.COLUMN_NAME + '</option>');
            });
            table.selectpicker('refresh');
            showalert("ChooseField()", "ChooseField was successfull.", "alert-success", "bottom");
        },
        error: function(data) {
            console.log(data);
            showalert("ChooseField()", "ChooseField failed.", "alert-danger", "bottom");
        }

    });

  }

}

function showalert(title, message, alerttype, area) {

    // $('#alert_placeholder').append('<div id="alertdiv" class="alert ' +
		// alerttype + ' input-sm"><span>' + message + '</span></div>')
    //
    // setTimeout(function() {
    //
    //   $("#alertdiv").remove();
    //
    // }, 2500);

    // if($('#alertmsg').length){
    $('#alertmsg').remove();
    // }

    if(area == undefined){
      area = "top";
    }

    var $newDiv = $('<div/>')
       .attr( 'id', 'alertmsg' )
       .html(
          '<h4>' + title + '</h4>' +
          '<p>' +
          message +
          '</p>'
        )
       .addClass('alert ' + alerttype + ' flyover flyover-' + area);
    $('#alert_placeholder').append($newDiv);

    if ( !$('#alertmsg').is( '.in' ) ) {
      $('#alertmsg').addClass('in');

      setTimeout(function() {
         $('#alertmsg').removeClass('in');
      }, 3200);
    }
}

function TestDBConnection() {

    $.ajax({
        type: 'POST',
        url: "TestDBConnection",
        dataType: 'json',

        success: function(data) {
            console.log(data);
            showalert("TestDBConnection()", "Connection to database was successfull.", "alert-success", "bottom");
        },
        error: function(data) {
            console.log(data);
            showalert("TestDBConnection()", "Connection to database failed.", "alert-danger", "bottom");
        }

    });

}

function OpenSetProjectModal(){

 $projectFileModal.modal('toggle');
}

function SetProjectName(){
  var projectName = $projectFileModal.find('#filePath').val();
  console.log("projectName=" + projectName);
	if (!$.isNumeric(projectName)) {
	    showalert("SetProjectName()", "Enter a numeric value.", "alert-warning", "bottom");
	    return;
  	}
  $.ajax({
		type: 'POST',
		url: "SetProjectName",
		// dataType: 'json',
		data: "projectName=" + "model-" + projectName,

		success: function(data) {
			Publish();
		},
		error: function(data) {
			showalert("SetProjectName()", "Error when setting projectName.", "alert-danger", "bottom");
		}
	});

  $projectFileModal.modal('toggle');
}

function Publish(){
	var data = $datasTable.bootstrapTable('getData');

  if (data.length == 0) {
    showalert("Publish()", "Nothing to publish.", "alert-warning", "bottom");
    return;
  }

	// var objs = [];
  //
	// $.each(data, function(k, v){
	// 	var obj = JSON.stringify(v);
	// 	objs += obj + "\r\n";
	// });

	$.ajax({
		type: 'POST',
		url: "SendQuerySubjects",
		dataType: 'json',
		data: JSON.stringify(data),

		success: function(data) {
			$('#DatasTable').bootstrapTable('load', data);
		},
		error: function(data) {
			showalert("SyncRelations() failed.", "alert-danger");
		}
	});

}

function SaveModel(){

	var data = $datasTable.bootstrapTable('getData');

  if (data.length == 0) {
    showalert("SaveModel()", "Nothing to save.", "alert-warning", "bottom");
    return;
  }

	// var objs = [];
  //
	// $.each(data, function(k, v){
	// 	var obj = JSON.stringify(v);
	// 	objs += obj + "\r\n";
	// });

	$.ajax({
		type: 'POST',
		url: "SaveModel",
		dataType: 'json',
		data: JSON.stringify(data),

		success: function(data) {
			showalert("SaveModel()", "Model saved successfully.", "alert-success", "bottom");
		},
		error: function(data) {
			showalert("SaveModel()", "Saving model failed.", "alert-danger", "bottom");
		}
	});

}

function GetModelList(){

  $modelListModal.modal('toggle');

	$.ajax({
		type: 'POST',
		url: "GetModelList",
		dataType: 'json',

		success: function(data) {
      modelList = data;
      data.sort(function(a, b) {
        return b - a;
      });
      console.log("modelList");
      console.log(modelList);
			showalert("GetModelList()", "Model list get successfull.", "alert-success", "bottom");

		},
		error: function(data) {
			showalert("GetModelList()", "Getting model list failed.", "alert-danger", "bottom");
		}
	});


}

function OpenModel(id){

  var modelName;

  $.each(modelList, function(i, obj){
    if(obj.id == id){
      modelName = obj.name;
    }
  });

  console.log("modelName=" + modelName);

	$.ajax({
		type: 'POST',
		url: "OpenModel",
		dataType: 'json',
    data: "model=" + modelName,

		success: function(data) {
      $datasTable.bootstrapTable("load", data);
			showalert("OpenModel()", "Model opened successfully.", "alert-success", "bottom");

		},
		error: function(data) {
			showalert("OpenModel()", "Opening model failed.", "alert-danger", "bottom");
		}
	});

  $modelListModal.modal('toggle');


}


function Reset() {

	var success = "OK";

	$.ajax({
        type: 'POST',
        url: "Reset",
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
		showalert("Reset()", "Operation failed.", "alert-danger", "bottom");
	}

  // window.location = window.location.href+'?eraseCache=true';
	location.reload(true);

}

function GetTableData(){
		var data = $datasTable.bootstrapTable("getData");
		console.log("data=");
		console.log(JSON.stringify(data));
    console.log(data);

}

function RemoveAll(){
  $datasTable.bootstrapTable("removeAll");
}

function ExpandAll(){
  $datasTable.bootstrapTable('expandAllRows');
}

// function refreshTable($table){
// 	var data = $table.bootstrapTable("getData");
// 	$table.bootstrapTable('load', data);
// }
