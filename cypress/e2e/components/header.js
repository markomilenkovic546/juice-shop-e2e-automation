class Header {
      //Get "Account" button from header
    getAccountButton(){
        return cy.get('#navbarAccount')
    }
        
    //get "Account" drop-down
    getAccountDropDown(){
        return cy.get('.mat-menu-content')
        
    }
    
    //Get "Login" button
    getLoginButton(){
        return cy.get('#navbarLoginButton')
    }



}

export default Header;