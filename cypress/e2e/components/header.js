class Header {
  //Get "Account" button from header
  getAccountButton() {
    return cy.get("#navbarAccount");
  }

  //get "Account" drop-down
  getAccountDropDown() {
    return cy.get(".mat-menu-content");
  }

  //Get "Login" button
  getLoginButton() {
    return cy.get("#navbarLoginButton");
  }

  //Navigate to cart page
  getCartIcon() {
    return cy.get('.mat-toolbar-row > .mat-focus-indicator.ng-star-inserted')
  }
}

export default Header;
