var game = require('./game.js');
function update(data, socket)
{
	var message = JSON.parse(data);
  console.log(message);
  if ((message['teamName'] != undefined) && (message['teamName'] != ''))
  {
		console.log('Line 45.');
		var private = false;
		var flagAddRoom = false;
    if ((message['roomCode'] == undefined) || (message['roomCode'] == ''))
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
				flagAddRoom = true;console.log('flagAddRoom == ' + flagAddRoom);
			}console.log('Line 83: ' + message['roomCode']);
		}
		else
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
		if (flagAddRoom)
		{
			game.rooms.push({
				'roomCode' : message['roomCode'], 
				'users' : [{'userName' : message['userName'], 'userSurname' : message['userSurname'], 'votes' : 0, 'vote' : false, 'voteLeader' : false, 'connected' : true}], 
				'usersIds' : [socket.id], 
				'private' : private, 
				'full' : false, 
        'teams' : []
			});
      index = 0;
      console.log(game.rooms[game.rooms.length - 1]['users']);
			message['usersInRoom'] = [...game.rooms[game.rooms.length - 1]['users']];
      //message['requestTeamName'] = true;
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
          {//Pendiente hacer que no se repitan usuarios en un mismo team o sala.
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
            game.rooms[index]['users'].push({'userName' : message['userName'], 'userSurname' : message['userSurname'], 'votes' : 0, 'vote' : message['vote'], 'voteLeader' : message['voteLeader'], 'connected' : true});//Pendiente ver si es necesario el message para 'vote' y 'voteLeader'.
						game.rooms[index]['usersIds'].push(socket.id);
						message['usersInRoom'] = [...game.rooms[index]['users']];
					}
				}
			}
		}
    var userIndex = -1;
    var index2 = game.searchTeam(message['teamName'], index);console.log('Line 148: ' + message['teamName'] + ', ' + index2);
    if (index2 == -1)
    {//Se debe agregar el team a la sala y al usuario.
      game.rooms[index]['teams'].push({//Pendiente ver que no se repita el nombre.
        'teamName' : message['teamName'], 
        'users' : [
          {
            'userName' : message['userName'], 
            'userSurname' : message['userSurname'], 
            'votes' : 0, 
            'vote' : message['vote'], 
            'voteLeader' : message['voteLeader'], 
            'connected' : true
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
      index2 = 0;
    }
    else
    {console.log('Line 176: ' + game.rooms[index]['teams'][index2]['teamName']);
      for (var i = 0; i < game.rooms[index]['teams'][index2]['users'].length; i++)
      {
        if ((game.rooms[index]['teams'][index2]['users'][i]['userName'] == message['userName']) && 
          (game.rooms[index]['teams'][index2]['users'][i]['userSurname'] == message['userSurname']))
        {
          userIndex = i;
          i = game.rooms[index]['teams'][index2]['users'].length;
        }
      }
      if ((!game.rooms[index]['teams'][index2]['full']) && (userIndex == -1))
      {
        game.rooms[index]['teams'][index2]['users'].push({
          'userName' : message['userName'], 
          'userSurname' : message['userSurname'], 
          'votes' : 0, 
          'vote' : message['vote'], 
          'voteLeader' : message['voteLeader'], 
          'connected' : true
        });
      }
      else
      {
        if (userIndex != -1)
        {console.log(game.rooms[index]['teams'][index2]['users'][userIndex]['userName'] + ' ' + game.rooms[index]['teams'][index2]['users'][userIndex]['userSurname'] + ' reconectado.');console.log('Usuarios: ' + game.rooms[index]['teams'][index2]['users'].length);
          game.rooms[index]['teams'][index2]['users'][userIndex]['connected'] = true;
          updateSocketId(socket.id, game.rooms[index]['teams'][index2]['users'][userIndex]['userName'], game.rooms[index]['teams'][index2]['users'][userIndex]['userSurname'], index);
          /*game.rooms[index]['teams'][index2]['users'][userIndex]['status'] = 'onlyWheel';
          message['status'] = 'onlyWheel';*/
          //message['userName'] = game.rooms[index]['teams'][index2]['users'][userIndex]['userName'];
          //message['userSurname'] = game.rooms[index]['teams'][index2]['users'][userIndex]['userSurname'];
        }
      }
    }
    //if ((index2 != -1) && (!game.rooms[index]['teams'][index2]['full']))
    /*if (
      ((index2 != -1) && (!game.rooms[index]['teams'][index2]['full'])) || 
      (index2 == -1)
    )*/
    if ((index2 != -1) && (!game.rooms[index]['teams'][index2]['full']))
    {
      message['users'] = [];
      //message['rooms'] = game.rooms;
      //message['users'] = game.rooms[index]['teams'][index2]['users'];
      for (var j = 0; j < game.rooms[index]['teams'][index2]['users'].length; j++)
      {
        if (game.rooms[index]['teams'][index2]['users'][j]['connected'])
        {
          message['users'].push(game.rooms[index]['teams'][index2]['users'][j]);
        }
      }
      if ((message['status'] == 'onlyWheel') || (game.rooms[index]['teams'][index2]['status'] == 'wheel'))
      {//Pendiente revisar esto.
        //message['userName'] = '';//game.rooms[index]['teams'][i]['users'][j]['userName'];
        //message['userSurname'] = '';//game.rooms[index]['teams'][i]['users'][j]['userSurname'];
        message['rooms'] = game.rooms;
        //message['status'] = 'onlyWheel';
        socket.emit('showSpinner', message);
        socket.broadcast.emit('showSpinner', message);
      }
      else
      {
        socket.emit('update', message);
        socket.broadcast.emit('update', message);
      }
    }
  }
}
function updateSocketId(socketId, userName, userSurname, index)
{
  for (var i = 0; i < game.rooms[index]['users'].length; i++)
  {
    if ((game.rooms[index]['users'][i]['userName'] == userName) && 
      (game.rooms[index]['users'][i]['userSurname'] == userSurname))
    {if (game.rooms[index]['usersIds'][i] != socketId){console.log('Actualizando socket.id');}
      game.rooms[index]['usersIds'][i] = socketId;
    }
  }
}
module.exports.update = update;