/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/grades";
const HTML_LINK = "grades.html";

exports.getHomeItem = function() {
	return {
      "image": "list-ol",
      "color": "green",
      "path": PATH,
      "link": HTML_LINK,
      "title": "Grades",
      "description": "Grades Overview"
   };
};

exports.getMenuItem = function() {
	return {  
      "name": "Grades",
      "path": PATH,
      "link": HTML_LINK
   };
};
