// jQuery Document
$(document).ready(function() {
    // Do some initial setup
    getName();
    buildMessages();
    
    // poll for new messages every 2.5 seconds
    var msgInterval = setInterval(buildMessages, 2500);
    
    
    // Register event handlers
    $("#post-name").click(function() {
        postName();
    });
    
    // Set the user to empty string
    $("#logout").click(function() {
        logout();
    });

    // Stop polling for messages.  You will hvave to reload the
    // page to start polling again.
    $("#pause").click(function() {
        var exit = confirm("Are you sure you want to end the session?");
        if (exit == true) {
            clearInterval(msgInterval);
        }
    });

    // When the user enters a message send it to the server
    // The format of the message is: "username: message"
    // where username can be found in the content of the HTML
    // element of class "name", and the message comes from
    // the input text value.
    // Send it using a post message to "addmsg"
    $("#submitmsg").click(function() {
        // TODO : complete this function according to the comments above
        //Note for myself:  use  $().html()   instead of $().innnerHTML()  which is for javaScript.
        console.log(Date($.now()));
        var temp = Date($.now()) + $('.name').html() + ' : '; 
        //Note for myself: get the value of the input element using jQuery..
        temp += $("#usermsg").val(); 
        console.log(temp);
        $.ajax({
            url:'/addmsg',
            type:'POST',
            datatype: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( { "text": temp } ),
            });
        

        // one way of indicating that default browser actions should not
        // be taken after this handler completes.
        return false;
    });
    
    // Get the user name from the server by making an
    // ajax GET request to the url "/name"
    // The callback function on success will call updateUI
    // with the new value for name
    function getName() {
        // TODO : complete this function according to the comments above
        $.get("/name", function(response){
            var name = response['name'];
            console.log(response['name']);
            updateUI(name);
         })
    }
    
    // Send the user name to the server
    function postName() {
        var name = $("#user-name").val();

        // Clear the text field
        $("#user-name").val("");

        $.ajax({
            url: "/name",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( { "name": name } ),
            success: function(response) {
                var name = response['name'];
                updateUI(name);
            }
        });
    }

    // Set the user name to empty
    function logout() {
        $.get("/logout", function(data) {
            updateUI("");
        });
    }

    // If the user has not entered a name show the name entry input
    // Otherwise display the name
    function updateUI(name) {
        $(".name").html(name);
        if (name !== '') {
            $("#name-form").hide();
        } else {
            $("#name-form").show();
        }
    }

    // Get list of messages to display in the chat box
    function buildMessages() {
        $.get('messages', function(data) {
            let parent = $('#chatbox');
            parent.empty();

            let messages = JSON.parse(data);
            for (let i = 0; i < messages.length; i++) {
                let tmp = $('<p>').text(messages[i]);
                parent.append(tmp);
            }
        });
    }
    
});
