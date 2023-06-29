import Login from "../pages/login";
import ProductListPage from "../pages/product-list-page";

const login = new Login();
const productListPage = new ProductListPage();

beforeEach(function () {
  // Load user data from a fixture file
  cy.fixture("users").then(data => {
    // Store the loaded data in the 'data' variable for later use
    this.data = data[1];
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

describe("Element existence tests", () => {
  it("Verifies that the h1 exists and contains corerct text", function () {
    // Verify that h1 exist and contains correct text
    cy.get("h1").should("exist").and("have.text", "Login");
  });

  it('Verifies that the "Email" field exists', function () {
    // Verify that email field exist
    login.getEmailField().should("exist").and("have.attr", "name", "email");
  });

  it('Verifies that the "Password" field exists', function () {
    // Verify that password field exist
    login.getPasswordField().should("exist").and("have.attr", "name", "password");
  });

  it('Verifies that the "Forgot your password?" link exists', function () {
    // Verify that "Forgot your password?" link exists
    login.getForgetYourPasswordLink().should("exist").and("have.attr", "href", "#/forgot-password");
  });

  it('Verifies that the "Login" button exists', function () {
    // Verify that the "Login" button exists
    login.getSubmitButton().should("exist");
  });

  it('Verifies that the "Remember me" checkbox exists', function () {
    // Verify that the "Remember me" checkbox exists
    login.getRememberMe().should("exist");
  });

  it('Verifies that the "Ligin with Google" button exists', function () {
    // Verify that the "Ligin with Google" button exists
    login.getLoginWithGoogleButton().should("exist");
  });

  it('Verifies that the "Not yet a customer?" link exists', function () {
    //Verifies that the "Not yet a customer?" link exists
    login.getSignUpLink().should("exist");
  });
});

describe("Login functionalies", () => {
  it("Login by submiting valid credentials", function () {
    // Enter the valid email into the "Email" field
    login.getEmailField().type(this.data.email);

    // Enter the valid password into the "Password" field
    login.getPasswordField().type(this.data.password);

    // Intercept the POST request
    cy.intercept("POST", " https://juice-shop.herokuapp.com/rest/user/login").as("login");

    // Click on the "Login" button
    login.getSubmitButton().click();

    // Click on the account button
    productListPage.header.getAccountButton().click();

    // Verify that the user is successfully loged in
    productListPage.header.getAccountDropDown().find("span").contains(this.data.email);
  });

  it("Login Attempt with invalid password should Fail ", function () {
    // Intercept the POST request
    cy.intercept("POST", " https://juice-shop.herokuapp.com/rest/user/login").as("login");
    //Enter the valid email into the "Email" field
    login.getEmailField().type(this.data.email);

    // Enter the invalid password into the "Email" field
    login.getPasswordField().type(this.data.invalidPassword);

    // Submit login form with invalid password
    login.getSubmitButton().click();

    // Wait for the 'login' request to be intercepted and resolved
    cy.wait("@login").then(interception => {
      // Veify that the statusCode is equal to 401
      cy.wrap(interception).its("response.statusCode").should("eq", 401);
    });
    // Verify that 'Invalid email or password.' text is displayed
    login.getInvalidCredentialsText().contains("Invalid email or password.");
  });

  it("Login Attempt with invalid Email should Fail ", function () {
    // Intercept the POST request
    cy.intercept("POST", " https://juice-shop.herokuapp.com/rest/user/login").as("login");

    // Enter the invalid email into the "Email" field
    login.getEmailField().type(this.data.invalidEmail);

    // Enter the valid password into the "Password" field
    login.getPasswordField().type(this.data.password);

    // Submit login form with invalid password
    login.getSubmitButton().click();

    // Wait for the 'login' request to be intercepted and resolved
    cy.wait("@login").then(interception => {
      // Veify that the statusCode is equal to 401
      cy.wrap(interception).its("response.statusCode").should("eq", 401);
    });
    // Verify that 'Invalid email or password.' text is displayed
    login.getLoginModal().contains("Invalid email or password.");
  });

  it("Login attempt with both blank fields should Fail ", function () {
    //Verify that "Login" button is disabled if the input fields are blank
    login.getSubmitButton().should("be.disabled");
  });

  it("Should not allow login with space as a first character in email field ", function () {
    // Intercept the POST request
    cy.intercept("POST", " https://juice-shop.herokuapp.com/rest/user/login").as("login");

    // Enter "Space" as a only character into the email field
    login.getEmailField().type(" ");

    // Enter the valid password into the "Password" field
    login.getPasswordField().type(this.data.password);

    // Submit login form with invalid password
    login.getSubmitButton().click();

    // Wait for the 'login' request to be intercepted and resolved
    cy.wait("@login").then(interception => {
      // Veify that the statusCode is equal to 401
      cy.wrap(interception).its("response.statusCode").should("eq", 401);
    });
    // Verify that 'Invalid email or password.' text is displayed
    login.getLoginModal().contains("Invalid email or password.");
  });

  it("Should not allow login with space as a first character in password field ", function () {
    // Intercept the POST request
    cy.intercept("POST", " https://juice-shop.herokuapp.com/rest/user/login").as("login");

    // Enter "Space" as a only character into the email field
    login.getEmailField().type(this.data.email);

    // Enter the valid password into the "Password" field
    login.getPasswordField().type(" ");

    // Submit login form with invalid password
    login.getSubmitButton().click();

    // Wait for the 'login' request to be intercepted and resolved
    cy.wait("@login").then(interception => {
      // Veify that the statusCode is equal to 401
      cy.wrap(interception).its("response.statusCode").should("eq", 401);
    });
    // Verify that 'Invalid email or password.' text is displayed
    login.getLoginModal().contains("Invalid email or password.");
  });

  it("Password should be hidden by default", function () {
    // Enter the valid password into the "Password" field
    login.getPasswordField().type(this.data.password);

    // Verify that "Password" field has attribute type="text"
    login.getPasswordField().should("have.attr", "type", "password");
  });

  it("Should show the password", function () {
    // Enter the valid password into the "Password" field
    login.getPasswordField().type(this.data.password);

    // Click on the "Show password" button
    login.getShowPasswordButton().click();

    // Verify that "Password" field has attribute type="text"
    login.getPasswordField().should("have.attr", "type", "text");
  });

  it("Should hide the password", function () {
    // Enter the valid password into the "Password" field
    login.getPasswordField().type(this.data.password);

    // Click on the "Show password" button
    login.getShowPasswordButton().click();

    // Verify that "Password" field has attribute type="text"
    login.getPasswordField().should("have.attr", "type", "text");

    // Click on the "Show password" button
    login.getShowPasswordButton().click();

    // Verify that "Password" field has attribute type="text"
    login.getPasswordField().should("have.attr", "type", "password");
  });

  it("Should navigate to Signup page", function () {
    // CLick on the "Not yet a customer?" link
    login.getSignUpLink().click();

    // Verify that Signup page is open
    cy.url().should("include", "/register");
  });
});
