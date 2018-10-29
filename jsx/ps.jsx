// This script will:
// 1. Upres each clip in the active sequence
// 2. Upres any nested sequences included in the active sequence.
// 3. Tell the user which sequence settings to adjust manually.

if (ExternalObject.AdobeXMPScript === undefined) {
     ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
}

var kPProPrivateProjectMetadataURI = "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";

var scaleVal = prompt("Enter a scale value to upres sequence:", 2.0);

function upResVideo() {

  //Only continue if user enters a scale value.
  if (scaleVal == null || scaleVal == "") {
    return;
  } else {

  // Make an array of all sequence names; will later compare with clip names
  var seqArr = app.project.sequences;
  var seqNameArr = [];
  for (var i = 0; i < seqArr.numSequences; i++) {
    seqNameArr[i] = seqArr[i].name;
  }

  // Make an array of sequences that includes (1) the active sequence
  // and (2) any nested sequences in the active one. This is what the script
  // will loop over.
  var activeSeq = app.project.activeSequence; //Identify the active sequence
  var upResSequences = [activeSeq]; // initialize array with just one item: the active sequence
  var upResSequenceNames = [activeSeq.name]; // initialize an array of sequence names
  var k = 1; // index for array of sequences to upres
  for (var i = 0; i < activeSeq.videoTracks.numTracks; i++) { //loop through each track

    var trackClips = activeSeq.videoTracks[i].clips; //make an array for all clips in track
    for (var j = 0; j < trackClips.numItems; j++) {
      if (seqNameArr.indexOf(trackClips[j].name) > -1) { // add the sequence only if it exists as a clip in the track
        upResSequenceNames[k] = trackClips[j].name;
        upResSequences[k] = seqArr[seqNameArr.indexOf(trackClips[j].name)];
        k++;
      }
    }
  }

  //Loop over each sequence (active + nested sequences) and scale it up
  for (seqIn = 0; seqIn < upResSequences.length; seqIn++) {

    var seq = upResSequences[seqIn];

    for (var i = 0; i < seq.videoTracks.numTracks; i++) { //loop through each track

      var trackClips = seq.videoTracks[i].clips; //make an array for all clips in track
      for (var j = 0; j < trackClips.numItems; j++) {
        var clip = trackClips[j];

          //Go on only if the clip name does not appear in the array of sequences
          if (seqNameArr.indexOf(clip.name) < 0) { //check sequence array for this clip name
          //Scale up each clip by scale value
          var scale = clip.components[1].properties[1];
          scale.setValue(scale.getValue()*scaleVal, 1);

          //If clip has key frames, scale up each key frame individually
          if (scale.isTimeVarying()) { //check for key frames
            var keyTimes = scale.getKeys();
            for (var k = 0; k < keyTimes.length; k++){
              scale.setValueAtKey(keyTimes[k], scaleVal*scale.getValueAtKey(keyTimes[k]), 1);
            }
          };

          var position = clip.components[1].properties[0];
          var xyPosition = position.getValue();

          //Fix x and y positions by multiplying their
          //offset from center by the scale value
          var xOffset = 0.5 - xyPosition[0];
          var newX = 0.5 - scaleVal * xOffset;
          var yOffset = 0.5 - xyPosition[1];
          var newY = 0.5 - scaleVal * yOffset;
          position.setValue([newX,newY], 1);
        }

      }
    }
  }

  alert("Please manually scale the following sequences by " + scaleVal + ": " + upResSequenceNames.join(', '));

  }
}
