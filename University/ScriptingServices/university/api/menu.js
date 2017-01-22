/* globals $ */
/* eslint-env node, dirigible */

var response = require('net/http/response');
var launchpadExtensions = require('university/extension/launchpadExtensionUtils');

var menuItems = launchpadExtensions.getMenuItems();

response.println(JSON.stringify(menuItems));
response.flush();
response.close();
