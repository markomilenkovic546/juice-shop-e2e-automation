import Login from '../pages/login'
import Signup from '../pages/signup'
import ProductListPage from '../pages/product-list-page'

const login = new Login();
const signup = new Signup();
const productListPage = new ProductListPage();

describe('Signup functionality', () => {

beforeEach(function () {
    cy.fixture('users').then((data) => {
      this.data = data;
     
    });
    cy.visit('/')
    
  });


  it('Should successfully signup ', function () { 
    cy.get('.close-dialog').click()
    productListPage.header.getAccountButton().click()
    productListPage.header.getLoginButton().click()
    login.getSignUpLink().click()
    cy.url().should('include', '/register');
    signup.getEmailField().type(this.data.email)
    signup.getEmailField().should('have.value', this.data.email)
    signup.getPasswordFiled().type(this.data.password)
    signup.getPasswordFiled().should('have.value', this.data.password)
    signup.getRepeatPasswordFiled().type(this.data.password)
    signup.getRepeatPasswordFiled().should('have.value', this.data.password)
    cy.wait(1500)
    signup.getSecurityQuestionDropDown().click()
    signup.getSecurityQuestion().click()
    signup.getChoosenSecurityQuestion().should('have.text', 'Number of one of your customer or ID cards?')
    signup.getSecurityAnswerField().type(this.data.securityAnswer)
    signup.getSecurityAnswerField().should('have.value', this.data.securityAnswer)
    signup.getRegisterButton().click()
    cy.get("body").contains("Registraion complited succesfuly")
    
    

})

})

