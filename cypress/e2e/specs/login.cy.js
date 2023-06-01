import Login from '../pages/login'
import ProductListPage from '../pages/product-list-page'

const login = new Login();
const productListPage = new ProductListPage();



beforeEach(function () {
    cy.fixture('users').then((data) => {
      this.data = data;
     
    });
    cy.visit('/')
    productListPage.getCloseDialogButton().click()
    productListPage.header.getAccountButton().click()
    productListPage.header.getLoginButton().click()
    
  });

  describe('Login functionality', () => {

it('Login by submiting valid credentials', function () { 
     // Intercept the POST request
    cy.intercept('POST', ' https://juice-shop.herokuapp.com/rest/user/login').as('login');
    login.getEmailField().type(this.data.email);
    login.getPasswordField().type(this.data.password);
    //Login with valid credentials
    login.getSubmitButton().click();
    //Click on the account button
    productListPage.header.getAccountButton().click();
    productListPage.header.getAccountDropDown().find('span').contains(this.data.email);
    cy.wait('@login').then(interception => {
    const requestBody = interception.request.body
    const postedEmail = requestBody.email 
    const postedPassword = requestBody.password
    cy.wrap(interception).its("response.statusCode").should('eq',200);
    assert(postedEmail === this.data.email, `"Email is correctly posted: ${postedEmail}`);
    assert(postedPassword === this.data.password, `"Password is correctly posted: ${postedPassword}`);
       
})
})


it('Login Attempt with invalid password should Fail ', function () { 
    // Intercept the POST request
   cy.intercept('POST', ' https://juice-shop.herokuapp.com/rest/user/login').as('login')
    login.getEmailField().type(this.data.email)
    login.getPasswordField().type(this.data.invalidPassword)
    //Submit login form with invalid password
    login.getSubmitButton().click()
   cy.wait('@login').then(interception => {
   cy.wrap(interception).its("response.statusCode").should('eq',401)
})
   cy.get('.mat-card').contains('Invalid email or password.')
})


it('Login Attempt with invalid Email should Fail ', function () { 
    // Intercept the POST request
   cy.intercept('POST', ' https://juice-shop.herokuapp.com/rest/user/login').as('login')
    login.getEmailField().type(this.data.invalidEmail)
    login.getPasswordField().type(this.data.password)
    //Submit login form with invalid password
    login.getSubmitButton().click()
   cy.wait('@login').then(interception => {
   cy.wrap(interception).its("response.statusCode").should('eq',401)
})
   login.getLoginModal().contains('Invalid email or password.')
})

it('Login attempt with blank field should Fail ', function () { 
    login.getSubmitButton().should('be.disabled')

})


it('Should not allow login with space as a first character ', function () { 
    cy.intercept('POST', ' https://juice-shop.herokuapp.com/rest/user/login').as('login')
    login.getEmailField().type(' ',' ')
    login.getPasswordField().type(this.data.password)
   
    login.getSubmitButton().click()
    cy.wait('@login').then(interception => {
        cy.wrap(interception).its("response.statusCode").should('eq',401)
     })
    login.getLoginModal().contains('Invalid email or password.')

})
it('Should show the password', function () {
    login.getPasswordField().type(this.data.password)
    login.getShowPasswordButton().click()
    login.getPasswordField().should('have.attr', 'type', 'text')

})

it('Should hide the password', function () {
    login.getPasswordField().type(this.data.password)
    login.getShowPasswordButton().click()
    login.getPasswordField().should('have.attr', 'type', 'text')
    login.getShowPasswordButton().click()
    login.getPasswordField().should('have.attr', 'type', 'password')

})


it("Should navigate to Signup page", function() {
    login.getSignUpLink().click()
    cy.url().should('include', '/register')
})
})




describe('Element existence tests', () => {

it('Verifies that the h1 exists and contains corerct text', function() {
   cy.get('h1').should('have.text', 'Login')

})

it('Verifies that the "Email" field exists', function() {
    login.getEmailField()
    .should('exist')
    .and('have.attr', 'name', 'email')
 
 })

 it('Verifies that the "Password" field exists', function() {
    login.getPasswordField()
    .should('exist')
    .and('have.attr', 'name', 'password')
 
 })

 it('Verifies that the "Forgot your password?" link exists', function() {
    login.getForgetYourPasswordLink()
    .should('exist')
    .and('have.attr', 'href', '#/forgot-password')
 
 })

 it('Verifies that the "Login" button exists', function() {
    login.getSubmitButton()
    .should('exist')
 })

 it('Verifies that the "Remember me" checkbox exists', function() {
    login.getRememberMe()
    .should('exist')
 })

 it('Verifies that the "Ligin with Google" button exists', function() {
    login.getLoginWithGoogleButton()
    .should('exist')
 })


 it('Verifies that the "Not yet a customer?" link exists', function() {
    login.getSignUpLink()
    .should('exist')
 })
 
})

