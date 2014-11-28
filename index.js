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

var cli = require('commander');
var path = require('path');
var fs = require('fs');

module.exports = {

  init: function (version, options) {

    //set the version based on the SuperJS' version
    cli.version(version);

    //add -v and --version aliases to the -V version command
    cli.option('-v, --version', '', cli.versionInformation);

    //determine the cli and cmd paths
    var cliPath = path.dirname(process.mainModule.filename);
    var cmdPath = cliPath + '/commands';

    //get list of commands based on file name
    var commands = fs.readdirSync(cmdPath);

    //bind each command
    commands.map(function (fileName) {

      //load the command definition
      var def = require(cmdPath + "/" + fileName.split('.')[0]);

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

        //set the action
        cmd.action(def.action);

      }

    });

    //return the interface to commander
    return cli;

  },

  start: function() {

    //parse the command line arguments
    cli.parse(process.argv);

  }

};