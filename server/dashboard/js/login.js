(function(){

$(document).ready(function(){
	$('#submit').click(function(){
		var login = {
			id : $('#loginid').val(),
			pw : $('#loginpw').val()
		};
		$.post('http://ec2-52-74-127-35.ap-southeast-1.compute.amazonaws.com/api.php', 
			{ cmd: 'adminlogin', login: JSON.stringify(login)}, function(data){
			if(data.Response == "Valid") {
				window.location.href = "/dashboard/main.html";
			}
		});
	});
});



})();