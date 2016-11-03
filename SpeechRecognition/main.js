define(['HubLink', 'RIB', 'PropertiesPanel', 'Easy'], function(Hub, RIB, Ppanel, easy) {
  var actions = ["ACTION1", "ACTION2"];
  var inputs = [];
  var _objects = {};
  var SpeechRecognition = {
    settings:{
      Custom: {}
    },
    dataFeed: {}
  };

  // TODO: Review if this is a trully unique instance?

  SpeechRecognition.getActions = function() {
    return actions;
  };

  SpeechRecognition.getInputs = function() {
    return inputs;
  };

  /**
   * Use this method to control the visibility of the DataFeed
   * By default it will show() the DataFeed, change it to true due to hide it. 
   */
  SpeechRecognition.hideDataFeed = function() {
    return false;
  };

  /**
   * Triggered when added for the first time to the side bar.
   * This script should subscribe to all the events and broadcast
   * to all its copies the data.
   * NOTE: The call is bind to the block's instance, hence 'this'
   * does not refer to this module, for that use 'SpeechRecognition'
   */
  SpeechRecognition.onLoad = function(){

  };

  /**
   * When hasMissingProperties returns <true>
   * the properties windown will be open automatically after clicking the 
   * canvas block
   */
  SpeechRecognition.hasMissingProperties = function() {
    // Define a logic you want to return true and open the properties window
    return false;
  };


  /**
   * Allows blocks controllers to change the content
   * inside the Logic Maker container
   */
  SpeechRecognition.lmContentOverride = function(){
    // Use this to inject your custom HTML into the Logic Maker screen.
    return "<div> SpeechRecognition html </div>";
  };

  /**
   * Parent is asking me to execute my logic.
   * This block only initiate processing with
   * actions from the hardware.
   */
  SpeechRecognition.onExecute = function() {


  };

  // TODO: Move this to the block controller
  function save() {

  }

  /**
   * Triggered when the user clicks on a block.
   * The interace builder is automatically opened.
   * Here we must load the elements.
   * NOTE: This is called with the scope set to the
   * Block object, to emailsess this modules properties
   * use SpeechRecognition or this.controller
   */
  SpeechRecognition.onClick = function(){

  };

  /**
   * Parent is send new data (using outputs).
   */
  SpeechRecognition.onNewData = function() {};

  // Returns the current value of my inputs
  // SpeechRecognition.onRead = function(){};

  // Optional event handlers
  SpeechRecognition.onMouseOver = function(){
    // console.log("Mouse Over on ", myself.canvasIcon.id, evt);
  };

  /**
   * A copy has been dropped on the canvas.
   * I need to keep a copy of the processor to be triggered when
   * new data arrives.
   */
  SpeechRecognition.onAddedtoCanvas = function(){};

  return SpeechRecognition;
});
