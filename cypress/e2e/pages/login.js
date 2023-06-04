import Header from "../components/header";

export default class Login {
  constructor() {
    this.header = new Header();
  }

  //Get "email" field
  getEmailField() {
    return cy.get('[name="email"]');
  }

  //Get "password" field
  getPasswordField() {
    return cy.get('[name="password"]');
  }

  // Get submit login form button
  getSubmitButton() {
    return cy.get("#loginButton");
  }

  //Get login modal div
  getLoginModal() {
    return cy.get(".mat-card");
  }

  getSignUpLink() {
    return cy.get("#newCustomerLink > .primary-link");
  }

  getShowPasswordButton() {
    return cy.get(".mat-form-field-suffix > .mat-focus-indicator > .mat-button-wrapper");
  }
  getForgetYourPasswrodLink() {
    return cy.get(".forgot-pw");
  }

  getForgetYourPasswordLink() {
    return cy.get("a").contains("Forgot your password?");
  }

  getRememberMe() {
    return cy.get("#rememberMe");
  }

  getLoginWithGoogleButton() {
    return cy.get("#loginButtonGoogle");
  }

  getInvalidCredentialsText() {
    return cy.get(".mat-card");
  }
}
