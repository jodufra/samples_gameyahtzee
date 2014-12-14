'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', ['ngSanitize']);


appControllers.controller('TestingNodeController', function($scope,$socket){
	$scope.value = 0;
	$scope.increaseValue = function(){
		Users.create($scope.user).then(function(data)
		{
			console.log(data);
		});
		console.log("create user");
	};
	socket.on('example.update', function (data) {
		$scope.value=JSON.parse(data);
	});
});

appControllers.controller('HomeController', function($scope){});

appControllers.controller('GameLobbyController', function($scope){});

appControllers.controller('CreateGameController', function($scope,CurrentUser){
	$scope.currentUser = CurrentUser.getUser();

	$scope.players=[];
	$scope.getPlayers = function(){
		console.debug($scope.currentUser);
		if($scope.players.length == 0){
			$scope.addCurrentUserAsPlayer();
		}
		var players = "";
		$scope.players.forEach(function(player){
			var template = ''+
			'<div class="list-group-item clearfix" style="padding:0">'+
			'<div class="pull-left text-left">'+
			'<img class="portrait portrait-s" alt="" src="'+player.img+'">'+
			'<span>'+player.name+'</span><div class="pull-right">';
			if(player.user != null && player.user == $scope.currentUser.user_id){
				template += '<span class="glyphicon glyphicon-user text-info" aria-hidden="true"></span>';
			}
			if(player.id == $scope.players[0].id){
				template += '<span class="glyphicon glyphicon-flag text-success" aria-hidden="true"></span>';
			}
			template += '</div></div></div>';
			players += template;
		});
		return players;
	}
	$scope.addPlayer = function(player_id, user_id, user_name, user_portrait){
		$scope.players.push({id:player_id, user:user_id, name:user_name, img:user_portrait});
	}
	$scope.addCurrentUserAsPlayer = function(){
		$scope.addPlayer(1,$scope.currentUser.user_id, $scope.currentUser.username, "invalid url");
	}
	$scope.addRobot = function(){
		var id = $scope.players.length + 1
		var name = "Robot "+id;
		$scope.addPlayer(id,null,name,"../img/bot.png");
	}

});

appControllers.controller('GamePlayController', function($scope, GamePlayPlayers){
	$scope.players=GamePlayPlayers;
	$scope.dices = [];

	//Current Score Snall Table
	$scope.currentScorePlayerNum = 0;
	$scope.currentScorePlayer = $scope.players[$scope.currentScorePlayerNum];
	$scope.previousCurrentScore = function(){
		$scope.currentScorePlayerNum--;
		if($scope.currentScorePlayerNum < 0){
			$scope.currentScorePlayerNum = $scope.players.length-1;
		}
		updateSmallScoreTable();
	};
	$scope.nextCurrentScore = function(){
		$scope.currentScorePlayerNum++;
		if($scope.currentScorePlayerNum >= $scope.players.length ){
			$scope.currentScorePlayerNum = 0;
		}
		updateSmallScoreTable();
	};	
	function updateSmallScoreTable(){
		$scope.currentScorePlayer = $scope.players[$scope.currentScorePlayerNum];
	}

	//Current Player Scores
	$scope.currentPlayerNum = 0;
	$scope.currentPlayer = $scope.players[$scope.currentPlayerNum];

	$scope.roll = function() {
		if ($scope.currentPlayer.rollsAvailable > 0){
			getNewDices();
			updateScore();		
		}
	};

	function getNewDices(){
		$scope.dices = [];
		var max = 5 - $scope.dices.length;
		for (var i = 0; i < max; i++) {
			$scope.dices.push({val:(Math.ceil(Math.random()*6)),saved:false});
		}
		$scope.currentPlayer.rollsAvailable--;

		// Dices.getDices().then(function(data)
		// {
		// 	$scope.dices=data;
		// });
}

function updateScore(){
	var score_indices = ['','ones','twos','threes','fours','fives','sixes'];

	var dices_amount = {
		1:diceCount(1),
		2:diceCount(2),
		3:diceCount(3),
		4:diceCount(4),
		5:diceCount(5),
		6:diceCount(6)
	};
	if(!$scope.currentPlayer.r_score['ones']){
		$scope.currentPlayer.score['ones'] = dices_amount[1];
	}
	if(!$scope.currentPlayer.r_score['twos']){
		$scope.currentPlayer.score['twos'] = dices_amount[2]*2;
	}
	if(!$scope.currentPlayer.r_score['threes']){
		$scope.currentPlayer.score['threes'] = dices_amount[3]*3;
	}
	if(!$scope.currentPlayer.r_score['fours']){
		$scope.currentPlayer.score['fours'] = dices_amount[4]*4;
	}
	if(!$scope.currentPlayer.r_score['fives']){
		$scope.currentPlayer.score['fives'] = dices_amount[5]*5;
	}
	if(!$scope.currentPlayer.r_score['sixes']){
		$scope.currentPlayer.score['sixes'] = dices_amount[6]*6;
	}
	if(!$scope.currentPlayer.r_score['sum']){
		var sum = 0;
		for(var i = 1; i<=6; i++) {
			sum += $scope.currentPlayer.score[score_indices[i]];
		}
		$scope.currentPlayer.score['sum'] = sum;
	}
	if(!$scope.currentPlayer.r_score['bonus']){
		$scope.currentPlayer.score['bonus'] = $scope.currentPlayer.score['sum']>63 ? 35 : 0;
	}
}
function diceCount(value){
	var val = 0;
	$scope.dices.forEach(function (element) {
		val += element.val == value ? 1 : 0;
	});
	return val;
}


});