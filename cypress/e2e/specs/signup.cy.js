import Login from "../pages/login";
import Signup from "../pages/signup";
import ProductListPage from "../pages/product-list-page";

const login = new Login();
const signup = new Signup();
const productListPage = new ProductListPage();


beforeEach(function () {
  // Load users data from a users.json file
  cy.fixture("users").then(data => {
    this.user1_data = data[0];
    this.user2_data = data[1];
    this.user3_data = data[2];
    this.user4_data = data[3];
    this.user5_data = data[4];
    this.user6_data = data[5];
    this.user7_data = data[6];
    this.user8_data = data[7];
    this.user9_data = data[8];
    this.user10_data = data[9];
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


describe("Element existence tests", () => {
  it("Verifies that the h1 exists and contains corerct text", function () {
    // Verify that h1 exist and contains correct text
    cy.get("h1")
      .should("exist")
      .and("have.text", "User Registration");
  });

  it('Verifies that the "Email" field exists', function () {
    // Verify that email field exist
    signup.getEmailField()
      .should("exist")
      .and("have.attr", "type", "text");
  });

  it('Verifies that the "Password" field exists', function () {
    // Verify that password field exist
    signup.getPasswordField()
      .should("exist")
      .and("have.attr", "type", "password");
  });

  it('Verifies that the "Repeat Password" field exists', function () {
    // Verify that Repeat password field exist
    signup.getRepeatPasswordFiled()
      .should("exist")
      .and("have.attr", "type", "password");
  });

  it('Verifies that the "Show Password Advice" toggle exists', function () {
    // Verifies that the "Show Password Advice" toggle exists
    signup.getPasswordAdviceToggle().should("exist");
  });

  it('Verifies that the "Security question" dropdown exists', function () {
    // Verifies that the "Security question" dropdown exists
    signup.getSecurityQuestionDropDown()
      .should("exist");

  });

  it('Verifies that the "Security Answer" field exists', function () {
    // Verifies that the "Security Answer" field exists
    signup.getSecurityAnswerField()
      .should("exist")
      .and("have.attr", "type", "text")
      .and("have.attr", "placeholder", "Answer to your security question");
  });

  it('Verifies that the "Register" button exists', function () {
    //Verifies that the "Register" button exists
    signup.getRegisterButton()
      .should("exist")
      .and("have.attr", "type", "submit");
  });

  it('Verifies that the "Already a customer" link exists', function () {
    //Verifies that the "Already a customer" link exists
    signup.getAlreadyAcustomerLink()
      .should("exist")
      .and("have.text", "Already a customer?")
      .and("have.attr", "href", "#/login");
  });

});




describe("Sign Up functionalites", () => {

  it("Should successfully sign up ", function () {
    //Verify that Signup page is open
    cy.url().should("include", "/register");

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user2_data.email);

    // Enter the valid email into the "Email" field
    signup.getEmailField().should("have.value", this.user2_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type(this.user2_data.password);

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", this.user2_data.password);

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.user2_data.password);

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", this.user2_data.password);

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user2_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user2_data.securityAnswer);

    // Intercept the "Sign up" POST request
    cy.intercept("POST", " https://juice-shop.herokuapp.com/api/Users").as("signup");

    // Submit the "Signup" form
    signup.getRegisterButton().click();

    // Verify that "Registration completed successfully. You can now log in." message is shown
    cy.get("body").contains("Registration completed successfully. You can now log in.");


    // Store data from the intercepted "Login" request
    cy.wait("@signup").then(interception => {
      const requestBody = interception.request.body;
      const postedEmail = requestBody.email;
      const postedPassword = requestBody.password;
      const postedRepeatedPassword = requestBody.passwordRepeat
      const postedSecurityQuestion = requestBody.securityQuestion.question
      const postedSecurityAnswer = requestBody.securityQuestion.securityAnswer

      // Verify that response status code is 200
      cy.wrap(interception).its("response.statusCode").should("eq", 200);

      // Verify that correct email is posted
      assert(postedEmail === this.user2_data.email, `"Correct Email is posted: ${postedEmail}`);

      // Verify that correct password is posted
      assert(postedPassword === this.user2_data.password, `"Correct Password is posted: ${postedPassword}`);

      // Verify that correct repeated password is posted
      assert(postedRepeatedPassword === this.user2_data.password, `"Correct Repeated Password is posted: ${postedRepeatedPassword}`);

      // Verify that security question is posted
      assert(postedSecurityQuestion === "Number of one of your customer or ID cards?", `"Correct Security Question is posted: ${postedSecurityQuestion}`);
      
      // Verify that security answer is posted
      assert(postedSecurityAnswer === this.user2_data.securityAnswer, `"Correct Security Question is posted: ${postedSecurityAnswer}`);
  
    });

    
  });

  it("Cannot Sign up more than once posting same email address", function () {
    //Verify that Signup page is open
    cy.url().should("include", "/register");

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user2_data.email);

    // Enter the valid email into the "Email" field
    signup.getEmailField().should("have.value", this.user2_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type(this.user2_data.password);

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", this.user2_data.password);

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.user2_data.password);

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", this.user2_data.password);

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user2_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user2_data.securityAnswer);

    // Submit the "Signup" form
    signup.getRegisterButton().click();

    // Verify that "Email must be unique" message is shown
    cy.get("body").contains("Email must be unique")
  });


  it('Cannot Signup with empty Email field', function () {

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type(this.user1_data.password);

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", this.user1_data.password);

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.user1_data.password);

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", this.user1_data.password);

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user1_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user1_data.securityAnswer);

    // Verify that "Register" button is disabled when email field is empty
    signup.getRegisterButton().should("have.attr", "disabled", "disabled");

  })


  it('Cannot Signup with invalid Email format', function () {

    // Enter the invalid email format into the "Email" field
    signup.getEmailField().type("email@@gmail.com");

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type(this.user1_data.password);

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", this.user1_data.password);

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.user1_data.password);

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", this.user1_data.password);

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user1_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user1_data.securityAnswer);

    // Verify that "Email address is not valid." is shown
    signup.getEmailDiv().should("contain", "Email address is not valid.")

    // Verify that "Register" button is disabled when email field is empty
    signup.getRegisterButton().should("have.attr", "disabled", "disabled");

  })

  it('Cannot Signup with empty Password field', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user1_data.email);

    // Verify that "Email" field displays corerct text
    signup.getEmailField().should("have.value", this.user1_data.email);

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.user1_data.password);

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", this.user1_data.password);

    // Wait 1000 miliseconds
    cy.wait(1000);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user1_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user1_data.securityAnswer);

    // Verify that "Password must be 5-40 characters long." message is shown
    cy.get("body").should("contain", "Password must be 5-40 characters long.")

    // Verify that "Register" button is disabled when email field is empty
    signup.getRegisterButton().should("have.attr", "disabled", "disabled");

  })


  it('Cannot Signup with empty "Repeat Password" field', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user1_data.email);

    // Verify that "Email" field displays corerct text
    signup.getEmailField().should("have.value", this.user1_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type(this.user1_data.password);

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", this.user1_data.password);

    // Wait 1000 miliseconds
    cy.wait(1000);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user1_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user1_data.securityAnswer);

    cy.get("body").should("contain", "Password must be 5-40 characters long.")

    // Verify that "Register" button is disabled 
    signup.getRegisterButton().should("have.attr", "disabled", "disabled");

  })



  it('Cannot Signup with with too short password', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user1_data.email);

    // Verify that "Email" field displays corerct text
    signup.getEmailField().should("have.value", this.user1_data.email);

    //Enter the password shorter than 5 characters into the "Password" field
    signup.getPasswordField().type(this.user1_data.tooShortPassword);

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.user1_data.tooShortPassword);

    // Wait 1000 miliseconds
    cy.wait(1000);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user1_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user1_data.securityAnswer);

    //Verify that "Password must be 5-40 characters long." is displayed
    cy.get("body").should("contain", "Password must be 5-40 characters long.")

    // Verify that "Register" button is disabled 
    signup.getRegisterButton().should("have.attr", "disabled", "disabled");

  })


  it('Cannot Signup with too long password', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user1_data.email);

    // Verify that "Email" field displays corerct text
    signup.getEmailField().should("have.value", this.user1_data.email);

    //Enter the password shorter than 5 characters into the "Password" field
    signup.getPasswordField().type(this.user1_data.tooLongPassword);

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.user1_data.tooLongPassword);

    // Wait 1000 miliseconds
    cy.wait(1000);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user1_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user1_data.securityAnswer);

    //Verify that "Password must be 5-40 characters long." is displayed
    cy.get("body").should("contain", "Password must be 5-40 characters long.")

    // Verify that "Register" button is disabled 
    signup.getRegisterButton().should("have.attr", "disabled", "disabled");

  })



  it('password should accept password of 5 characters', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user2_data.email);

    // Enter the valid email into the "Email" field
    signup.getEmailField().should("have.value", this.user2_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type(this.user2_data.password);

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", this.user2_data.password);

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.user2_data.password);

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", this.user2_data.password);

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user2_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user2_data.securityAnswer);

    // Verify that "Register" button is not disabled 
    signup.getRegisterButton().should("not.have.attr", "disabled", "disabled");

    // Click on the "Register" button
    signup.getRegisterButton().click()

    // Verify that "Registration completed successfully. You can now log in." message is shown
    cy.get("body").contains("Registration completed successfully. You can now log in.")


  })

  it('Password filed should accept password of 40 characters', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user3_data.email);

    // Verify that email field displays correct text
    signup.getEmailField().should("have.value", this.user3_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type(this.user3_data.longPassword);

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", this.user3_data.longPassword);

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.user3_data.longPassword);

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", this.user3_data.longPassword);

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user3_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user3_data.securityAnswer);

    // Verify that "Register" button is not disabled 
    signup.getRegisterButton().should("not.have.attr", "disabled", "disabled");

    // Click on the "Register" button
    signup.getRegisterButton().click()

    // Verify that "Registration completed successfully. You can now log in." message is shown
    cy.get("body").contains("Registration completed successfully. You can now log in.")


  })


  it('Password field should accept characters', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user4_data.email);

    // Verify that email field displays correct text
    signup.getEmailField().should("have.value", this.user4_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type("asdfg");

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", "asdfg");

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type("asdfg");

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", "asdfg");

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user4_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user4_data.securityAnswer);

    // Verify that "Register" button is not disabled 
    signup.getRegisterButton().should("not.have.attr", "disabled", "disabled");

    // Click on the "Register" button
    signup.getRegisterButton().click()

    // Verify that "Registration completed successfully. You can now log in." message is shown
    cy.get("body").contains("Registration completed successfully. You can now log in.")


  })


  it('Password field should accept special characters', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user5_data.email);

    // Verify that email field displays correct text
    signup.getEmailField().should("have.value", this.user5_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type("#$%^!");

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", "#$%^!");

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type("#$%^!");

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", "#$%^!");

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user5_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user5_data.securityAnswer);

    // Verify that "Register" button is not disabled 
    signup.getRegisterButton().should("not.have.attr", "disabled", "disabled");

    // Click on the "Register" button
    signup.getRegisterButton().click()

    // Verify that "Registration completed successfully. You can now log in." message is shown
    cy.get("body").contains("Registration completed successfully. You can now log in.")


  })

  it('Password field should accept combination of characters and special characters', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user6_data.email);

    // Verify that email field displays correct text
    signup.getEmailField().should("have.value", this.user6_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type("#d%aa");

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", "#d%aa");

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type("#d%aa");

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", "#d%aa");

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user6_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user6_data.securityAnswer);

    // Verify that "Register" button is not disabled 
    signup.getRegisterButton().should("not.have.attr", "disabled", "disabled");

    // Click on the "Register" button
    signup.getRegisterButton().click()

    // Verify that "Registration completed successfully. You can now log in." message is shown
    cy.get("body").contains("Registration completed successfully. You can now log in.")


  })


  it('Password field should accept numbers', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user7_data.email);

    // Verify that email field displays correct text
    signup.getEmailField().should("have.value", this.user7_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type("123456");

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", "123456");

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type("123456");

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", "123456");

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user7_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user7_data.securityAnswer);

    // Verify that "Register" button is not disabled 
    signup.getRegisterButton().should("not.have.attr", "disabled", "disabled");

    // Click on the "Register" button
    signup.getRegisterButton().click()

    // Verify that "Registration completed successfully. You can now log in." message is shown
    cy.get("body").contains("Registration completed successfully. You can now log in.")


  })


  it('Password field should accept combination of numbers and characters', function () {

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.user8_data.email);

    // Verify that email field displays correct text
    signup.getEmailField().should("have.value", this.user8_data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordField().type("12hj45");

    // Verify that "Password" field displays corerct password
    signup.getPasswordField().should("have.value", "12hj45");

    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type("12hj45");

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", "12hj45");

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.user8_data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.user8_data.securityAnswer);

    // Verify that "Register" button is not disabled 
    signup.getRegisterButton().should("not.have.attr", "disabled", "disabled");

    // Click on the "Register" button
    signup.getRegisterButton().click()

    // Verify that "Registration completed successfully. You can now log in." message is shown
    cy.get("body").contains("Registration completed successfully. You can now log in.")


  })


});


