/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/students";
const HTML_LINK = "students.html";

exports.getHomeItem = function() {
	return {
      "image": "address-card-o",
      "color": "blue",
      "path": PATH,
      "link": HTML_LINK,
      "title": "Students",
      "description": "Students List"
   };
};

exports.getMenuItem = function() {
	return {  
      "name": "Students",
      "path": PATH,
      "link": HTML_LINK
   };
};
