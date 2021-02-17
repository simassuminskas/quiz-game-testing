var game = require('./lib/game.js');
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;
var rounds = 10;
var maxUsers = 100;
var admin;
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});
app.use(express.static(path.join(__dirname, 'public')));
io.on('connection', (socket) => {
  //console.log(socket.id);
	var addedUser = false;
  socket.on('adminLogin', (data) => {
    var message = JSON.parse(data);
    //if ((message['password'] == 'Password123') && (admin == undefined))
    if (message['password'] == 'Password123')/*tmp_code*/
    {
      admin = socket.id;
      message['password'] = undefined;
      message['rooms'] = game.rooms;
      message['questions'] = game.questions;
      socket.emit('adminLogged', message);
    }
    else
    {
      socket.emit('error', {});
    }
    //message['password'] = undefined;
    //socket.emit('adminLogged', message);
    console.log(socket.id);
  });
	socket.on('new message', (data) => {
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		});
	});
	socket.on('update', (data) => {
    console.log(socket.id);
		var message = JSON.parse(data);
		console.log('Line 45: ');
    console.log(message['roomCode']);
    console.log(message['roomCode'].length);
		var private = false;
		var flagAddRoom = false;
		//if ((message['userName'].split('_').length < 1) || (message['userName'].split('_')[message['userName'].split('_').length - 1] == ''))
    if (
      (message['roomCode'] == '')
    )
		{//Código no especificado
      console.log('Line 41.');
			if (game.searchRoomCode('') != -1)
			{
				index = game.searchRoomCode('');
				message['roomCode'] = game.rooms[game.searchRoomCode('')]['roomCode'];
			}
			else
			{
				message['roomCode'] = game.generateRoomCode();
				flagAddRoom = true;
			}
			//game.extractUserName(message);
		}
		else
		{
			//message['roomCode'] = message['userName'].split('_')[message['userName'].split('_').length - 1];
			//game.extractUserName(message);
			if (message['roomCode'] != 'private')
			{
				if (game.searchRoomCode(message['roomCode']) != -1)
				{
					index = game.searchRoomCode(message['roomCode']);
				}
				else
				{//Pendiente hacer visible el error.
					message['type'] = 'error';
					message['error'] = 'Error: The code \'' + message['roomCode'] + '\' was not found.';
				}
			}
			else
			{
				message['roomCode'] = game.generateRoomCode();
				flagAddRoom = true;
				private = true;
			}
		}
		if (flagAddRoom)
		{
			//console.log('Añadiendo: ' + socket.id);
			game.rooms.push({
				'roomCode' : message['roomCode'], 
				'users' : [{'userName' : message['userName'], 'userSurname' : message['userSurname'], 'userType' : undefined, 'votes' : 0, 'vote' : false}], 
				'usersIds' : [socket.id], 
				'usersPoints' : [0], 
				'usersTurns' : [{'userName' : message['userName'], 'userSurname' : message['userSurname'], 'userType' : undefined, 'votes' : 0, 'vote' : false}], 
				'usersUsed' : [], 
				'private' : private, 
				'full' : false, 
				'round' : [1, rounds], 
        'teams' : []
			});
      console.log(game.rooms[game.rooms.length - 1]['users']);
			message['usersInRoom'] = [...game.rooms[game.rooms.length - 1]['users']];
      message['requestTeamName'] = true;
		}
		else
		{
			if (index != undefined)
			{
        var flag = false;
        for (var i = 0; i < game.rooms[index]['users'].length; i++)
        {
          if ((game.rooms[index]['users'][i]['userName'] == message['userName']) && 
            (game.rooms[index]['users'][i]['userSurname'] == message['userSurname']))
          {
            message['type'] = 'error';
            message['error'] = 'Error: The player \'' + message['userName'] + '\' is in the game.';
            flag = true;
            i = game.rooms[index]['users'].length;
          }
        }
				if (!flag)
				{
					if ((message['userName'] != undefined) && (message['userName'] != '') && 
            (message['userSurname'] != undefined) && (message['userSurname'] != ''))
					{
            //Pendiente ver si sobran datos en el JSON.
						game.rooms[index]['users'].push({'userName' : message['userName'], 'userSurname' : message['userSurname'], 'userType' : message['userType'], 'votes' : 0, 'vote' : message['vote']});
						if (game.rooms[index]['users'].length == maxUsers)
						{console.log('Line 132.');
							game.rooms[index]['full'] = true;
						}
            game.rooms[index]['usersIds'].push(socket.id);
						game.rooms[index]['usersPoints'].push(0);
						message['usersInRoom'] = [...game.rooms[index]['users']];
						if (game.rooms[index]['selectedUser'] == '')
						{//Esto se haría al principio.
							game.rooms[index]['usersUsed'] = [];
							game.rooms[index]['round'] = [1, rounds];
							game.rooms[index]['usersTurns'] = [...game.usersInRoom(game.rooms[index]['roomCode'], game.rooms[index]['usersUsed'])];
							if (game.rooms[index]['usersTurns'].length)
							{
								game.rooms[index]['selectedUser'] = game.rooms[index]['usersTurns'][Math.floor(Math.random() * Math.floor(game.rooms[index]['usersTurns'].length))];
								game.rooms[index]['usersUsed'].push(game.rooms[index]['selectedUser']);
								game.rooms[index]['usersTurns'] = [...game.usersInRoom(game.rooms[index]['roomCode'], game.rooms[index]['usersUsed'])];

								message['selectedUser'] = game.rooms[index]['selectedUser'];
								/*var aux = [];
								while (aux.length < 5)
								{
									var w = words[(Math.floor(Math.random() * Math.floor(words.length)))];
									if (aux.indexOf(w) == -1)
									{
										aux.push(w);
									}
								}
								message['words'] = aux;*/
								message['round'] = [...game.rooms[index]['round']];
							}
						}
					}
				}
			}
		}
    message['rooms'] = game.rooms;
    socket.emit('update', message);
    socket.broadcast.emit('update', message);
	});
  socket.on('newTeamName', (data) => {
    var message = JSON.parse(data);
    index = game.searchRoomCode(message['roomCode'], false);
    //index2 = game.searchUserInTeam(message['userName'], message['userSurname'], message['teamName'], index);
    index2 = game.searchTeam(message['teamName'], index);
    if (index2 == -1)
    {//Se debe agregar el team a la sala y al usuario.
      game.rooms[index]['teams'].push({//Pendiente ver que no se repita el nombre.
        'teamName' : message['teamName'], 
        'users' : [
          {
            'userName' : message['userName'], 
            'userSurname' : message['userSurname'], 
            'votes' : 0, 
            'vote' : message['vote']
          }
        ], 
        'sendedQuestions' : {
          'area1' : [], 
          'area2' : [], 
          'area3' : []
        }, 
        'scoreArea1' : 0, 
        'scoreArea2' : 0, 
        'scoreArea3' : 0
      });
      message['teamOk'] = true;
      message['rooms'] = game.rooms;
      socket.emit('newTeamName', message);
      socket.broadcast.emit('newTeamName', message);
    }
  });
  socket.on('joinTeam', (data) => {
    var message = JSON.parse(data);
    index = game.searchRoomCode(message['roomCode'], false);
    //index2 = game.searchUserInTeam(message['userName'], message['userSurname'], message['teamName'], index);
    index2 = game.searchTeam(message['teamName'], index);
    /*type: 'joinTeam',
      userName: userName, 
      userSurname: userSurname, 
      teamName: teams[index]['teamName'], 
      roomCode: roomCode*/
    if (index2 != -1)
    {//
      game.rooms[index]['teams'][index2]['users'].push({
        'userName' : message['userName'], 
        'userSurname' : message['userSurname'], 
        'votes' : 0, 
        'vote' : message['vote']
      });
      message['rooms'] = game.rooms;
      socket.emit('joinTeam', message);
      socket.broadcast.emit('joinTeam', message);
    }
  });
  socket.on('voteLeader', (data) => {//Pendiente asegurarse de que no pueda votar sin estar en ese team.
    var message = JSON.parse(data);
    index = game.searchRoomCode(message['roomCode'], false);
    index2 = game.searchTeam(message['teamName'], index);
    /*type: 'voteLeader',
    userNameVoted: userNameVoted, 
    userSurnameVoted: userSurnameVoted, 
    userNameVoting: userNameVoting, 
    userSurnameVoting: userSurnameVoting, 
    teamName: teams[teamIndex]['teamName'], 
    roomCode: roomCode*/
    if (index2 != -1)
    {//
      console.log(message['userNameVoting'], message['userSurnameVoting']);
      for (var i = 0; i < game.rooms[index]['teams'][index2]['users'].length; i++)
      {
        if ((game.rooms[index]['teams'][index2]['users'][i]['userName'] == message['userNameVoting']) && 
          (game.rooms[index]['teams'][index2]['users'][i]['userSurname'] == message['userSurnameVoting']))
        {
          game.rooms[index]['teams'][index2]['users'][i]['vote'] = true;
          console.log(game.rooms[index]['teams'][index2]['users'][i]['userName'] + ' ' + game.rooms[index]['teams'][index2]['users'][i]['userSurname'] + ' ha votado.');
        }
        if ((game.rooms[index]['teams'][index2]['users'][i]['userName'] == message['userNameVoted']) && 
          (game.rooms[index]['teams'][index2]['users'][i]['userSurname'] == message['userSurnameVoted']))
        {
          game.rooms[index]['teams'][index2]['users'][i]['votes'] += 1;
          console.log(game.rooms[index]['teams'][index2]['users'][i]['userName'] + ' ' + game.rooms[index]['teams'][index2]['users'][i]['userSurname'] + ' tiene ' + game.rooms[index]['teams'][index2]['users'][i]['votes'] + ' votos.');
        }
      }
      var votationComplete = true;
      for (var i = 0; i < game.rooms[index]['teams'][index2]['users'].length; i++)
      {//Ver si ya votaron todos en el team.
        if (!game.rooms[index]['teams'][index2]['users'][i]['vote'])
        {
          votationComplete = false;
          i = game.rooms[index]['teams'][index2]['users'].length;
        }
      }
      if (votationComplete)
      {//Ver si hay algún ganador.
        console.log('Todos votaron en el equipo: ' + game.rooms[index]['teams'][index2]['teamName']);
        var maxVotesIndex = 0;
        for (var i = 1; i < game.rooms[index]['teams'][index2]['users'].length; i++)
        {
          if (game.rooms[index]['teams'][index2]['users'][i]['votes'] > game.rooms[index]['teams'][index2]['users'][maxVotesIndex]['votes'])
          {
            maxVotesIndex = i;
          }
        }
        for (var i = 0; i < game.rooms[index]['teams'][index2]['users'].length; i++)
        {
          if ((game.rooms[index]['teams'][index2]['users'][i]['votes'] == game.rooms[index]['teams'][index2]['users'][maxVotesIndex]['votes']) && (i != maxVotesIndex))
          {
            maxVotesIndex = -1;
            i = game.rooms[index]['teams'][index2]['users'].length;
          }
        }
        if (maxVotesIndex != -1)
        {//Hay un ganador.
          console.log(game.rooms[index]['teams'][index2]['users'][maxVotesIndex]['userName'] + ' ' + game.rooms[index]['teams'][index2]['users'][maxVotesIndex]['userSurname'] + ' es el lider del equipo: ' + game.rooms[index]['teams'][index2]['teamName']);
          game.rooms[index]['teams'][index2]['users'][maxVotesIndex]['leader'] = true;
          var allUsersInTeams = true;
          var allUsersVoted = true;
          for (var i = 0; i < game.rooms[index]['users'].length; i++)
          {
            var found = false;
            for (var j = 0; j < game.rooms[index]['teams'].length; j++)
            {
                for (var k = 0; k < game.rooms[index]['teams'][j]['users'].length; k++)
                {
                    if (!game.rooms[index]['teams'][j]['users'][k]['vote'])
                    {
                      allUsersVoted = false;
                    }
                    if ((game.rooms[index]['teams'][j]['users'][k]['userName'] == game.rooms[index]['users'][i]['userName']) || 
                        (game.rooms[index]['teams'][j]['users'][k]['userSurname'] == game.rooms[index]['users'][i]['userSurname']))
                    {
                        found = true;
                    }
                }
            }
            if (!found)
            {
              allUsersInTeams = false;
            }
          }
          if (allUsersInTeams && allUsersVoted)
          {
            //Hay que lanzar el dado.
            //Pendiente ver si se puede optimizar. Buscar rolledDice.
            for (var i = 0; i < game.rooms[index]['teams'].length; i++)
            {
              for (var j = 0; j < game.rooms[index]['teams'][i]['users'].length; j++)
              {
                game.rooms[index]['teams'][i]['users'][j]['rolledDice'] = false;
              }
            }
            for (var i = 0; i < game.rooms[index]['teams'].length; i++)
            {
              for (var j = 0; j < game.rooms[index]['teams'][i]['users'].length; j++)
              {
                if (!game.rooms[index]['teams'][i]['users'][j]['rolledDice'])
                {
                  message['userName'] = game.rooms[index]['teams'][i]['users'][j]['userName'];
                  message['userSurname'] = game.rooms[index]['teams'][i]['users'][j]['userSurname'];
                  message['rooms'] = game.rooms;
                  socket.emit('startGame', message);
                  socket.broadcast.emit('startGame', message);
                  //Es necesario detener el bucle para que tire de a uno a la vez.
                  j = game.rooms[index]['teams'][i]['users'].length;
                }
              }
            }
            //message['rooms'] = game.rooms;
          }
          else
          {
            message['rooms'] = game.rooms;
            socket.emit('voteLeader', message);
            socket.broadcast.emit('voteLeader', message);
          }
        }
        else
        {
          message['rooms'] = game.rooms;
          socket.emit('voteLeader', message);
          socket.broadcast.emit('voteLeader', message);
        }
      }
    }
  });
  socket.on('rollingDice', (data) => {
    var message = JSON.parse(data);
    var index = game.searchRoomCode(message['roomCode'], false);
    if (index != -1)
    {
      for (var i = 0; i < game.rooms[index]['teams'].length; i++)
      {
        if (game.rooms[index]['teams'][i]['teamName'] == message['teamName'])
        {
          for (var j = 0; j < game.rooms[index]['teams'][i]['users'].length; j++)
          {
            if ((game.rooms[index]['teams'][i]['users'][j]['userName'] == message['userName']) && 
                (game.rooms[index]['teams'][i]['users'][j]['userSurname'] == message['userSurname']))
            {
              game.rooms[index]['teams'][i]['users'][j]['rolledDice'] = true;
              j = game.rooms[index]['teams'][i]['users'].length;
            }
          }
        }
      }
      var area = Math.floor(Math.random() * Math.floor(3)) + 1;
      area = 3;//tmp_code
      if (area == 1)
      {//Enviar de a una pregunta.
        for (var i = 0; i < game.rooms[index]['teams'].length; i++)
        {
          if (game.rooms[index]['teams'][i]['teamName'] == message['teamName'])
          {
            var allSended = true;
            for (var j = 0; j < game.questions['area' + area].length; j++)
            {
              var sended = false;
              for (var k = 0; k < game.rooms[index]['teams'][i]['sendedQuestions']['area' + area].length; k++)
              {
                if (game.rooms[index]['teams'][i]['sendedQuestions']['area' + area][k]['question'] == game.questions['area' + area][j]['question'])
                {
                  sended = true;
                  k = game.rooms[index]['teams'][i]['sendedQuestions']['area' + area].length;
                }
              }
              if (!sended)
              {
                allSended = false;
                game.rooms[index]['teams'][i]['sendedQuestions']['area' + area].push({
                  'question' : game.questions['area' + area][j]['question'], 
                  'finalAnswer' : '', 
                  'otherAnswers' : [], 
                  'evaluation' : []
                });
                for (var k = 0; k < game.rooms[index]['teams'][i]['users'].length; k++)
                {//Se "recicla" esa variable para usarla en la votación de respuestas en vez de la elección del líder.
                  game.rooms[index]['teams'][i]['users'][k]['vote'] = false;
                }
                message['question'] = game.questions['area' + area][j];
                message['rooms'] = game.rooms;
                message['area'] = area;
                //message['teamName'] = game.rooms[index]['teams'][i]['teamName'];
                socket.emit('question', message);
                socket.broadcast.emit('question', message);
                j = game.questions['area' + area].length;
              }
            }
            i = game.rooms[index]['teams'].length;
          }
        }
      }
      if (area == 2)
      {
        for (var i = 0; i < game.rooms[index]['teams'].length; i++)
        {
          if (game.rooms[index]['teams'][i]['teamName'] == message['teamName'])
          {
            message['question'] = game.questions['area2'][Math.floor(Math.random() * Math.floor(game.questions['area2'].length))];
            message['rooms'] = game.rooms;
            message['area'] = area;
            socket.emit('questionArea2', message);
            socket.broadcast.emit('questionArea2', message);
            i = game.rooms[index]['teams'].length;
          }
        }
      }
      if (area == 3)
      {//Enviar risks y oportunities. .
        for (var i = 0; i < game.rooms[index]['teams'].length; i++)
        {
          if (game.rooms[index]['teams'][i]['teamName'] == message['teamName'])
          {
            var type = 'risk';
            if (Math.floor(Math.random() * Math.floor(2)))
            {
              type = 'oportunity';
            }
            var ro = game['area3'][type][Math.floor(Math.random() * Math.floor(game['area3'][type].length))];
            game.rooms[index]['teams'][i]['scoreArea3'] += ro['score'];
            message['ro'] = ro;
            message['type'] = type;
            message['rooms'] = game.rooms;
            message['area'] = area;
            socket.emit('ro', message);
            socket.broadcast.emit('ro', message);
            i = game.rooms[index]['teams'].length;

            //Hay que lanzar el dado.
            for (var j = 0; j < game.rooms[index]['teams'][i]['users'].length; j++)
            {
              if (!game.rooms[index]['teams'][i]['users'][j]['rolledDice'])
              {
                message['userName'] = game.rooms[index]['teams'][i]['users'][j]['userName'];
                message['userSurname'] = game.rooms[index]['teams'][i]['users'][j]['userSurname'];
                socket.emit('startGame', message);
                socket.broadcast.emit('startGame', message);
                //Es necesario detener el bucle para que tire de a uno a la vez.
                j = game.rooms[index]['teams'][i]['users'].length;
              }
            }
          }
        }
      }
    }
  });
  socket.on('allUsersVotation', (data) => {
    var message = JSON.parse(data);
    console.log(message);
    var index = game.searchRoomCode(message['roomCode'], false);
    if (index != -1)
    {
      //game.rooms[index]['teams'][i]['sendedQuestions'].push(game.questions['area' + data['area']][j]['question']);
      for (var i = 0; i < game.rooms[index]['teams'].length; i++)
      {
        if (game.rooms[index]['teams'][i]['teamName'] == message['teamName'])
        {
          var allUsersVoted = true;
          for (var k = 0; k < game.rooms[index]['teams'][i]['users'].length; k++)
          {//Se "recicla" esa variable para usarla en la votación de respuestas en vez de la elección del líder.
            if ((game.rooms[index]['teams'][i]['users'][k]['userName'] == message['userName']) && 
                (game.rooms[index]['teams'][i]['users'][k]['userSurname'] == message['userSurname']))
            {
              game.rooms[index]['teams'][i]['users'][k]['vote'] = true;
            }
            if (game.rooms[index]['teams'][i]['users'][k]['vote'])
            {
              console.log(game.rooms[index]['teams'][i]['users'][k]['userName'] + ' ' + game.rooms[index]['teams'][i]['users'][k]['userSurname'] + ' eligió una respuesta.');
            }
            if ((!game.rooms[index]['teams'][i]['users'][k]['vote']) && (!game.rooms[index]['teams'][i]['users'][k]['leader']))
            {
              allUsersVoted = false;
            }
          }
          /*"question" : question, 
          "answer" : answer, 
          "area" : area, */
          //var index2 = -1;
          console.log('Pregunta: ' + message['question']);
          for (var j = 0; j < game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']].length; j++)
          {
            if (game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['question'] == message['question'])
            {//Se encontró la pregunta.
              //message['question']['options'] = game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['options'];//?
              //index2 = j;
              //if (game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['otherAnswers'].length)
              //{//Esa pregunta tiene al menos respuesta registrada.
              var found = false;
              for (var k = 0; k < game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['otherAnswers'].length; k++)
              {
                if (game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['otherAnswers'][k]['answer'] == message['answer'])
                {//Alguien ya eligió esa repuesta préviamente
                  game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['otherAnswers'][k]['votes'] += 1;
                  found = true;
                }
              }
              if (!found)
              {//Nadie eligió esa repuesta préviamente.
                console.log('No estaba: ' + message['answer']);
                game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['otherAnswers'].push({
                  'answer' : message['answer'], 
                  'votes' : 1
                });
              }
              else
              {
                console.log('Ya estaba: ' + message['answer']);
                /*game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['otherAnswers'].push({
                  'answer' : message['answer'], 
                  'votes' : 1
                });*/
              }
            }
          }
          /*game.rooms[index]['teams'][i]['sendedQuestions']['area' + area].push({
            'question' : game.questions['area' + area][j]['question'], 
            'finalAnswer' : '', 
            'otherAnswers' : []
          });*/
          message['rooms'] = game.rooms;
          //message['area'] = data['area'];
          if (allUsersVoted)
          {//Tiene que decidir el líder.//Falta pasarle las opciones.

            //message['question'] = game.questions['area' + area][j];
            console.log(message['area']);
            for (var j = 0; j < game.questions['area' + message['area']].length; j++)
            {
              if (game.questions['area' + message['area']][j]['question'] == message['question'])
              {
                message['question'] = game.questions['area' + message['area']][j];
              }
            }
            socket.emit('leaderVotation', message);
            socket.broadcast.emit('leaderVotation', message);
          }
          else
          {//Para informar al admin sobre el estado de la votación.
            socket.emit('allUsersVotationAdmin', message);
            socket.broadcast.emit('allUsersVotationAdmin', message);
          }
        }
      }
      //message['voteAnswerAllTeam'] = game.questions['area' + data['area']][j];
      //socket.emit('question', message);
      //socket.broadcast.emit('voteAnswerAllTeam', message);
    }
  });
  socket.on('leaderVotation', (data) => {
    var message = JSON.parse(data);
    var index = game.searchRoomCode(message['roomCode'], false);
    if (index != -1)
    {
      //game.rooms[index]['teams'][i]['sendedQuestions'].push(game.questions['area' + data['area']][j]['question']);
      for (var i = 0; i < game.rooms[index]['teams'].length; i++)
      {
        if (game.rooms[index]['teams'][i]['teamName'] == message['teamName'])
        {
          for (var k = 0; k < game.rooms[index]['teams'][i]['users'].length; k++)
          {
            if ((game.rooms[index]['teams'][i]['users'][k]['userName'] == message['userName']) && 
                (game.rooms[index]['teams'][i]['users'][k]['userSurname'] == message['userSurname']))
            {
              game.rooms[index]['teams'][i]['users'][k]['vote'] = true;
            }
          }
          if (message['answer'] != 'no mutual agreement')
          {
            for (var j = 0; j < game.questions['area' + message['area']].length; j++)
            {//console.log(game.questions['area' + message['area']][j]['question'], message['question']);
              if (game.questions['area' + message['area']][j]['question'] == message['question'])
              {//console.log('Line 541.');
                for (var k = 0; k < game.questions['area' + message['area']][j]['options'].length; k++)
                {//console.log(game.questions['area' + message['area']][j]['options'][k]['option'], message['answer']);
                  if (game.questions['area' + message['area']][j]['options'][k]['option'] == message['answer'])
                  {//Pendiente ver por qué no llega a este punto.
                    game.rooms[index]['teams'][i]['scoreArea' + message['area']] += game.questions['area' + message['area']][j]['options'][k]['score'];
                    k = game.questions['area' + message['area']][j]['options'].length;
                  }
                }
                j = game.questions['area' + message['area']].length;
              }
            }
          }
          else
          {//-600 puntos
            game.rooms[index]['teams'][i]['scoreArea' + message['area']] -= 600;
            //game.rooms[index]['teams'][i]['scoreArea' + message['area']]
          }
          for (var j = 0; j < game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']].length; j++)
          {
            if (game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['question'] == message['question'])
            {//Pregunta actual encontrada en sendedQuestions.
              game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['finalAnswer'] = message['answer'];
            }
          }
          //Sigue la evaluación con input range 1-5.
          message['rooms'] = game.rooms;
          socket.emit('personalEvaluation', message);
          socket.broadcast.emit('personalEvaluation', message);
        }
      }
    }
  });
  socket.on('personalEvaluation', (data) => {//input range
    var message = JSON.parse(data);
    var index = game.searchRoomCode(message['roomCode'], false);
    if (index != -1)
    {
      //game.rooms[index]['teams'][i]['sendedQuestions'].push(game.questions['area' + data['area']][j]['question']);
      for (var i = 0; i < game.rooms[index]['teams'].length; i++)
      {
        if (game.rooms[index]['teams'][i]['teamName'] == message['teamName'])
        {console.log('Line 580.');//Pendiente ver si es necesario omitir al lider en esta parte.
          /*"question" : question, 
          "answer" : answer, 
          "area" : area, 
          "evaluation" : parseInt(document.getElementById('personalEvaluationRange').value) + 1, 
          "roomCode" : roomCode*/
          console.log(message);
          for (var j = 0; j < game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']].length; j++)
          {console.log(game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['question'], message['question']);
            if (game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['question'] == message['question'])
            {console.log('Line 589.');//Pregunta actual encontrada en sendedQuestions.
              //game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['finalAnswer']
              //Ver por qué no llega a este punto.
              game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['evaluation'].push({
                'evaluation' : message['evaluation'], 
                'userName' : message['userName'], 
                'userSurname' : message['userSurname']
              });
            }
          }
          //socket.emit('personalEvaluationAdmin', message);
          /*var allUsers = true;
          for (var j = 0; j < game.rooms[index]['teams'][i]['users'].length; j++)
          {
            //var found = false;
            for (var k = 0; k < game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j].length; k++)
            {
              if (game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j][k]['evaluation']['userName'] == )
              {}
              //game.rooms[index]['teams'][i]['users']
              //game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][j]['evaluation'][i]
            }
          }
          if (allUsers)
          {//Evaluaron todos. Ver si respondieron todas las preguntas del área 1.
            //
          }*/
          message['rooms'] = game.rooms;
          var size = game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']].length;
          console.log('Line 616.');
          console.log(size, game.questions['area' + message['area']].length);
          console.log(game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][size - 1]['evaluation'].length, game.rooms[index]['teams'][i]['users'].length);
          
          if ((size == game.questions['area' + message['area']].length) && 
              (game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][size - 1]['evaluation'].length == game.rooms[index]['teams'][i]['users'].length))
          {//Todos los usuarios evaluaron hasta la última pregunta. //Juego terminado.
            socket.emit('finishGame', message);
            socket.broadcast.emit('finishGame', message);
          }
          else
          {
            if (game.rooms[index]['teams'][i]['sendedQuestions']['area' + message['area']][size - 1]['evaluation'].length == game.rooms[index]['teams'][i]['users'].length)
            {//Todos los usuarios evaluaron hasta la pregunta actual. Siguiente pregunta.
              //Hay que lanzar el dado.
              for (var j = 0; j < game.rooms[index]['teams'][i]['users'].length; j++)
              {
                if (!game.rooms[index]['teams'][i]['users'][j]['rolledDice'])
                {
                  message['userName'] = game.rooms[index]['teams'][i]['users'][j]['userName'];
                  message['userSurname'] = game.rooms[index]['teams'][i]['users'][j]['userSurname'];
                  message['rooms'] = game.rooms;
                  socket.emit('startGame', message);
                  socket.broadcast.emit('startGame', message);
                  //Es necesario detener el bucle para que tire de a uno a la vez.
                  j = game.rooms[index]['teams'][i]['users'].length;
                }
              }
              //socket.emit('finishGame', message);
              //socket.broadcast.emit('finishGame', message);
            }
          }
          socket.broadcast.emit('personalEvaluationAdmin', message);
        }
      }
    }
  });
  socket.on('questionArea2', (data) => {
    var message = JSON.parse(data);
    var index = game.searchRoomCode(message['roomCode'], false);
    if (index != -1)
    {
      //game.rooms[index]['teams'][i]['sendedQuestions'].push(game.questions['area' + data['area']][j]['question']);
      for (var i = 0; i < game.rooms[index]['teams'].length; i++)
      {
        if (game.rooms[index]['teams'][i]['teamName'] == message['teamName'])
        {
          for (var j = 0; j < game.questions['area' + message['area']].length; j++)
          {//console.log(game.questions['area' + message['area']][j]['question'], message['question']);
            if (game.questions['area' + message['area']][j]['question'] == message['question'])
            {//console.log('Line 541.');
              for (var k = 0; k < game.questions['area' + message['area']][j]['options'].length; k++)
              {//console.log(game.questions['area' + message['area']][j]['options'][k]['option'], message['answer']);
                if (game.questions['area' + message['area']][j]['options'][k]['option'] == message['answer'])
                {//Pendiente ver por qué no llega a este punto.
                  game.rooms[index]['teams'][i]['scoreArea' + message['area']] += game.questions['area' + message['area']][j]['options'][k]['score'];
                  k = game.questions['area' + message['area']][j]['options'].length;
                }
              }
              j = game.questions['area' + message['area']].length;
            }
          }
          message['rooms'] = game.rooms;
          //Hay que lanzar el dado.
          for (var j = 0; j < game.rooms[index]['teams'][i]['users'].length; j++)
          {
            if (!game.rooms[index]['teams'][i]['users'][j]['rolledDice'])
            {
              message['userName'] = game.rooms[index]['teams'][i]['users'][j]['userName'];
              message['userSurname'] = game.rooms[index]['teams'][i]['users'][j]['userSurname'];
              message['rooms'] = game.rooms;
              socket.emit('startGame', message);
              socket.broadcast.emit('startGame', message);
              //Es necesario detener el bucle para que tire de a uno a la vez.
              j = game.rooms[index]['teams'][i]['users'].length;
            }
          }
          //socket.emit('resultArea2', message);
          //socket.broadcast.emit('resultArea2', message);
        }
      }
    }
  });
  socket.on('disconnect', () => {
    /*console.log(socket.id);
		userInfo = game.userDisconected(socket.id);
    var message = {
      'type' : 'userDisconected', 
      'roomCode' : userInfo[0], 
      'userName' : userInfo[1]['userName'], 
      'userSurname' : userInfo[1]['userSurname']
    }
    index = game.searchRoomCode(userInfo[0], false);
    if (index != -1)
    {
      if ((game.rooms[index]['selectedUser'] == undefined) || (game.rooms[index]['selectedUser'] == '') || (game.rooms[index]['selectedUser'] == userInfo[1]))
      {
        game.rooms[index]['selectedUser'] = '';
        game.rooms[index]['word'] = null;
        if (game.rooms[index]['usersTurns'].length)
            {
              if (game.rooms[index]['users'].length >= 2)
              {//Cuando se va el selectedUser pero quedan otros.
                game.rooms[index]['selectedUser'] = game.rooms[index]['usersTurns'][Math.floor(Math.random() * Math.floor(game.rooms[index]['usersTurns'].length))];
                message['selectedUser'] = game.rooms[index]['selectedUser'];
                game.rooms[index]['usersUsed'].push(game.rooms[index]['selectedUser']);
                var aux = [];
                message['words'] = aux;
                message['round'] = [...game.rooms[index]['round']];
                message['full'] = game.rooms[index]['full'];
                message['subType'] = 'reasignedSelectedUser';
              }
            }
            else
            {//No hay turnos disponibles.
              if (game.rooms[index]['users'].length > 1)
              {//Debería pasar a la siguiente ronda o terminar el juego.
                if (game.rooms[index]['round'][0] < game.rooms[index]['round'][1])
                {
                  game.rooms[index]['round'][0] += 1;
                  message['round'] = [...game.rooms[index]['round']];
                  message['word'] = game.rooms[index]['word'];
                  message['full'] = game.rooms[index]['full'];
                  message['subType'] = 'nextTurn';
                  message['round'] = [...game.rooms[index]['round']];
                  game.rooms[index]['usersUsed'] = [];
                  game.rooms[index]['usersTurns'] = [...game.usersInRoom(game.rooms[index]['roomCode'], game.rooms[index]['usersUsed'])];
                }
                else
                {
                  message['word'] = game.rooms[index]['word'];
                  message['subType'] = 'gameOver';
                }
              }
              else
              {//Volver al estado inicial.
                game.rooms[index]['round'] = [1, rounds];
              }
            }
      }
      else
      {
        if (!(game.rooms[index]['users'].length > 1))
        {
          if ((game.rooms[index]['word'] != undefined) && (game.rooms[index]['word'] != ''))
          {//El que queda gana por abandono si es que en algún momento se seleccionó una palabra.
            message['word'] = game.rooms[index]['word'];
            message['winners'] = [[game.rooms[index]['users'][0], game.rooms[index]['usersPoints'][0]]];
            message['subType'] = 'gameOver';
          }
          else
          {//Quedó sólamente el selectedUser.
            game.rooms[index]['selectedUser'] = '';
            game.rooms[index]['full'] = false;
          }
        }
      }
      game.rooms[index]['usersTurns'] = [...game.usersInRoom(game.rooms[index]['roomCode'], game.rooms[index]['usersUsed'])];
      message['full'] = game.rooms[index]['full'];
      //Si es la primer ronda, 19 users, full, word null, usersUsed == []
      if ((game.rooms[index]['round'][0] == 1) && game.rooms[index]['full'] && (game.rooms[index]['users'].length < maxUsers)
         && ((game.rooms[index]['word'] == null) || (game.rooms[index]['word'] == undefined))
         && (game.rooms[index]['usersUsed'].length <= 1)
      )
      {
        game.rooms[index]['full'] = false;
      }
      var index;
      for (var i = 0; i < game.rooms.length; i++)
      {
        if (message['roomCode'] == game.rooms[i]['roomCode'])
        {
          index = i;
        }
      }
      if ((index != undefined) && (!game.rooms[index]['usersIds'].length))
      {
        game.rooms[index]['full'] = true;
      }
    }
    socket.broadcast.emit('userDisconected', message);*/
	});
});