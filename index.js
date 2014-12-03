/*


  sSSs   .S       S.    .S_sSSs      sSSs   .S_sSSs        .S    sSSs
 d%%SP  .SS       SS.  .SS~YS%%b    d%%SP  .SS~YS%%b      .SS   d%%SP
d%S'    S%S       S%S  S%S   `S%b  d%S'    S%S   `S%b     S%S  d%S'
S%|     S%S       S%S  S%S    S%S  S%S     S%S    S%S     S%S  S%|
S&S     S&S       S&S  S%S    d*S  S&S     S%S    d*S     S&S  S&S
Y&Ss    S&S       S&S  S&S   .S*S  S&S_Ss  S&S   .S*S     S&S  Y&Ss
`S&&S   S&S       S&S  S&S_sdSSS   S&S~SP  S&S_sdSSS      S&S  `S&&S
  `S*S  S&S       S&S  S&S~YSSY    S&S     S&S~YSY%b      S&S    `S*S
   l*S  S*b       d*S  S*S         S*b     S*S   `S%b     d*S     l*S
  .S*P  S*S.     .S*S  S*S         S*S.    S*S    S%S    .S*S    .S*P
sSS*S    SSSbs_sdSSS   S*S          SSSbs  S*S    S&S  sdSSS   sSS*S
YSS'      YSSP~YSSY    S*S           YSSP  S*S    SSS  YSSY    YSS'
                       SP                  SP
                       Y                   Y

 */

/**
 * Build CLI tools rapidly with SuperJS Commander!
 */

"use strict";

var cli = require('commander');
var path = require('path');
var fs = require('fs');
var Class = require('superjs-base');

module.exports = Class.extend({

  init: function (config) {

    var self = this;
    this.config = config;

    //set the version based on the SuperJS' version
    cli.version(config.version);

    if( config.versionAliases && config.versionAliase === true ) {
      //add -v and --version aliases to the -V version command
      cli.option('-v, --version', '', cli.versionInformation);
    }

    if( config.autoHelp && config.autoHelp === true ) {
      //display help information when the option is unknown
      cli.unknownOption = cli.help;
    }

    //determine the cli and cmd paths
    config.cliPath = (config.cliPath) ? config.cliPath : path.dirname(process.mainModule.filename);
    config.cmdPath = (config.cmdPath) ? config.cmdPath : config.cliPath + '/commands';

    //get list of commands based on file name
    var commands = fs.readdirSync(config.cmdPath);

    //bind each command
    commands.map(function (fileName) {

      //load the command definition
      var Definition = require(config.cmdPath + "/" + fileName.split('.')[0]);
      var def = new Definition(self);

      //TODO: make sure all public methods of Commander are addressed

      //make sure at least a command and action has been specified
      if (def.command && def.action) {

        //create new command
        var cmd = cli.command(def.command);

        //apply alias
        if (def.alias) {
          cmd.alias(def.alias);
        }

        //set description
        if (def.description) {
          cmd.description(def.description);
        }

        //apply options
        if (def.options && typeof def.options == 'object') {
          def.options.forEach(function (option) {
            cmd.option.apply(cmd, option);
          });
        }

        //set the command action
        cmd.action(function() {

          //provide access to the underlying commander command object
          def._cmd = this;

          //redirect the action maintaining the this property for our class
          def.action.apply(def,arguments);

        });

      }

    });

    //return the interface to commander
    return cli;

  },

  parse: function() {

    //parse the command line arguments
    var results = cli.parse(process.argv);

    //display help on empty command
    if( this.config.autoHelp ) {
      if( results.args.length === 0 ) {
        cli.help();
      }
    }

    return results;

  }

});