var chatRef = new Firebase('https://remielevangelio.firebaseio.com/');
	var userdata = { facebook: false };
	$(function () {

        chatRef.onAuth(function globalOnAuth(authData) {

	        if (authData) {
	        	userdata = authData;
	        	console.log(authData);
	        	var picture = userdata.facebook.profileImageURL;
	        	$('.login-div').html('<div class="profilepicturedivprofile inline-block"><img src="'+picture+'" class="profilepic"/></div>Logged in as: <b>'+userdata.facebook.displayName+'</b>');
	        	$('.login-div').append('<br/><a href="javascript: void(0);" onclick="logout()">Logout</a>')
	        } else {
	        	console.log('Not logged in');
	        }

	    });

	});

	$('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
          submitMessage();
        }
    });

	$('a.btn-social').click(function(e) {
		var $currentButton = $(this);
        var provider = $currentButton.data('provider');
        var socialLoginPromise;
        e.preventDefault();

        socialLoginPromise = thirdPartyLogin(provider);
        handleAuthResponse(socialLoginPromise, 'profile');
	});

	$('#submitMessage').click(function() {
		submitMessage();
	});


	chatRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        var name = message.userdata.facebook.displayName;
        var picture = message.userdata.facebook.profileImageURL;
        
		displayChatMessage(name, message.text, picture);

    });

	


	function displayChatMessage(name, text, picture) {
		$('.loading').remove();
        $('<div class="message-item"/>').text(text).prepend($('<b/><br/>').html('<div class="profilepicturediv inline-block"><img src="'+picture+'" class="profilepic"/></div>'+name+': ')).appendTo($('#messagesDiv'));
        $('.message-item').append('<div class="clearfix"></div>');
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
    }

    function thirdPartyLogin(provider) {
        var deferred = $.Deferred();

        chatRef.authWithOAuthPopup(provider, function (err, user) {
            if (err) {
                deferred.reject(err);
            }

            if (user) {
                deferred.resolve(user);
            }
        });

        return deferred.promise();
    }

    function handleAuthResponse(promise, route) {
        $.when(promise)
            .then(function (authData) {

            // route
           	console.log(authData);

        }, function (err) {
            console.log(err);
            // pop up error

        });
    }

    function submitMessage() {
	      var text = $('#messageInput').val();
	      if(userdata.facebook != false) {
	      	if(text != "") {
	      		chatRef.push({userdata: userdata, text: text});
	      	}
	      } else {
	      	$('#messagesDiv').append('<p>Please login first before chatting. :)<p>');
	      	$('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
	      }

	      $('#messageInput').val('');
    }

    function logout() {
    	chatRef.unauth();
    	window.location.reload(true);
    }