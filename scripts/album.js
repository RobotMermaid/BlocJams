
var createSongRow = function(songNumber, songName, songLength) {
    var template = 
        '<tr class = "album-view-song-item">'
    // songItem
    +   ' <td class = "song-item-number" data-song-number="' + songNumber + '"> ' + songNumber + '<td>'
    
    +   ' <td class = "song-item-title"> '+ songName + '<td>'
    +   ' <td class = "song-item-duration"> '+ songLength + '<td>'
    +   '</tr>';
    
    var $row = $(template);
    

    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
         if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.

              var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
             //currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
               currentlyPlayingCell.html(currentlyPlayingSongNumber);
             

        }
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            setSong(songNumber);
            currentSoundFile.play();
            $(this).html(pauseButtonTemplate);
            //currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
           

      
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
//            
//            $('.main-controls .play-pause').html(playerBarPlayButton);
//            currentlyPlayingSongNumber = null;
//            currentSongFromAlbum = null;
            if(currentSoundFile.isPaused()){
                $(this).html(pauseButtonTemplate);
                currentSoundFile.play();
                $('.main-controls .play-pause').html(playerBarPauseButton);
                
            } else {
                 $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
                
            } 

        }
    };
      
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

         if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(songNumber);

        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;

};
 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     //sets up page with all the info
     // #1
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo =$('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
          var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
          $albumSongList.append($newRow);
     }
 };

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);

};


//    Know what the previous song is.( it should "wrap" around).
//Use the trackIndex() helper function to get the index of the current song and then increment the value of the index.
//Set a new current song to currentSongFromAlbum.
//Update the player bar to show the new song.
//Update the HTML of the previous song's .song-item-number element with a number.
//Update the HTML of the new song's .song-item-number element with a pause button.
    //currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song

    setSong(currentSongIndex + 1);
    currentSongFile.play();
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);

    var $previousSongNumberCell =getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell( lastSongNumber );

    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};
//--------------------------------------------------------
var setSong = function(songNumber) {
    if(currentSoundFile) {
        currentSoundFile.stop();
    }

//    assigns currentlyPlayingSongNumber and currentSongFromAlbum a new value based on the new song number.
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    //set buzz sound object
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
       formats: [ 'mp3' ],
       preload: true
    });
    setVolume(currentVolume);
};

var setVolume = function(volume) {
    if(currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function (number) {
//    Write a function named getSongNumberCell that takes one argument, number, and returns the song number element that corresponds to that song number.
       return $('.song-item-number[data-song-number="' + number + '"]');

};

var togglePlayFromPlayerBar = function() {
    if(currentSoundFile) {
        $(this).html(pauseButtonTemplate);
        $playPause.html(playerBarPauseButton);
        currentSoundFile.play();
    } else {
        $(this).html(playButtonTemplate);
        $playPause.html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};


var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

$(document).ready(function(){ 
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
    $playPause.click(togglePlayFormPlayerBa);
});


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
















