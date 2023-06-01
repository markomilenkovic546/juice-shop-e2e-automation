class Signup {

    //Get "email" field
    getEmailField(){
        return cy.get('#emailControl')
    }
    
    //Get "password" field
    getPasswordFiled(){
        return cy.get('#passwordControl')
    }
    //Get "Repeat password field"
    getRepeatPasswordFiled(){
        return cy.get('#repeatPasswordControl')
    }

    getSecurityQuestionDropDown() {
        return cy.get('.mat-select-arrow-wrapper')
    }

    getSecurityQuestion() {
        return cy.get('#mat-option-15 > .mat-option-text')
    }

    getChoosenSecurityQuestion() {
        return cy.get('.mat-select-min-line')
    }

    getSecurityAnswerField() {
        return cy.get("#securityAnswerControl")
    }

    getRegisterButton() {
        return cy.get('#registerButton')
    }

    
}

export default Signup