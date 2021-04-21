var game = require('./game.js');
function userConnected(data, socket)
{
  if (
    (data['teamName'] != undefined) && (data['teamName'] != '') && (data['teamName'] != ' ') && 
    (data['userName'] != undefined) && (data['userName'] != '') && (data['userName'] != ' ') && 
    (data['userSurname'] != undefined) && (data['userSurname'] != '') && (data['userSurname'] != ' ') 
  )
  {
    var newUser = true;console.log(data['userName'] + ' ' + data['userSurname']);
    for (var i = 0; i < game.users.length; i++)
    {console.log('\t' + game.users[i]['userName'] + ' ' + game.users[i]['userSurname'])
      if ((game.users[i]['userName'] == data['userName']) && 
        (game.users[i]['userSurname'] == data['userSurname']))
      {//Pendiente hacer que no se repitan usuarios en un mismo team o sala.
        newUser = false;
        i = game.users.length;
      }
    }//Pendiente ver qué hacer si se conecta un usuario nuevo después de elejir al líder.
    if (newUser)
    {
      game.users.push({
        'userName' : data['userName'], 
        'userSurname' : data['userSurname'], 
        'vote' : data['vote'], 
        'votesReceived' : 0, 
        'connected' : true
      });//Pendiente ver si es necesario el data para 'voteForAnAnswer' y 'voteLeader'.
      game.usersIds.push(socket.id);
    }
    else
    {//Ver si está o no en un team diferente al que se encontró con ese mismo nombre.
      var flag = true;
      for (var i = 0; i < game.teams.length; i++)
      {
        if (game.teams[i]['teamName'] != undefined)
        {
          for (var j = 0; j < game.teams[i]['users'].length; j++)
          {
            if ((game.teams[i]['users'][j]['userName'] == data['userName']) && 
              (game.teams[i]['users'][j]['userSurname'] == data['userSurname']))
            {
              if (game.teams[i]['teamName'] == data['teamName'])
              {
                if (game.teams[i]['users'][j]['connected'])
                {console.log('login.js, line 48');
                  data['msg'] = 'There is already a user with that name and surname.';
                  socket.emit('loginError', data);
                  return true;
                }
              }
              else
              {console.log('login.js, line 53');
                data['msg'] = 'There is already a user with that name and surname.';
                socket.emit('loginError', data);
                return true;
              }
            }
          }
        }
      }
    }
    var teamIndex = -1;
    for (var i = 0; i < game.teams.length; i++)
    {
      if (game.teams[i]['teamName'] == data['teamName'])
      {
        teamIndex = i;
      }
    }console.log('teamIndex == ' + teamIndex);
    if (teamIndex == -1)
    {console.log('login.js, line 43');
      game.teams.push({
        'teamName' : data['teamName'], 
        'users' : [{'userName' : data['userName'], 'userSurname' : data['userSurname'], 'vote' : false, 'votesReceived' : 0, 'connected' : true}], 
        'sendedQuestions' : {
          'area1' : [], 
          'area2' : [], 
          'area3' : []
        }, 
        'scoreArea1' : 0, 
        'scoreArea2' : 0, 
        'scoreArea3' : 0, 
        'status' : 'starting'
      });//Pendiente ver si sobran o faltan datos en el JSON.
      teamIndex = game.teams.length - 1;//console.log(game.users);
    }
    else
    {console.log('login.js, line 60');
      var auxUserIndex = -1;
      for (var i = 0; i < game.teams[teamIndex]['users'].length; i++)
      {
        if ((game.teams[teamIndex]['users'][i]['userName'] == data['userName']) && 
          (game.teams[teamIndex]['users'][i]['userSurname'] == data['userSurname']))
        {
          auxUserIndex = i;
          i = game.teams[teamIndex]['users'].length;
        }
      }
      if (auxUserIndex == -1)//Nuevo.
      {
        game.teams[teamIndex]['users'].push({
          'userName' : data['userName'], 
          'userSurname' : data['userSurname'], 
          'vote' : data['vote'], 
          'votesReceived' : 0, 
          'connected' : true
        });
        userIndex = game.teams[teamIndex]['users'].length - 1;
      }
      else
      {//Reconectado.
        userIndex = auxUserIndex;
      }
      console.log(game.teams[teamIndex]['users'][userIndex]['userName'] + ' ' + game.teams[teamIndex]['users'][userIndex]['userSurname'] + ' reconectado.');console.log('Cantidad de usuarios en el team (conectados o no): ' + game.teams[teamIndex]['users'].length);
      game.teams[teamIndex]['users'][userIndex]['connected'] = true;
      updateSocketId(socket.id, game.teams[teamIndex]['users'][userIndex]['userName'], game.teams[teamIndex]['users'][userIndex]['userSurname']);
      switch (game.teams[teamIndex]['status'])
      {
        /*case 'starting':
          //data['users'] = game.teams[teamIndex]['users'];
        break;*/
        case 'wheel':
          data['users'] = game.teams[teamIndex]['users'];
          data['randomSpin'] = game.teams[teamIndex]['randomSpin'];
        break;
        case 'answeringQuestionArea1':
          data['question'] = game.teams[teamIndex]['question'];
        break;
        case 'leaderVotation':
          data['question'] = game.teams[teamIndex]['question'];
          for (var i = 0; i < game.teams[teamIndex]['users'].length; i++)
          {
            if (game.teams[teamIndex]['users'][i]['leader'])
            {
              data['leader'] = game.teams[teamIndex]['users'][i];
              i = game.teams[teamIndex]['users'].length;
            }
          }
        break;
        case 'detailedExplanationOfAnswers':
          data['finalAnswer'] = game.teams[teamIndex]['finalAnswer'];
          data['score'] = game.teams[teamIndex]['score'];
          data['scoreTotal'] = game.teams[teamIndex]['scoreArea1'];
          data['bestAnswerScore'] = game.teams[teamIndex]['bestAnswerScore'];
          data['options'] = game.teams[teamIndex]['options'];
          data['topic'] = game.teams[teamIndex]['topic'];
          data['question'] = game.teams[teamIndex]['question'];
          data['scoreArea1'] = game.teams[teamIndex]['scoreArea1'];
        break;
        case 'answeringQuestionArea2':
          data['question'] = game.teams[teamIndex]['question'];
          data['actualUserName'] = game.teams[teamIndex]['actualUserName'];
          data['actualUserSurname'] = game.teams[teamIndex]['actualUserSurname'];
          game.teams[teamIndex]['users'][userIndex]['status'] = 'answeringQuestionArea2';
        break;
        case 'area3Ro':
          data['ro'] = game.teams[teamIndex]['ro'];
          data['userNameWithCard'] = game.teams[teamIndex]['userName'];
          data['userSurnameWithCard'] = game.teams[teamIndex]['userSurname'];
        break;
        case 'area3Card':
          data['ro'] = game.teams[teamIndex]['ro'];
          data['userNameWithCard'] = game.teams[teamIndex]['userName'];
          data['userSurnameWithCard'] = game.teams[teamIndex]['userSurname'];
        break;
      }
      data['status'] = game.teams[teamIndex]['status'];
    }
    data['users'] = [];
    for (var j = 0; j < game.teams[teamIndex]['users'].length; j++)
    {
      if (game.teams[teamIndex]['users'][j]['connected'])
      {
        data['users'].push(game.teams[teamIndex]['users'][j]);
      }
    }
    data['scoreArea1'] = game.teams[teamIndex]['scoreArea1'];
    data['scoreArea2'] = game.teams[teamIndex]['scoreArea2'];
    data['scoreArea3'] = game.teams[teamIndex]['scoreArea3'];
    console.log('login.js, line 196: game.teams[teamIndex][\'status\'] == ' + game.teams[teamIndex]['status']);//if ((data['status'] == 'onlyWheel') || (game.teams[teamIndex]['status'] == 'wheel'))
    socket.emit('userConnected', data);
    socket.broadcast.emit('userConnected', data);
  }
}
function updateSocketId(socketId, userName, userSurname)
{
  for (var i = 0; i < game.users.length; i++)
  {
    if ((game.users[i]['userName'] == userName) && 
      (game.users[i]['userSurname'] == userSurname))
    {if (game.usersIds[i] != socketId){console.log('Actualizando socket.id');}
      game.usersIds[i] = socketId;
    }
  }
}
module.exports.userConnected = userConnected;