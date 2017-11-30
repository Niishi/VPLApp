function onLoad() {
    editor = ace.edit("input_txt");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/github");
    editor.setFontSize(20);
    editor.setHighlightActiveLine(false);
}
