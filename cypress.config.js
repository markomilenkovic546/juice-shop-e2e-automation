const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  //retries: {openMode: 2, runMode: 1},
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    excludeSpecPattern: '**/cypress/e2e/1-getting-started',
    baseUrl:"https://juice-shop.herokuapp.com/"
  },
});
