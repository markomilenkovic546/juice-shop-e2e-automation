class Signup {
  //Get "email" field
  getEmailField() {
    return cy.get("#emailControl");
  }

  //Get "password" field
  getPasswordField() {
    return cy.get("#passwordControl");
  }
  //Get "Repeat password field"
  getRepeatPasswordFiled() {
    return cy.get("#repeatPasswordControl");
  }

  getSecurityQuestionDropDown() {
    return cy.get(".mat-select-arrow-wrapper");
  }

  getSecurityQuestion() {
    return cy.get("#mat-option-15 > .mat-option-text");
  }

  getChoosenSecurityQuestion() {
    return cy.get(".mat-select-min-line");
  }

  getSecurityAnswerField() {
    return cy.get("#securityAnswerControl");
  }

  getRegisterButton() {
    return cy.get("#registerButton");
  }

  getEmailDiv() {
    return cy.get('.mat-form-field-invalid > .mat-form-field-wrapper')
  }

  getPasswordDiv() {
    return cy.get('.mat-form-field-wrapper')
  }

  getRepeatPasswordDiv() {
    return cy.get(".mat-form-field-wrapper")
  }

  getPasswordAdviceToggle(){
    return cy.get('.mat-slide-toggle-bar')
  }

  getAlreadyAcustomerLink(){
    return cy.get("a").contains("Already a customer")
  }
}

export default Signup;
