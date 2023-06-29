import Login from "../pages/login";
import Signup from "../pages/signup";
import ProductListPage from "../pages/product-list-page";
const tv4 = require("tv4");

const login = new Login();
const signup = new Signup();
const productListPage = new ProductListPage();

beforeEach(function () {
  // Load users data from a users.json file
  cy.fixture("users").then(data => {
    this.user11_data = data[10];
    this.user12_data = data[11];
  });

  //Visit Homepage
  cy.visit("/");

  //Close "Welcome" dialog
  productListPage.getCloseDialogButton().click();

  //Open "Account" dropdown
  productListPage.header.getAccountButton().click();

  //Navigate to "Login" page
  productListPage.header.getLoginButton().click();

  // Navigate to "Signup" page
  login.getSignUpLink().click();
});

it("FE should post correct data to database by hitting correct endpoints ", function () {
  // Intercept the POST requests
  cy.intercept("POST", " https://juice-shop.herokuapp.com/api/Users").as("signup");
  cy.intercept("POST", " https://juice-shop.herokuapp.com/api/SecurityAnswers/").as("SecurityAnswers");

  // Fill the form and submit
  cy.submitSignupForm(this.user11_data.email, this.user11_data.password, this.user11_data.securityAnswer);

  // Store data from the intercepted "Signup" request
  cy.wait("@signup").then(interception => {
    const requestBody = interception.request.body;
    const postedEmail = requestBody.email;
    const postedPassword = requestBody.password;
    const postedRepeatedPassword = requestBody.passwordRepeat;
    const postedSecurityQuestion = requestBody.securityQuestion.question;
    const postedSecurityAnswer = requestBody.securityQuestion.securityAnswer;

    // Verify that response status code is 201
    cy.wrap(interception).its("response.statusCode").should("eq", 201);

    // Verify that correct email is posted
    assert(postedEmail === this.user11_data.email, `"Correct Email is posted: ${postedEmail}`);

    // Verify that correct password is posted
    assert(postedPassword === this.user11_data.password, `"Correct Password is posted: ${postedPassword}`);

    // Verify that correct repeated password is posted
    assert(
      postedRepeatedPassword === this.user11_data.password,
      `"Correct Repeated Password is posted: ${postedRepeatedPassword}`
    );

    // Verify that security question is posted
    assert(
      postedSecurityQuestion === "Number of one of your customer or ID cards?",
      `"Correct Security Question is posted: ${postedSecurityQuestion}`
    );

    // Verify that security answer is posted
    assert(
      postedSecurityAnswer === this.user11_data.securityAnswer,
      `"Correct Security Answer is posted: ${postedSecurityAnswer}`
    );
  });

  cy.wait("@SecurityAnswers").then(interception => {
    const requestBody = interception.request.body;
    const answer = requestBody.answer;
    const SecurityQuestionId = requestBody.SecurityQuestionId;

    // Verify that response status code is 201
    cy.wrap(interception).its("response.statusCode").should("eq", 201);

    // Verify that correct securityAnswer is posted
    assert(answer === this.user11_data.securityAnswer, `"Correct securityAnswer is posted: ${answer}`);

    // Verify that correct password is posted
    assert(
      SecurityQuestionId === this.user11_data.SecurityQuestionId,
      `"Correct SecurityQuestionId is posted: ${SecurityQuestionId}`
    );
  });
});

it("Schema validation against request body should be successfull ", function () {
  // Intercept the POST requests
  cy.intercept("POST", " https://juice-shop.herokuapp.com/api/Users").as("signup");
  cy.intercept("POST", " https://juice-shop.herokuapp.com/api/SecurityAnswers/").as("SecurityAnswers");

  // Fill the form and submit
  cy.submitSignupForm(this.user12_data.email, this.user12_data.password, this.user12_data.securityAnswer);

  // Store data from the intercepted "Signup" request
  cy.wait("@signup").then(interception => {
    const requestBody = interception.request.body;
    // Validate the request body against the schema
    cy.fixture("json-schemas/signup-form.json").then(schema => {
      // Validate the request body against the schema
      const isValid = tv4.validate(requestBody, schema);
      expect(isValid).to.be.true;
    });
  });
  // Validate the request body against the schema
  cy.wait("@SecurityAnswers").then(interception => {
    const requestBody = interception.request.body;
    cy.fixture("json-schemas/security-answer.json").then(schema => {
      // Validate the request body against the schema
      const isValid = tv4.validate(requestBody, schema);
      expect(isValid).to.be.true;
    });
  });
});
