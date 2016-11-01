// Example Album
 var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };

 // Another Example Album
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
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     return $(template);
 };

 var setCurrentAlbum = function(album) {
    // #1
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

     $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var songNumbers = document.getElementsByClassName('song-item-number');
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    songListContainer.addEventListener('mouseover',function(event) {
    if (event.target.parentElement.className === 'album-view-song-item') {
      // console.log (event.target.getAttribute('data-song-number'));



      console.log("currentlyPlayingSong: " + currentlyPlayingSong)
      console.log("event data-song-number: " + event.target.getAttribute('data-song-number'))

      if (event.target.getAttribute('data-song-number') != currentlyPlayingSong){
        event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
      }
    }
  });

  for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(event) {
      var songItemNumber = event.target.children[0].getAttribute('data-song-number');
      //console.log(event.target.children[0].className);
      //console.log(songItemNumber);
      //var songItem = getSongItem(event.target);
      //this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
      if (songItemNumber !== currentlyPlayingSong){
        event.target.children[0].innerHTML = songItemNumber
      }
    });

    songNumbers[i].addEventListener('click',function(event){
        //getSongItem(this);
        if (currentlyPlayingSong=== null){
          this.innerHTML = pauseButtonTemplate;
          currentlyPlayingSong = this.getAttribute('data-song-number');
        }
        else if (currentlyPlayingSong===event.target.getAttribute('data-song-number')){
          this.innerHTML = playButtonTemplate;
          currentlyPlayingSong = null;
        }
        else if (currentlyPlayingSong !== event.target.getAttribute('data-song-number')){
          var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
          currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
          this.innerHTML = pauseButtonTemplate;
          currentlyPlayingSong = this.getAttribute('data-song-number');
        }
      });
  }
}
// var findParentByClassname = function(element, className){
//   if(element){
//     var currParent = element.parentElement;
//     while(currParent.className != null && currParent.className!=className ){
//       currParent= currParent.parentElement;
//     }
//   return currParent;
//   }
// };

var getSongItem = function(element){
  // returns the element with the song item number class

  // if(element.className == "album-view-song-item"){
  //   parent = element
  // }else{
  //   parent = findParentByClassname(element, "album-view-song-item")
  // }
  //console.log(parent.children[0])
 //console.log(element.className);

 //console.log(currentlyPlayingSong);
  //
  //
  // // input = take an element
  // // output = returns the element with the .song-item-number class
  // switch(parent.className) {
  //   case "song-item-number":
  //   return
  //   break;
  //   case "":
  //   break;
  //   case "":
  //   break;
  // }
};
