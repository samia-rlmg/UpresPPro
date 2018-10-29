// Get a reference to a CSInterface object
var csInterface = new CSInterface();
var button = window.document.getElementById("btn");

button.onclick = function() {
  // Call function defined in host/ps.jsx
  csInterface.evalScript("upResVideo()");
};
