var UI = (function(){

	var that = {};
	var stats = {
	  health: $("#health"),
	  summoners: $("#summoners"),
	  plus_one: $("#plus_one"),
	  time: $("#time"),
	  score: $("#score"),
	  deaths: $("#deaths")
	};

	$("#intro").show();
	$("#intro a").click(function(e){
	  e.stopPropagation();
	  $("#intro").fadeOut();
	  if(!config.grading){
	  	startTheGame();
	  }
	  else{
	  	$("#email").show();
	  }
	});


	$("#email a").click(function(e){
	  e.stopPropagation();
	  if(!config.grading){
	  	return;		
	  }
	  mode = Math.floor(Math.random() * 3);//LOLOLOL
	  var email = $("#email_input").val().trim();
	  //check if they entered in en email
	  if(email == ""){
	    var r = confirm("Are you sure you want to skip the email?")
	    if(r) startTheGame();
	  }
	  else{

	    //ajax request to store this
	    $.ajax({
	      url: "record.php",
	      method: "post",
	      data: {
	        record: "start",
	        email: $("#email_input").val().trim()
	      },
	      async: true,
	      success: function(resp){
	        console.log("Complete");
	        console.log(resp);
	      }

	    })
	    startTheGame();
	  }
	})

	$("#death a").click(function(e){
	  e.stopPropagation();
	  startLevel(level);
	  feedback.deaths += 1;
	  paused = false;
	  $("#death").hide();
	});
	$("#next_level a").click(function(e){
	  e.stopPropagation();
	  startLevel(level + 1);
	  paused = false;
	  $("#next_level").hide();
	});

	that.showLevelScreen = function(){
	  paused = true;
	  function starGen(root){
	  	if(!config.grading){
	  		root.hide();
	  		return;
	  	}
	    root.empty();
	    var v = Math.floor(Math.random() * 2);//0 or 1
	    if(mode == 1){
	      v += 2;
	    }
	    if(mode == 2){
	      v += 3;
	    }
	    for(var i = 0; i < v; i++){
	      root.append("<img src='img/star-filled.png' />");
	    }
	    for(var i = v; i < 4; i++){
	      root.append("<img src='img/star-unfilled.png' />");
	    }
	  }

	  $("#lnum").html(level);

	  var nl = $("#next_level");
	  var row = nl.find("[data-tag=kills]");
	  row.find(".value").html(feedback.num_hit);
	  starGen(row.find(".stars"));

	  row = nl.find("[data-tag=accuracy]");
	  if(feedback.num_fired > 0){
	    row.find(".value").html(Math.round((feedback.num_hit / feedback.num_fired) * 100) + "%");
	  }
	  starGen(row.find(".stars"));

	  row = nl.find("[data-tag=time]");
	  row.find(".value").html(Math.round(feedback.time/1000) + " seconds");
	  starGen(row.find(".stars"));

	  if(feedback.deaths > 0){
	    row = nl.find("[data-tag=deaths]").show();
	    row.find(".value").html(feedback.deaths);
	    starGen(row.find(".stars"));
	  }
	  else{
	    nl.find("[data-tag=deaths]").hide();
	  }
	  if(!config.grading){
	  	nl.find(".grade").hide();
	  }
	  var grades= ["F", "C", "A"];
	  //grade is always an F LOLOL
	  nl.find(".grade .value").html(grades[mode]);
	  nl.find(".grade .value").attr("data-grade", grades[mode].toLowerCase());
	  
	  nl.fadeIn();
	  nl.find(".continue").hide();
	  window.setTimeout(function(){nl.find(".continue").fadeIn();}, 1000);
	}

	that.updateStats = function(){
	  if(dGotten){
	    dGotten = false;
	    stats.plus_one.show().animate({
	      "bottom": "180",
	      "opacity": "0"
	    }, 1000, "linear", function(){
	      $(this).css({
	      "bottom": "50px",
	      "opacity": "1"
	      }).hide();//reset
	    })
	  }
	  stats.health.find(".fill").css({
	    width : (pl.health * 3) + "px",
	    background: "rgb(" + Math.round((255/100) *(100 - pl.health)) + "," + Math.round((255/100) * pl.health) + ",0)"
	  });
	  stats.summoners.html(dMeter + " of " + dNeeded);
	  stats.time.html(Math.round(feedback.time / 1000));
	  stats.score.html(feedback.score);
	  stats.deaths.html(feedback.deaths);
	}

	return that;
}());