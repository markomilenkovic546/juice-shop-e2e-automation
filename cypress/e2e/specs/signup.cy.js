import Login from "../pages/login";
import Signup from "../pages/signup";
import ProductListPage from "../pages/product-list-page";

const login = new Login();
const signup = new Signup();
const productListPage = new ProductListPage();

describe("Signup functionality", () => {
  beforeEach(function () {
    cy.fixture("users").then(data => {
      this.data = data;
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

  it("Should successfully signup ", function () {
    //Verify that Signup page is open
    cy.url().should("include", "/register");

    // Enter the valid email into the "Email" field
    signup.getEmailField().type(this.data.email);

    // Enter the valid email into the "Email" field
    signup.getEmailField().should("have.value", this.data.email);

    // Enter the valid password into the "Password" field
    signup.getPasswordFiled().type(this.data.password);

    // Verify that "Password" field displays corerct password
    signup.getPasswordFiled().should("have.value", this.data.password);
    // Enter the valid password into the "Repeat field password field"
    signup.getRepeatPasswordFiled().type(this.data.password);

    // Verify that "Repeat password" field displays corerct password
    signup.getRepeatPasswordFiled().should("have.value", this.data.password);

    // Wait 1500 miliseconds
    cy.wait(1500);

    // Open the "Security question" drop down
    signup.getSecurityQuestionDropDown().click();

    // Select the question "Number of one of your customer or ID cards" 
    signup.getSecurityQuestion().click();

    // Verify that correct qusestion is selected
    signup.getChoosenSecurityQuestion().should("have.text", "Number of one of your customer or ID cards?");

    // Type answer into the "Secutiry answer" field
    signup.getSecurityAnswerField().type(this.data.securityAnswer);

    // Verify that the "Secutiry answer" field corerctly displays typed text
    signup.getSecurityAnswerField().should("have.value", this.data.securityAnswer);

    // Submit the "Signup" form
    signup.getRegisterButton().click();

    // Verify that "Registration completed successfully. You can now log in." message is shown
    cy.get("body").contains("Registration completed successfully. You can now log in.")
  });
});
