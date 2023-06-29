import Login from "../pages/login";
import ProductListPage from "../pages/product-list-page";
const tv4 = require("tv4");

const login = new Login();
const productListPage = new ProductListPage();

beforeEach(function () {
  // Load user data from a fixture file
  cy.fixture("users").then(data => {
    // Store the loaded data in the 'data' variable for later use
    this.user12_data = data[11];
  });
  // Visit Homepage
  cy.visit("/");

  // Close "Welcome" dialog
  productListPage.getCloseDialogButton().click();

  // Open "Account" dropdown
  productListPage.header.getAccountButton().click();

  // Navigate to "Login" page
  productListPage.header.getLoginButton().click();
});

it("Login by submiting valid credentials", function () {
  // Intercept the POST request
  cy.intercept("POST", " https://juice-shop.herokuapp.com/rest/user/login").as("login");

  // Fill the login form with valid credentials and submit
  cy.login(this.user12_data.email, this.user12_data.password);

  // Store data from the intercepted "Login" request
  cy.wait("@login").then(interception => {
    const requestBody = interception.request.body;
    const postedEmail = requestBody.email;
    const postedPassword = requestBody.password;

    // Verify that response status code is 200
    cy.wrap(interception).its("response.statusCode").should("eq", 200);

    // Verify that correct email is posted
    assert(postedEmail === this.user12_data.email, `"Correct Email is posted: ${postedEmail}`);

    // Verify that correct password is posted
    assert(postedPassword === this.user12_data.password, `"Correct Password is posted: ${postedPassword}`);
  });
});

it("Schema validation against request body should be successfull ", function () {
  // Intercept the POST request
  cy.intercept("POST", " https://juice-shop.herokuapp.com/rest/user/login").as("login");

  // Fill the login form with valid credentials and submit
  cy.login(this.user12_data.email, this.user12_data.password);

  // Store data from the intercepted "login" request
  cy.wait("@login").then(interception => {
    const requestBody = interception.request.body;
    // Validate the request body against the schema
    cy.fixture("json-schemas/login-form.json").then(schema => {
      const isValid = tv4.validate(requestBody, schema);
      expect(isValid).to.be.true;
    });
  });
});
