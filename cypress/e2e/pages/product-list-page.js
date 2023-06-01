import Header from '../components/header'



export default class ProductListPage {
    constructor() {
      this.header = new Header()
    }
     
    //Get "email" field
    getEmailField(){
        return cy.get('[name="email"]')
    }
     
    //Get "password" field
    getPasswordField(){
        return cy.get('[name="password"]')
    }
    
    // Get submit login form button
    getSubmitButton(){
        return cy.get('#loginButton')
    }
    
    //Get login modal div
    getLoginModal(){
        return cy.get('.mat-card')
    }


    getSignUpLink() {
        return cy.get('#newCustomerLink > .primary-link')
    }


    getCloseDialogButton() {
        return cy.get('.close-dialog')
    }

/*
    login(email,password) {
        cy.visit('/')
        cy.get('.close-dialog').click()
        cy.get('#navbarAccount').click()
        cy.get('#navbarLoginButton').click()
        cy.get('[name="email"]').type(email)
        cy.get('[name="password"]').type(password)
        cy.get('#loginButton').click()
        
    }
*/


}