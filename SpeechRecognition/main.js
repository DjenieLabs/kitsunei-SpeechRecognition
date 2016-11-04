// ************************************************************************************************************
// Written by Alexander Agudelo <alex.agudelo@asurantech.com>, 2016
// Date: 03/Nov/2016
// Description: Speach Recognition Block based on the annyang library.
// Source: https://github.com/TalAter/annyang/
//
// ------
// Created by Asuran Technologies
// Licensed under MIT.
//
// Copyright (c) 2016 Asuran Technologies
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// ************************************************************************************************************

define(['HubLink', 'RIB', 'PropertiesPanel', 'Easy'], function(Hub, RIB, Ppanel, easy) {
  var _objects = {};
  var SpeechRecognition = {
    settings:{
      Custom: {}
    },
    dataFeed: {}
  };

  // This block doesn't have any action
  SpeechRecognition.getActions = function() {
    return [];
  };

  SpeechRecognition.getInputs = function() {
    var inputs = [
      'SoundStarts', 'CommandMatch', 'ResultNoMatch'
    ];
    for(var command of this.commands){
      inputs.push(command.name.toLowerCase());
    }

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
    var that = this;
    var libPath = that.basePath + 'assets/';

    this.languages = {
      property: 'Languages',
      default: "English (Australia)",
      items: [
        { name: "Afrikaans", value: "af"}, { name: "Basque", value: "eu"},
        { name: "Bulgarian", value: "bg"}, { name: "Catalan", value: "ca"},
        { name: "Arabic (Egypt)", value: "ar-EG"}, { name: "Arabic (Jordan)", value: "ar-JO"},
        { name: "Arabic (Kuwait)", value: "ar-KW"}, { name: "Arabic (Lebanon)", value: "ar-LB"},
        { name: "Arabic (Qatar)", value: "ar-QA"}, { name: "Arabic (UAE)", value: "ar-AE"},
        { name: "Arabic (Morocco)", value: "ar-MA"}, { name: "Arabic (Iraq)", value: "ar-IQ"},
        { name: "Arabic (Algeria)", value: "ar-DZ"}, { name: "Arabic (Bahrain)", value: "ar-BH"},
        { name: "Arabic (Lybia)", value: "ar-LY"}, { name: "Arabic (Oman)", value: "ar-OM"},
        { name: "Arabic (Saudi Arabia)", value: "ar-SA"}, { name: "Arabic (Tunisia)", value: "ar-TN"},
        { name: "Arabic (Yemen)", value: "ar-YE"}, { name: "Czech", value: "cs"},
        { name: "Dutch", value: "nl-NL"}, { name: "English (Australia)", value: "en-AU", selected: true},
        { name: "English (Canada)", value: "en-CA"}, { name: "English (India)", value: "en-IN"},
        { name: "English (New Zealand)", value: "en-NZ"}, { name: "English (South Africa)", value: "en-ZA"},
        { name: "English(UK)", value: "en-GB"}, { name: "English(US)", value: "en-US"},
        { name: "Finnish", value: "fi"}, { name: "French", value: "fr-FR"},
        { name: "Galician", value: "gl"}, { name: "German", value: "de-DE"},
        { name: "Hebrew", value: "he"}, { name: "Hungarian", value: "hu"},
        { name: "Icelandic", value: "is"}, { name: "Italian", value: "it-IT"},
        { name: "Indonesian", value: "id"}, { name: "Japanese", value: "ja"},
        { name: "Korean", value: "ko"}, { name: "Latin", value: "la"},
        { name: "Mandarin Chinese", value: "zh-CN"}, { name: "Traditional Taiwan", value: "zh-TW"},
        { name: "Simplified China", value: "zh-CN ?"}, { name: "Simplified Hong Kong", value: "zh-HK"},
        { name: "Yue Chinese (Traditional Hong Kong)", value: "zh-yue"}, { name: "Malaysian", value: "ms-MY"},
        { name: "Norwegian", value: "no-NO"}, { name: "Polish", value: "pl"},
        { name: "Pig Latin", value: "xx-piglatin"}, { name: "Portuguese", value: "pt-PT"},
        { name: "Portuguese (Brasil)", value: "pt-BR"}, { name: "Romanian", value: "ro-RO"},
        { name: "Russian", value: "ru"}, { name: "Serbian", value: "sr-SP"},
        { name: "Slovak", value: "sk"}, { name: "Spanish (Argentina)", value: "es-AR"},
        { name: "Spanish (Bolivia)", value: "es-BO"}, { name: "Spanish (Chile)", value: "es-CL"},
        { name: "Spanish (Colombia)", value: "es-CO"}, { name: "Spanish (Costa Rica)", value: "es-CR"},
        { name: "Spanish (Dominican Republic)", value: "es-DO"}, { name: "Spanish (Ecuador)", value: "es-EC"},
        { name: "Spanish (El Salvador)", value: "es-SV"}, { name: "Spanish (Guatemala)", value: "es-GT"},
        { name: "Spanish (Honduras)", value: "es-HN"}, { name: "Spanish (Mexico)", value: "es-MX"},
        { name: "Spanish (Nicaragua)", value: "es-NI"}, { name: "Spanish (Panama)", value: "es-PA"},
        { name: "Spanish (Paraguay)", value: "es-PY"}, { name: "Spanish (Peru)", value: "es-PE"},
        { name: "Spanish (Puerto Rico)", value: "es-PR"}, { name: "Spanish (Spain)", value: "es-ES"},
        { name: "Spanish (US)", value: "es-US"}, { name: "Spanish (Uruguay)", value: "es-UY"},
        { name: "Spanish (Venezuela)", value: "es-VE"}, { name: "Swedish", value: "sv-SE"},
        { name: "Turkish", value: "tr"}, { name: "Zulu", value: "zu"}
      ]
    };

    // Load previously stored settings
    if(this.storedSettings && this.storedSettings.commands){
      this.commands = this.storedSettings.commands;
      // Update the languages structure and select the given one
      updateLanguage.call(that, that.storedSettings.language);
    }else{
      // Stores the list of codes
      this.commands = [];
    }

    // Load Dependencies
    require([libPath+'js/annyang.min.js'], function(annyang){
      // Make it global
      that.annyang = annyang;
      that .annyang.debug(true);

      that.annyang.addCallback("soundstart", SpeechRecognition.onSoundStarts, that);
      that.annyang.addCallback("resultMatch", SpeechRecognition.onResultMatch, that);
      that.annyang.addCallback("resultNoMatch", SpeechRecognition.onResultNoMatch, that);
      that.annyang.addCallback('error', function(e) {
        console.log("Error: ", e);
      });
      that.languages.items.some(function(item){
        if(item.selected == true){
          that.annyang.setLanguage(item.value);
          return item.selected;
        }
      });


      that.annyang.start();

      console.log("Voice Recognition lib loaded! ");
    });

    // Load the properties template
    this.loadTemplate('properties.html').then(function(template){
      that.propTemplate = template;
    });

  };

  /**
   * When hasMissingProperties returns <true>
   * the properties window will be open automatically after clicking the
   * canvas block
   */
  SpeechRecognition.hasMissingProperties = function() {
    // Define a logic you want to return true and open the properties window
    return false;
  };

  /**
   * This method is called when the user hits the "Save"
   * recipe button. Any object you return will be stored
   * in the recipe and can be retrieved during startup (@onLoad) time.
   */
  SpeechRecognition.onBeforeSave = function(){
    var selectedLanguage = easy.getValues();
    return {commands: this.commands, language: selectedLanguage.Languages};
  };

  /**
   * Parent is asking me to execute my logic.
   * This block only initiate processing with
   * actions from the hardware.
   */
  SpeechRecognition.onExecute = function(event) {
    var that = this;
    var exists = this.commands.some(function(item){
      if(item.name == event.action){
        console.log("Execute: ", event);
        return true;
      }
    });

    if(!exists){
      console.log("The requested action doesn't exist");
    }
  };

  // TODO: Move this to the block controller
  function save() {
    readInterfaceItems.call(this);
  }

  /**
   * Triggered when the user clicks on a block.
   * The interface builder is automatically opened.
   * Here we must load the elements.
   * NOTE: This is called with the scope set to the
   * Block object, to access this modules properties
   * use SpeechRecognition or this.controller
   */
  SpeechRecognition.onClick = function(){
    Ppanel.stopLoading();
    Ppanel.onSave(save.bind(this));
    renderSettingsWindow.call(this);
  };

  // Converts the dom data-index into current array index
  function _getItemFromIndex(array, index){
    var res = -1;
    array.some(function(item, i){
      if(item.index == index){
        res = i;
        return true;
      }
    });

    return res;
  }

  /**
   * Triggered when a sound (possibly speech)
   * has been detected
   */
  SpeechRecognition.onSoundStarts = function(){
    console.log("Sound started");
    this.processData({soundstart: true});
  };

  /**
   * Triggered when a command has been successfully
   * recognized
   */
  SpeechRecognition.onResultMatch = function(phrase, matchedCommand, alternativePhrases){
    console.log("Phrase: ", phrase, "Matched Command: ", matchedCommand, "AlternativePhrases: ", alternativePhrases);
    // Send data to logic maker for processing
    this.processData({commandmatch: true});
    // Trigger the actual command as input
    var data = {};
    data[matchedCommand] = true;
    this.processData(data);
  };

  /**
   * Triggered when no command was recognized.
   */
  SpeechRecognition.onResultNoMatch = function(possiblePhrases){
    // NOTE: For some reason after new commands are added the
    // library stops recognizing commands and trigger the noMatch
    // event. As workaround we traverse our list of command and
    // perform the comparison ourselves.
    var that = this;
    var res = possiblePhrases.some(function(phrase){
      for(var cmd of that.commands){
        if(cmd.name.toLowerCase() == phrase.trim().toLowerCase()){
          console.log("Command recognized: ", cmd.name);
          // Send data to logic maker for processing
          that.processData({commandmatch: true});
          var obj = {};
          obj[cmd.name.toLowerCase()] = true;
          that.processData(obj);
          return true;
        }
      }
    });
    
    if(!res){
      console.log("No match!");
      this.processData({resultnomatch: true});
    }
  };

  // updates the local languages array 
  // and selects as default the one that has the
  // given value.
  function updateLanguage(value){
    var that = this;
    this.languages.items.forEach(function(item){
      if(item.value == value){
        that.languages.default = item.name;
        item.selected = true;
      }else{
        item.selected = false;
      }
    });
  };

  // Read the current interface and assign the right
  // DOM object to the array instances.
  function readInterfaceItems(){
    var arr = [];
    var that = this;
    // Get back the selected language
    var values = easy.getValues();
    that.annyang.setLanguage(values.Languages);
    updateLanguage.call(this, values.Languages);

    // Update my languages list
    var cmdList = {};
    this.myPropertiesWindow.find(".record-row").each(function(el){
      var index = _getItemFromIndex(that.commands, $(this).attr("data-index"));
      var cmd = $(this).find("input").val();
      that.commands[index].name = cmd;
      cmdList['"' + cmd + '"']  = function(){};
    });

    if(Object.keys(cmdList).length){
      // this.annyang.removeCommands();
      this.annyang.addCommands(cmdList);
    }
  }

  function deleteItem(el){
    // Read back all the commands
    readInterfaceItems.call(this);
    var that = this;
    // Since indices change as we add or delete
    // elements, we MUST search for the actual item
    that.commands.splice(_getItemFromIndex(that.commands, $(el).attr("data-index")), 1);

    renderSettingsWindow.call(this);
  }

  function addNew(){
    // 1) Read the interface
    readInterfaceItems.call(this);

    // add an empty slot
    this.commands.push({index: this.commands.length, name: "Add Command"});


    renderSettingsWindow.call(this);
  }


  function renderSettingsWindow(){
    var that = this;
    Ppanel.clear();
    Ppanel.stopLoading();
    easy.clearCustomSettingsPanel();

    // Compile template using current list
    this.myPropertiesWindow = $(this.propTemplate({command: this.commands, Language: this.languages}));

    // Buttons Event handlers
    this.myPropertiesWindow.find("#btAdd").click(addNew.bind(this));
    this.myPropertiesWindow.find("#btDelete").click(function(){
      deleteItem.call(that, this);
    });

    // Init dropdown component
    this.myPropertiesWindow.find(".dropdown").dropdown();
    // Display elements
    easy.displayCustomSettings(this.myPropertiesWindow, true);

  };

  /**
   * Parent is send new data (using outputs).
   */
  SpeechRecognition.onNewData = function() {};


  return SpeechRecognition;
});
