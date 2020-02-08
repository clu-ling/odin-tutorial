const config = {};

config.port = 7777;

config.odin = {};
config.odin.api = {};
config.odin.api.baseUrl = (process.env.ODIN_API_BASE_URL || "http://localhost:9000/api");
// /api/extract
config.odin.api.extract              = {};
config.odin.api.extract.params       = {};
config.odin.api.extract.params.text  = "text";
config.odin.api.extract.params.rules = "rules";
config.odin.api.extract.params.label = "label";

// `I like turtles.`.trim();

// Editors
config.editor = {};
config.editor.minLines = 20;
config.editor.maxLines = 20;
// TAG settings for Odin
config.tag = {};
config.tag.format              = "odin";
config.tag.showTopArgLabels    = true;
config.tag.showTopMainLabel    = false;
config.tag.bottomLinkCategory  = "none";
config.tag.linkSlotInterval    = 20;
config.tag.rowVerticalPadding  = 80;
config.tag.compactRows         = true;

module.exports = config;
