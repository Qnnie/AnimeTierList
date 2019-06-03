const fetch = require('node-fetch');

/**
 * Gets the HTML of a URL
 * @param {string} url
 * @param  {object} opts 
 * @returns {Promise<string>}
 */
const text = (url, opts) => fetch(url, opts).then(res => res.text());

/**
 * Flattens a nested array into a single array
 * @param {any[]} array 
 * @param {any[]} array
 */
const flatten = (array) => array.reduce((all, item) => all.concat(item), []);

module.exports = { text, flatten };
