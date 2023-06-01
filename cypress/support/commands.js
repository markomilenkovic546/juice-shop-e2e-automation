import Login from '../e2e/pages/product-list-page'
import ProductListPage from '../e2e/pages/product-list-page'

const login = new Login();
const productListPage = new ProductListPage();





Cypress.Commands.add('login', (email, password) => {
   
    cy.visit('/')
    cy.get('.close-dialog').click()
    productListPage.header.getAccountButton().click()
    productListPage.header.getLoginButton().click()
    login.getEmailField().type(email)
    login.getPasswordField().type(password)
    login.getSubmitButton().click()
    })

