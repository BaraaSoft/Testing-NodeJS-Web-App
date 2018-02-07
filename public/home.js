(function(win, $) {
    var HomeUi = function() {

        function roomsUpdate(rooms) {
            var roomlst = "";
            $('#roomLst > *').remove();
            $.each(rooms, function(index, room) {
                var lstItem = $('<a datz = "" href="#" class="list-group-item list-group-item-action"></a>');
                lstItem.attr('datz', '/api/rooms/' + room.id + "/messages");
                lstItem.text(room.name);
                add(lstItem);
            });
            return this;
        }

        function chatUpdate(messages) {
            var $msg = "";
            $.each(messages, function(index, message) {
                $msg += message.text + ' \n';

            });
            $('#txtChat').val("");
            $('#txtChat').val($msg);
            //return this;
        }

        function add(item) {
            $('#roomLst').append(item);
        }

        return {
            roomsUpdate: roomsUpdate,
            chatUpdate: chatUpdate,

        }
    };
    // APP
    $(function() {

        var mUI = HomeUi();
        var ActiveRoomId;
        var roomUrl;
        $.ajax({
            type: "GET",
            url: "/api/rooms"
        }).success(function(data) {
            mUI.roomsUpdate(data);
        });

        $('#roomLst').on('click', function(e) {
            $('#roomLst').children().removeClass('active');
            roomUrl = $(e.target).attr('datz');
            var urlList = roomUrl.split('/');
            ActiveRoomId = urlList[urlList.length - 2];


            $.ajax({
                type: "GET",
                url: roomUrl
            }).success(function(data) {
                //console.log(data);
                mUI.chatUpdate(data);
            });
            $(e.target).addClass('active');
        });

        $('#chat-sub').on('click', function(e) {
            var message = {
                text: $('#txtPost').val()
            };
            $.ajax({
                type: "POST",
                url: "/api/rooms/" + ActiveRoomId + "/messages",
                data: JSON.stringify(message),
                contentType: "application/json"

            }).success(function() {
                $.ajax({
                    type: "GET",
                    url: roomUrl
                }).success(function(data) {
                    mUI.chatUpdate(data);
                    $('#txtPost').val("");
                });
            });
        }); //ev
        $('#delete-chats').on('click', function(e) {
            $.ajax({
                type: 'delete',
                url: 'api/rooms/' + ActiveRoomId + '/messages'
            }).success(function() {
                $.ajax({
                    type: "GET",
                    url: roomUrl
                }).success(function(data) {
                    mUI.chatUpdate(data);
                });
            });
        }); //ev



    }); //app

}(window, jQuery));









/*
<a href="#" class="list-group-item active">Cras justo odio</a>
<a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
<a href="#" class="list-group-item list-group-item-action">Morbi leo risus</a>
<a href="#" class="list-group-item list-group-item-action">Porta ac consectetur ac</a>
<a href="#" class="list-group-item list-group-item-action disabled">Vestibulum at eros</a>
*/
