 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

     var clickHandler = function() {
       var songNumber = parseInt($(this).attr('data-song-number'));

     	if (currentlyPlayingSongNumber !== null) {
     		// Revert to song number for currently playing song because user started playing new song.
     		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
     		currentlyPlayingCell.html(currentlyPlayingSongNumber);
     	}
     	if (currentlyPlayingSongNumber !== songNumber) {
     		// Switch from Play -> Pause button to indicate new song is playing.
     		$(this).html(pauseButtonTemplate);
        setSong(songNumber);
        currentSoundFile.play();
     	// 	currentlyPlayingSongNumber = songNumber;
        // currentSongFromAlbum = currentAlbum.songs[songNumber-1];
        updatePlayerBarSong();
     	} else if (currentlyPlayingSongNumber === songNumber) {
        if (currentSoundFile.isPaused()){
          currentSoundFile.play();
          $(this).html(pauseButtonTemplate);
          $(".main-controls .play-pause").html(playerBarPauseButton);
        }
        else {
          currentSoundFile.pause();
     		// Switch from Pause -> Play button to pause currently playing song.
     		$(this).html(playButtonTemplate);
        $(".main-controls .play-pause").html(playerBarPlayButton);
     	// 	currentlyPlayingSongNumber = null;
        // currentSongFromAlbum = null;
        }
     	}
     };

     var onHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
       var songNumber = parseInt(songNumberCell.attr('data-song-number'));
       //console.log ("song number: " + songNumber + " Currently Playing Song Number: " + currentlyPlayingSongNumber);
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

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  $(".currently-playing .song-name").text(currentSongFromAlbum.title);
  $(".currently-playing .artist-name").text(currentAlbum.artist);
  $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $(".main-controls .play-pause").html(playerBarPauseButton);
};


var nextSong = function(){
  var originalSong = currentSongFromAlbum;
  var originalIndex=trackIndex(currentAlbum, currentSongFromAlbum);
  var currentIndex = originalIndex;
  if (currentIndex< currentAlbum.songs.length-1){
    currentIndex+=1;
  }
  else {
    currentIndex=0;
  }
  console.log("was: " + currentSongFromAlbum.title);
  setSong(currentIndex+1);
  currentSoundFile.play();
  // currentlyPlayingSongNumber = currentIndex + 1;
  // currentSongFromAlbum= currentAlbum.songs[currentIndex];
  console.log("now: " + currentSongFromAlbum.title);

  updatePlayerBarSong();
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(originalIndex + 1);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(originalIndex + 1);

};

var previousSong = function() {
  var originalSong = currentSongFromAlbum;
  var originalIndex=trackIndex(currentAlbum, currentSongFromAlbum);
  var currentIndex = originalIndex;
  if (currentIndex > 0){
    currentIndex-=1;
  }
  else {
    currentIndex= currentAlbum.songs.length-1;
  }
  console.log("was: " + currentSongFromAlbum.title);
  setSong(currentIndex+1);
  currentSoundFile.play();
  // currentlyPlayingSongNumber = currentIndex + 1;
  // currentSongFromAlbum= currentAlbum.songs[currentIndex];
  console.log("now: " + currentSongFromAlbum.title);

  updatePlayerBarSong();
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(originalIndex + 1);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(originalIndex + 1);
};

var setSong =  function(songNumber){
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber-1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });
  setVolume (currentVolume);
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var songNumbers = document.getElementsByClassName('song-item-number');
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');


$(document).ready(function(){
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
