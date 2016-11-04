 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
        updateSeekBarWhileSongPlays();
        var $volumeFill = $('.volume .fill');
        var $volumeThumb = $('.volume .thumb');
        $volumeFill.width(currentVolume + '%');
        $volumeThumb.css({left: currentVolume + '%'});
     	// 	currentlyPlayingSongNumber = songNumber;
        // currentSongFromAlbum = currentAlbum.songs[songNumber-1];
        updatePlayerBarSong();
     	} else if (currentlyPlayingSongNumber === songNumber) {
        if (currentSoundFile.isPaused()){
          currentSoundFile.play();
          updateSeekBarWhileSongPlays();
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

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);

             setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
   var offsetXPercent = seekBarFillRatio * 100;
   // #1
   offsetXPercent = Math.max(0, offsetXPercent);
   offsetXPercent = Math.min(100, offsetXPercent);

   // #2
   var percentageString = offsetXPercent + '%';
   $seekBar.find('.fill').width(percentageString);
   $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        // #3
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #4
        var seekBarFillRatio = offsetX / barWidth;

        // #5
        if ($(this).parent().attr('class')== 'seek-control'){
          seek(seekBarFillRatio * currentSoundFile.getDuration());
        }
        else {
          setVolume(seekBarFillRatio * 100);
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();

         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

             if ($seekBar.parent().attr('class') == 'seek-control'){
               seek(seekBarFillRatio * currentSoundFile.getDuration());
             }
             else {
               setVolume(seekBarFillRatio);
             }

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });

         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
};

var setCurrentTimeInPlayerBar = function(currentTime) {
  $('.current-time').text(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime){
  $('.total-time').text(totalTime);
};

var filterTimeCode = function(seconds){
  var minutes = Math.floor(seconds/60)
  var seconds = Math.floor(seconds % 60);
  if (seconds <10){
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  $(".currently-playing .song-name").text(currentSongFromAlbum.title);
  $(".currently-playing .artist-name").text(currentAlbum.artist);
  $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $(".main-controls .play-pause").html(playerBarPauseButton);
  setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
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
  setSong(currentIndex+1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  // currentlyPlayingSongNumber = currentIndex + 1;
  // currentSongFromAlbum= currentAlbum.songs[currentIndex];
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
  setSong(currentIndex+1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  // currentlyPlayingSongNumber = currentIndex + 1;
  // currentSongFromAlbum= currentAlbum.songs[currentIndex];
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

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var togglePlayFromPlayerBar = function() {
  if (currentSoundFile){
    if(currentSoundFile.isPaused()){
      currentSoundFile.play();
      getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
      $playPauseButton.html(playerBarPauseButton);

    }
    else {

      currentSoundFile.pause();
      getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
      $playPauseButton.html(playerBarPlayButton);
    }
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
var $playPauseButton = $('.main-controls .play-pause');


$(document).ready(function(){
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playPauseButton.click(togglePlayFromPlayerBar);
});
