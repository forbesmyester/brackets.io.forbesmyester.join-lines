/*global define, brackets */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (/* require, exports, module */) {
    
    "use strict";   
    
    
    var CommandManager = brackets.getModule("command/CommandManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        Menus = brackets.getModule("command/Menus"),
        EditorManager = brackets.getModule("editor/EditorManager");

    function handleHelloWorld(seperator) {

        var docTexts = DocumentManager.getCurrentDocument().getText().split("\n"),
            curPos = EditorManager.getCurrentFullEditor().getCursorPos(),
            eol = (function() {
                    var m = docTexts[curPos.line].match(/\s*$/);
                    return {
                        line: curPos.line,
                        ch: m.index
                    };
                }()),
            bol = (function() {
                    if (docTexts.length < curPos.line) {
                        return false;
                    }
                    var m = docTexts[curPos.line+1].match(/^\s*/);
                    return {line: curPos.line+1, ch: m[0].length};
                }())
        ;
        DocumentManager.getCurrentDocument().replaceRange(
            seperator,
            eol,
            bol
        );
        EditorManager.getCurrentFullEditor().setCursorPos(bol);
    }
    
    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID_A = "forbesmyester.join-lines-a";
    var MY_COMMAND_ID_B = "forbesmyester.join-lines-b";
    
    CommandManager.register(
        "Join Lines (No Whitespace)",
        MY_COMMAND_ID_A,
        handleHelloWorld.bind(this, '')
    );

    CommandManager.register(
        "Join Lines",
        MY_COMMAND_ID_B,
        handleHelloWorld.bind(this, ' ')
    );

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(MY_COMMAND_ID_A);
    menu.addMenuItem(MY_COMMAND_ID_B);

    // We could also add a key binding at the same time:
    //menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-H");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});