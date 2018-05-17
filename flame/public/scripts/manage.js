//     Description    Flame Predict JavaScript 
//
//     Authors:       Manuel Pastor (manuel.pastor@upf.edu)
// 
//     Copyright 2018 Manuel Pastor
// 
//     This file is part of Flame
// 
//     Flame is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation version 3.
// 
//     Flame is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
// 
//     You should have received a copy of the GNU General Public License
//     along with Flame. If not, see <http://www.gnu.org/licenses/>.

//TODO: Remove all development console logs and alerts.
//TODO: Show good results without console logs.


// TODO Show the information of a model
function viewFullInfo() {
    var model = $("#model option:selected").text();

    $.post('/showInfo', { "model": model })


        .done(function (results) {
            console.log(results);
        });
}


/**
 * Summary. Hide all forms
 * Description. Hide the forms when you click on a form 
 * 
 */
function hideAll() {
    $("#importForm").hide("fast");
    $("#addForm").hide("fast");
}
/**
 * Summary. Display the add new model form
 * Description. First hide all forms calling hideAll and display the add new model form
 * 
 */
function displayNewModelForm() {
    $('#add').click(function () {
        hideAll();
        $("#addForm").toggle("fast");
    });
}

/**
 * Summary. Display the import model form
 * Description. First hide all forms calling hideAll and display the import model form
 * 
 */
function displayImportModelForm() {
    $('#import').click(function () {
        hideAll();
        $("#importForm").toggle("fast")
    });
}

// simple utility function to download as a file text generated here (client-side)
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * Summary. Checks if a string is alphanumeric
 * Description. Check if a string is alphanumeric using a regex
 * @param {string} name String to check 
 * 
 * @returns {boolean} true if string is alphanumeric or false otherwise
 */
function alphanumericChecker(name) {
    var letters = /^[A-Za-z0-9]+$/;
    if (name.match(letters)) {
        return true;
    }
    else {
        return false;
    }
}
/**
 * Summary. Check if a model exists
 * Description. check if a model exists calling /dir function
 * @param {string} model String to check 
 * 
 * @returns {boolean} true if model exists or false otherwise
 */
function modelExists(model) {
    console.log(model);
    $.get('/dir', function (result) {
        console.log("im in get");
        //console.log(result)
        parsedResult = JSON.parse(result);
        //console.log(parsedResult);
        for (name in parsedResult) {
            //console.log(parsedResult[name][0]+"/"+model);
            if (model === parsedResult[name][0]) {
                return true;
            }
        }
        return false;
    });
    //return false;
}
/**
 * Summary. Add a model.
 * Description. Add a model and check if it exists and if it is alphanumeric.
 * Depending on the result it shows a message or another.
 * If all is correct the combobox are reloaded to show the new element.
 */
function addModel() {
    var name = $("#name").val(); // value from input
    //console.log(modelExists(name));
    if (alphanumericChecker(name)) {   // passes check
        if (/*modelExists(name)===false*/true) {    //TODO repair modelExists func, it returns undefinded
            $.post('/addModel', { "model": name })
                .done(function (result) {
                    //console.log(result);
                }).fail(function (result) {   // !!! Say that fails but it works 
                    //alert("fail");
                });
            loadTree();
            $("#results").append(" <p class='text-success'>Model added correctly</p>");
        } else {
            $("#results").append(" <p class='text-warning'>The model already exists</p>");
        }
    } else {
        alert("Name must be alphanumeric");
    }
}
/**
 * Summary. Shows a confirm dialog
 * Description. Shows a confirm dialog with a message
 * @param {string} msg message to display 
 * @param {string} model model to display in the message 
 *
 * @returns {boolean} true if user confirms or false otherwise
 */
function confDialog(msg, model) {
    var question = msg + ": " + model + "?";
    if (confirm(question)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Summary. Remove all model family
 * Description. First check if the model that the user wants to remove exists (to prevent DOM modifications), if exists 
 * the app shows a confirm dialog and if the user really wants to delete the family the family is removed.
 * Show the transaction results and updates the main tree
 */
function deleteFamily() {
    var model = $("#hiddenInput").val(); // value from input
    var modelChild = $("#hiddenInputChild").val(); // value from input
    console.log(model);
    console.log(modelExists(model));
    if (confDialog("Remove", model)) {
        if (/*modelExists(model)*/true) {    //TODO repair modelExists func, it returns undefinded
            $.post('/deleteFamily', { "model": model })
                .complete(function (result) {
                    console.log("pass");                // As in add it also says that it fails but it really works
                    loadTree();
                });

            console.log("Family removed");
        }
        else {
            console.log("The model doesnt exist, please update the page");

        }
    }
    else {
        console.log("Aborted");
    }

}
/**
 * Summary. Remove the selected version
 * Description. Shows a confirm dialog and if the user confirm the selected model version is removed.
 * When the transaction is completed it shows the result to the user and relaod the main tree.
 */
//TODO: make it works
function deleteVersion() {
    var model = $("#hiddenInput").val(); // value from input
    var modelChild = $("#hiddenInputChild").val(); // value from input
    if (confDialog("Remove", modelChild)) {
        $.post('/deleteVersion', { "model": model, "version": modelChild })
            .complete(function (result) {
                console.log(result);
                loadTree();
            });
    }
}

/**
 * Summary. Clone the selected model
 * Description. Shows a confirm dialog and if the user confirm the selected model is cloned
 * When the transaction is completed it shows the result to the user and relaod the main tree.
 */
function cloneModel() {
    var model = $("#hiddenInput").val(); // value from input
    if (confDialog("Clone: ", model)) {
        $.post('/cloneModel', { "model": model })
            .complete(function (result) {
                loadTree();
                console.log("cloned");
            });
    }
}

/**
 * Summary. Loads the main tree
 * Description. Loads the main tree with the option provided in the constructor
 */
function loadTree() {
    $.get('/dir').done(function (result) {
        result = JSON.parse(result);
        $('#tree').treeview({
            color: undefined,
            onhoverColor: '#F5F5F5',
            expandIcon: 'fas fa-minus',
            collapseIcon: 'fas fa-plus',
            levels: 0,
            data: result
        });
        selectedNode();
        $("#tree ul").addClass("list-group-flush");
    });
}

/**
 * Summary. Expand all tree nodes
 */
function expandTree() {
    $("#tree").treeview("expandAll", { silent: true });
}

/**
 * Summary. Collapse all tree nodes
 */
function collapseTree() {
    $('#tree').treeview('collapseAll', { silent: true });

}

/**
 * Summary. Clone the selected model
 * Description. Shows a confirm dialog and if the user confirm the selected model is cloned
 * When the transaction is completed it shows the result to the user and relaod the main tree.
 */
function selectedNode() {
    console.log("Now you can select nodes")
    $("#tree").on('nodeSelected', function (getSel, data) {
        console.log(data);
        console.log(data.text);
        parentNode = $('#tree').treeview('getParent', data);
        console.log(parentNode.text);


        // Check if the node selected is father or child
        if (typeof parentNode.text !== 'string') {     //father selected
            console.log("father");
            $("#details").text("Currently working with " + data.text);
            $("#hiddenInput").val(data.text);
            $("#manage").text("Selected model: " + data.text);
            $("#hiddenInputChild").val("");
            $("#manage").addClass("border");
            $("#manage").addClass("rounded");
        } else {                                      //child selected
            console.log("child");
            $("#details").text("Currently working with " + parentNode.text + "." + data.text);
            $("#hiddenInput").val(parentNode.text);
            $("#hiddenInputChild").val(data.text);
            $("#manage").text("Selected model: " + parentNode.text + "." + data.text);
            $("#manage").addClass("border");
            $("#manage").addClass("rounded");
        }
        return data;
    });
}


function importModel() {
    var ifile = document.getElementById("importLabel").files[0];
    if (uploadImport(ifile, uploadModel) == false) {
        $("#data-console").text("unable to upload file, prediction aborted...");
        return;
    };
}

// main

$(document).ready(function () {
    //Reset all inputs
    $("#hiddenInput").val("");
    $("#hiddenInputChild").val("");
    $("#name").val("");
    $("#importLabel").val("");
    //Load the main tree
    loadTree();
    //Hide all forms
    hideAll();
    // Toggles the forms between hide and show
    displayImportModelForm();
    displayNewModelForm();

});