//Sample Album
var albumPicasso = {
    title: 'The Color',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26'},
        { title: 'Green', duration: '3:14'},
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
    
};

var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
        '<tr class = "album-view-song-item">'
    // songItem
    +   ' <td class = "song-item-number" data-song-number="' + songNumber + '"> ' + songNumber + '<td>'
    +   ' <td class = "song-item-title"> '+ songName + '<td>'
    +   ' <td class = "song-item-duration"> '+ songLength + '<td>'
    +   '</tr>';
    
    return template;
}

 var setCurrentAlbum = function(album) {
     //sets up page with all the info
     // #1
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     // #2
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     // #3
     albumSongList.innerHTML = '';
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };



//keep play icon on other rows on hover
//keep pause icon when mouse leaves
//change pause icon to number when play is clicked on other row
//no play icon on hover while pause

//When we wrote findParentByClassName(), we did not account for some potential errors that could occur if we used the method elsewhere. For example, the function doesn't check for any situation where an ancestor element with the specified class name didn't exist, nor does it check to see if the starting element has a parent.
//
//Re-write the function so that it:
//Checks to see if a parent exists. If it doesn't, then show an alert that says "No parent found".
//Shows a different alert when it fails to find a parent with the given class name: "No parent found with that class name".


var findParentByClassName = function(element, specificClass) {
        //find parent with specidfied class for switching icon play/pause/number
       if (element) {
            var currentElement = element.parentElement;
           if (currentElement === null){
               alert("no parent found");
           } else if (currentElement.className === null){
               alert("No parent found with that class name");
           }
            while(currentElement.className !== specificClass && currentElement !== null) {
                //go up the DOM tree
               currentElement= currentElement.parentElement;
            }    
            return currentElement;
        }
     };

var getSongItem = function(element) {
        // statement that returns the element with the .song-item-number class.
    //not sure how to relate this to the rest
        switch(element.className) {
            case 'album-song-button':
            case 'ion-play':   
            case 'ion-pause':
                return findParentByClassName(element, 'song-item-number');
            case 'album-view-song-item':                                 
                return element.querySelector('.song-item-number');
            case 'song-item-title':
            case 'song-item-duration':
                return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
            case 'song-item-number':
                return element;
            default: 
                return;
    }
};

var clickHandler = function(targetElement) {
    //songItem is the element with the class name .song-item-number
    var songItem = getSongItem(targetElement);
    //where is currentlyplaying song defined?-135
    if(currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        //changes the data-song-number attribut to store the number for later and sets the html to pause button
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
        
    } else if(currentlyPlayingSong === songItem.getAttribute('data-song-number')){  
        //
        songItem.innerHTML = playButtonTemplate;
       currentlyPlayingSong = null;
        
   } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')){
       
       var currentlyPlayingSongElement = document.querySelector('[data-song-number = "' + currentlyPlayingSong + '" ]');
       currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
       songItem.innerHTML = pauseButtonTemplate;
       currentlyPlayingSong = songItem.getAttribute('data-song-number');
   }
};

//table of songs from the chosen album
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
//row for each song
var songRows = document.getElementsByClassName('album-view-song-item');
var currentlyPlayingSong = null;

 window.onload = function() {
     setCurrentAlbum(albumPicasso);
    //
     songListContainer.addEventListener('mouseover', function(event) {
        //  #1
        console.log(event.target);
         // if you hover over any child part of the row for a song
        if (event.target.parentElement.className === 'album-view-song-item') {
            //change the content from the number to the play button's html
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
            // this songItem is the element with class of song-item-title that is being hovered over
             var songItem = getSongItem(event.target);
            // property is undefined in the console
             if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong ){
            songItem.innerHTML = playButtonTemplate;
        }
        }
     });
     for (var i = 0 ; i< songRows.length ; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
         });
         
         songRows[i].addEventListener('click', function(event){
            clickHandler(event.target);                         
         });
     }
}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>'


















