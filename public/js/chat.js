var socket = io();
/* Variables */
var user;
var id;
var users = [];
var selectedUser;
var words;
var timer;
var socket;
var oldname;
var userName;
var userSurname;
var roomCode;
var privateRoom = false;
var typeTimer;
var clients = [];
var dev = true;
var unread = 0;
var focus = true;
var connected = false;
var regex = /(&zwj;|&nbsp;)/g;
var d;

socket.on('update', (data) => {
    if ((data['userName'] != undefined) && (data['userSurname'] != undefined))
    {
        console.log(data);
        //userName = userName.split('_')[0];//pendiente mejorar
        if ((data['userName'] == userName) && (data['userSurname'] == userSurname))
        {
            //document.getElementById('waiting').style.display = 'block';
            ////document.getElementById(wordsInfo).innerHTML = '<label>Waiting other players...</label><br>';
            //document.getElementById(wordsInfo).style.display = 'block';
            document.getElementById('divLogin').style.display = 'none';
            roomCode = data['roomCode'];
            id = data['id'];
            for (var i = 0; i < data['usersInRoom'].length; i++)
            {
                var f = false;
                for (var j = 0; j < users.length; j++)
                {
                    if (users[j][0] == data['usersInRoom'][i])
                    {
                        f = true;
                    }
                }
                if (!f)
                {
                    //users.push([data['usersInRoom'][i], 0]);
                    users.push(data['usersInRoom'][i]);
                    users[users.length - 1]['puntuation'] = 0;
                    updateUsersInfo();
                }
            }
            if (users.length > 1)
            {
                document.getElementById(panelMessages).style.display = 'block';
            }
            if (users.length > 2)
            {
                handleNewUserNeedsInfo();
            }
            document.getElementById(lblRoomCode).innerHTML = 'The room code is: ' + roomCode;

            if ((data['selectedUser'] != undefined) && (data['selectedUser'] != ''))
            {
                selectedUser = data['selectedUser'];
                updateUsersInfo();
                if ((data['selectedUser']['name'] == userName) && (data['selectedUser']['surname'] == userSurname))
                {
                    words = data['words'];
                    /*var w = document.getElementById(wordsInfo);
                    w.style.display = 'flex';
                    w.innerHTML = '';
                    var html = '';
                    if (!data['full'])
                    {
                        //document.getElementById('waiting').style.display = 'block';
                    }
                    else
                    {
                        //document.getElementById('waiting').style.display = 'none';
                    }
                    html += '<label>Select a word: </label>';
                    for (var i = 0; i < words.length; i++)
                    {
                        html += '<button id="w_' + i + '" onclick="selectWord(this.id);">' + words[i] + '</button><br>';
                    }
                    w.innerHTML = html;*/
                    document.getElementById('send').childNodes[0].nodeValue = 'Send';
                    updateBar('mdi-content-send', 'Type here', false);
                    document.getElementById(privateRoom).style.display = 'none';
                }
                else
                {
                    var html = '';
                    if (!data['full'])
                    {
                        //document.getElementById('waiting').style.display = 'block';
                    }
                    else
                    {
                        //document.getElementById('waiting').style.display = 'none';
                    }
                    html += '<label>' + data['selectedUser']['userName'] + ' ' + data['selectedUser']['userSurname'] + ' is selecting a word.</label>';
                    //document.getElementById(wordsInfo).innerHTML = html;
                    document.getElementById('send').childNodes[0].nodeValue = 'Send';
                    updateBar('mdi-content-send', 'Type here', false);
                }
                //document.getElementById(roundInfo).innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
            }
        }
        else
        {
            if ((data['roomCode'] != undefined) && (data['roomCode'] != '')  && (data['roomCode'] == roomCode))
            {
                //document.getElementById('rBtn').style.display = 'none';
                //document.getElementById('rBtn2').style.display = 'none';
                //id = data['id'];
                for (var i = 0; i < data['usersInRoom'].length; i++)
                {
                    var f = false;
                    for (var j = 0; j < users.length; j++)
                    {
                        if ((users[j]['userName'] == data['usersInRoom'][i]['userName']) && 
                            (users[j]['userSurname'] == data['usersInRoom'][i]['userSurname']))
                        {
                            f = true;
                        }
                    }
                    if (!f)
                    {
                        //users.push({data['usersInRoom'][i]['name'], 0});//Pendiente revisar.
                        users.push(data['usersInRoom'][i]);
                        users[users.length - 1]['puntuation'] = 0;
                    }
                }
                if (users.length > 1)
                {
                    document.getElementById(panelMessages).style.display = 'block';
                }
                updateUsersInfo();
                if (users.length > 1)
                {
                    points = [];
                    //changeSize();
                    selectedUser = data['selectedUser'];
                    updateUsersInfo();
                    if ((data['selectedUser'] != undefined) && (data['selectedUser']['name'] != '') && (data['selectedUser']['surname'] != ''))
                    {
                        if ((data['selectedUser']['name'] == userName) && (data['selectedUser']['surname'] == userSurname))
                        {
                            var html = '';
                            if (!data['full'])
                            {
                                //document.getElementById('waiting').style.display = 'block';
                            }
                            else
                            {
                                //document.getElementById('waiting').style.display = 'none';
                            }
                            html += '<label>Select a word: </label>';
                            words = data['words'];
                            /*var w = document.getElementById(wordsInfo);
                            w.style.display = 'flex';
                            w.innerHTML = '';
                            for (var i = 0; i < words.length; i++)
                            {
                                html += '<button id="w_' + i + '" onclick="selectWord(this.id);">' + words[i] + '</button>';
                            }
                            w.innerHTML = html;*/
                        }
                        else
                        {
                            var html = '';
                            if (!data['full'])
                            {
                                //document.getElementById('waiting').style.display = 'block';
                            }
                            else
                            {
                                //document.getElementById('waiting').style.display = 'none';
                            }
                            html += '<label>' + data['selectedUser'] + ' is selecting a word.</label>';
                            //document.getElementById(wordsInfo).innerHTML = html;
                        }
                        ////document.getElementById(roundInfo).innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
                    }
                    updateBar('mdi-content-send', 'Type here', false);
                    document.getElementById('privateRoom').style.display = 'none';
                    connected = true;
                }
            }
        }
    }
});
socket.on('userDisconected', (data) => {
    if (data['roomCode'] == roomCode)
    {
        console.log(data);
        showChat(data.type, '', data['userName'] + ' ' + data['userSurname'] + ' disconnected.', '', '');
        var auxUsers = [];
        for (var i = 0; i < users.length; i++)
        {
            if (users[i][0] != data['userName'])
            {
                auxUsers.push(users[i]);
            }
        }
        updateUsersInfo();
        users = [...auxUsers];
        if (users.length < 2)
        {
            //canvasDisplay = 'none';
            //changeSize();
            document.getElementById(panelMessages).style.display = 'none';
            //document.getElementById(roundInfo).innerHTML = '';
            stopTime = true;
            document.getElementById(timeInfo).innerHTML = 'Time remaining: ' + time;
            //document.getElementById(wordsInfo).innerHTML = '';
            //document.getElementById('waiting').style.display = 'none';
            //document.getElementById(drawingToolsDiv).style.display = 'none';
            selectedUser = undefined;
            if (data['subType'] == 'gameOver')
            {
                /*canvas.removeEventListener('touchstart', onTouch, false);
                canvas.removeEventListener('touchend', onTouchUp, false);
                canvas.removeEventListener('mouseup', onUp, false);
                canvas.removeEventListener('mousemove', onMove, false);*/
                //document.getElementById(drawingToolsDiv).style.display = 'none';
                document.getElementById(panelMessages).style.display = 'block';
                //showChat(data.type, '', 'The word was \'' + data['word'] + '\'.', '', '');
                stopTime = true;
                points = [];
                drawer = false;
                //changeSize();
                selectedUser = '';
                if (data['puntuation'] != undefined)
                {
                    for (var i = 0; i < users.length; i++)
                    {
                        //if (users[i][0] == data['userName'])
                        {
                            users[i]['puntuation'] = data['puntuation'][i];
                            //i = users.length;
                        }
                    }
                    updateUsersInfo();
                    if (data['winners'].length > 1)
                    {
                        var names = data['winners'][0][0];
                        for (var i = 1; i < data['winners'].length; i++)
                        {
                            names += ', ' + data['winners'][i][0];
                        }
                        showChat(data.type, '', 'Winners: ' + names + '.', '', '');
                    }
                    else
                    {
                        showChat(data.type, '', 'Winner: ' + data['winners'][0][0] + '.', '', '');
                    }
                }
                else
                {//Cuando se hace rematch luego de terminar el juego por abandono.
                    //document.getElementById('rBtn2').style.display = 'block';
                }
                showChat(data.type, '', 'Game over.', '', '');
                //document.getElementById('rBtn').style.display = 'block';
            }
        }
        else
        {
            if (data['subType'] == 'reasignedSelectedUser')
            {
                stopTime = true;
                selectedUser = data['selectedUser'];
                updateUsersInfo();
                if ((data['selectedUser']['name'] == userName) && (data['selectedUser']['surname'] == userSurname))
                {
                    words = data['words'];
                    /*var w = document.getElementById(wordsInfo);
                    w.style.display = 'flex';
                    w.innerHTML = '';
                    var html = '';
                    if (!data['full'])
                    {
                        //document.getElementById('waiting').style.display = 'block';
                    }
                    else
                    {
                        //document.getElementById('waiting').style.display = 'none';
                    }
                    html += '<label>Select a word: </label>';
                    for (var i = 0; i < words.length; i++)
                    {
                        html += '<button id="w_' + i + '" onclick="selectWord(this.id);">' + words[i] + '</button>';
                    }
                    w.innerHTML = html;*/
                    document.getElementById('send').childNodes[0].nodeValue = 'Send';
                    updateBar('mdi-content-send', 'Type here', false);
                    document.getElementById(privateRoom).style.display = 'none';
                }
                else
                {
                    var html = '';
                    if (!data['full'])
                    {
                        //document.getElementById('waiting').style.display = 'block';
                    }
                    else
                    {
                        //document.getElementById('waiting').style.display = 'none';
                    }
                    html += '<label>' + data['selectedUser']['userName'] + ' ' + data['selectedUser']['userSurname'] + ' is selecting a word.</label>';
                    //document.getElementById(wordsInfo).innerHTML = html;
                    //document.getElementById(wordsInfo).style.display = 'flex';
                    document.getElementById('send').childNodes[0].nodeValue = 'Send';
                    updateBar('mdi-content-send', 'Type here', false);
                }
                //document.getElementById(roundInfo).innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
            }
        }
        updateUsersInfo();
    }
});
socket.on('returningGameInfo', (data) => {
    if ((data['roomCode'] == roomCode) && (data['userName'] == userName))
    {
        if ((data['selectedUser'] != undefined) && (data['selectedUser'] != ''))
        {
            var html = '';
            if (!data['full'])
            {
                //document.getElementById('waiting').style.display = 'block';
            }
            else
            {
                //document.getElementById('waiting').style.display = 'none';
            }
            html += '<label>' + data['selectedUser'] + ' is selecting a word.</label>';
            //document.getElementById(wordsInfo).innerHTML = html;
            //document.getElementById(roundInfo).innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
            selectedUser = data['selectedUser'];
            updateUsersInfo();
            document.getElementById('send').childNodes[0].nodeValue = 'Send';
            updateBar('mdi-content-send', 'Type here', false);
            document.getElementById('privateRoom').style.display = 'none';
        }
    }
});
socket.on('startDrawing', (data) => {
    //console.log(data['roomCode'], roomCode);
    if (data['roomCode'] == roomCode)
    {
        //document.getElementById(canvas).style.display = 'block';
        canvasDisplay = 'block';
        points = [];
        //var b = $('#body');
        //changeSize();
        stopTime = false;
        initTime();
        selectedUser = data['selectedUser'];
        updateUsersInfo();
        if (data['selectedUser'] == userName)
        {
            //changeSize(true);
            document.getElementById('send').childNodes[0].nodeValue = 'Send';
            updateBar('mdi-content-send', 'Type here', false);
        }
        else
        {
            document.getElementById('send').childNodes[0].nodeValue = 'Send';
            updateBar('mdi-content-send', 'Type here', false);
            document.getElementById('privateRoom').style.display = 'none';
        }
    }
});
socket.on('nextTurn', (data) => {
    if (data['roomCode'] == roomCode)
    {
        canvas.removeEventListener('touchstart', onTouch, false);
        canvas.removeEventListener('touchend', onTouchUp, false);
        canvas.removeEventListener('mouseup', onUp, false);
        canvas.removeEventListener('mousemove', onMove, false);
        document.getElementById(drawingToolsDiv).style.display = 'none';
        if (data['timeOut'])
        {
            showChat(data.type, '', 'Time out.', '', '');
        }
        if ((data['userName'] != '') && (data['userName'] != undefined))
        {
            showChat(data.type, '', data['userName'] + ' ' + data['userSurname'] + ' guessed the word!', '', '');
        }
        showChat(data.type, '', 'The word was \'' + data['word'] + '\'.', '', '');
        stopTime = true;
        points = [];
        drawer = false;
        //changeSize();
        selectedUser = data['selectedUser'];
        for (var i = 0; i < users.length; i++)
        {
            //if (users[i][0] == data['userName'])
            {
                users[i][1] = data['puntuation'][i];
                //i = users.length;
            }
        }
        updateUsersInfo();
        if (data['selectedUser'] != '')
        {
            if (data['selectedUser'] == userName)
            {
                var html = '';
                if (!data['full'])//No funciona.
                {
                    //document.getElementById('waiting').style.display = 'block';
                }
                else
                {
                    //document.getElementById('waiting').style.display = 'none';
                }
                html += '<label>Select a word: </label>';
                words = data['words'];
                /*var w = document.getElementById(wordsInfo);
                w.style.display = 'flex';
                w.innerHTML = '';
                for (var i = 0; i < words.length; i++)
                {
                    html += '<button id="w_' + i + '" onclick="selectWord(this.id);">' + words[i] + '</button>';
                }
                w.innerHTML = html;*/
                //console.log(w.innerHTML);
                document.getElementById('send').childNodes[0].nodeValue = 'Send';
                updateBar('mdi-content-send', 'Type here', false);
            }
            else
            {
                var html = '';
                if (!data['full'])
                {
                    //document.getElementById('waiting').style.display = 'block';
                }
                else
                {
                    //document.getElementById('waiting').style.display = 'none';
                }
                html += '<label>' + data['selectedUser'] + ' is selecting a word.</label>';
                //document.getElementById(wordsInfo).innerHTML = html;
                document.getElementById('send').childNodes[0].nodeValue = 'Send';
                updateBar('mdi-content-send', 'Type here', false);
                document.getElementById('privateRoom').style.display = 'none';
            }
            //document.getElementById('roundInfo').innerHTML = 'Round: ' + data['round'][0] + ' of ' + data['round'][1];
        }
        else
        {
            //¿Error?
        }
    }
});
socket.on('gameOver', (data) => {
    if (data['roomCode'] == roomCode)
    {
        canvas.removeEventListener('touchstart', onTouch, false);
        canvas.removeEventListener('touchend', onTouchUp, false);
        canvas.removeEventListener('mouseup', onUp, false);
        canvas.removeEventListener('mousemove', onMove, false);
        document.getElementById(drawingToolsDiv).style.display = 'none';
        if (data['timeOut'])
        {
            showChat(data.type, '', 'Time out.', '', '');
        }
        if ((data['userName'] != '') && (data['userName'] != undefined))
        {
            showChat(data.type, '', data['userName'] + ' guessed the word!', '', '');
        }
        showChat(data.type, '', 'The word was \'' + data['word'] + '\'.', '', '');
        stopTime = true;
        points = [];
        drawer = false;
        //changeSize();
        selectedUser = '';
        for (var i = 0; i < users.length; i++)
        {
            //if (users[i][0] == data['userName'])
            {
                users[i][1] = data['puntuation'][i];
                //i = users.length;
            }
        }
        updateUsersInfo();
        if (data['winners'].length > 1)
        {
            var names = data['winners'][0][0];
            for (var i = 1; i < data['winners'].length; i++)
            {
                names += ', ' + data['winners'][i][0];
            }
            showChat(data.type, '', 'Winners: ' + names + '.', '', '');
        }
        else
        {
            showChat(data.type, '', 'Winner: ' + data['winners'][0][0] + '.', '', '');
        }
        showChat(data.type, '', 'Game over.', '', '');

        document.getElementById('rBtn').style.display = 'block';
        document.getElementById('rBtn2').style.display = 'none';
    }
});
socket.on('message', (data) => {
    if (data['roomCode'] == roomCode)
    {
        showChat(data.type, data['userName'], data['userSurname'], data['guess'], '', '');
    }
});
socket.on('error', (data) => {
    /*if ((id == undefined) || (data['id'] == id))//Pendiente revisar.
    {
        document.getElementById(panelMessages).style.display = 'block';
        showChat(data.type, data.user, data['error'], '', '');
        userName = undefined;
    }*/
});
function updateBar(icon, placeholder, disable)
{
    document.getElementById('icon').className = 'mdi ' + icon;
    $('#' + messageInput).attr('placeholder', placeholder);
    $('#' + messageInput).prop('disabled', disable);
    $('#send').prop('disabled', disable);
}
function showChat(type, userName, userSurname, message, subtxt, mid)
{
    if(subtxt)
    {
        subtxt = '(' + subtxt + ') ';
    }
    $('#' + panel).append('<div class="' + type + '""><span><b><a class="namelink" href="javascript:void(0)">' + userName + ' ' + userSurname + '</a></b></span><span class="timestamp">' + subtxt + getTime() + '</span><br><span class="msg">' + message + '</span></div>');
    
    $('#' + panel).animate({scrollTop: $('#' + panel).prop('scrollHeight')}, 500);
}
function handleNewUserNeedsInfo()
{
    socket.emit('newUserNeedsInfo', JSON.stringify({
        type: 'newUserNeedsInfo',
        userName: userName, 
        userSurname: userSurname, 
        roomCode: roomCode
    }));
}
function handleMsg()
{
    var value = $('#' + messageInput).val().replace(regex, ' ').trim();
    if ((selectedUser != undefined) && (selectedUser != ''))
    {
        socket.emit('guess', JSON.stringify({
            type: 'guess',
            userName: userName, 
            userSurname: userSurname, 
            guess: value, 
            roomCode: roomCode
        }));
    }
    $('#' + messageInput).val('');
}
function handleLogin(private = false)
{
    var name = $('#nameInput').val().replace(regex, ' ').trim();
    var surname = $('#surnameInput').val().replace(regex, ' ').trim();
    if (private)
    {
        roomCode = 'private';
        privateRoom = true;
    }
    else
    {
        if (!connected)
        {
            roomCode = $('#roomCode').val();
        }
    }
    if ((name.length > 0) && (surname.length > 0) && (!connected) && (userName === undefined) && (userSurname === undefined))
    {
        userName = name;
        userSurname = surname;
        //connect();
        var data = JSON.stringify({'type' : 'update', 'userName' : userName, 'userSurname' : surname, 'roomCode' : roomCode});
        socket.emit('update', data);
    }
    $('#userInput').val('');
    $('#roomCode').val('');
}
function handleTimeOut()
{
    socket.emit('timeOut', JSON.stringify({
        type: 'timeOut', 
        roomCode: roomCode
    }));
}
function handleWordSelected(w)
{
    socket.emit('wordSelected', JSON.stringify({
        type: 'wordSelected', 
        word: w, 
        roomCode: roomCode
    }));
}
function getTime()
{
    var now = new Date();
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
 
    for(var i = 0; i < 3; i++)
    {
        if(time[i] < 10)
        {
            time[i] = '0' + time[i];
        }
    } 
    return time.join(':');
}