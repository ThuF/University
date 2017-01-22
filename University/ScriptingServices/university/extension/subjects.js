/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/subjects";
const HTML_LINK = "subjects.html";

exports.getHomeItem = function() {
	return {
      "image": "file-text",
      "color": "red",
      "path": PATH,
      "link": HTML_LINK,
      "title": "Subjects",
      "description": "Subjects Overview"
   };
};

exports.getMenuItem = function() {
	return {  
      "name": "Subjects",
      "path": PATH,
      "link": HTML_LINK
   };
};
