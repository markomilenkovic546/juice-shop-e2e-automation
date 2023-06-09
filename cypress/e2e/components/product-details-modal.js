class ProductDetailsModal {
    getProductDetailsModal() {
        return cy.get(".mat-dialog-content", { timeout: 20000 })
      }

      getCloseDialogButton() {
        return cy.get(".close-dialog");
      }

      getReviewMessageTextBox() {
        return cy.get('[placeholder="What did you like or dislike?"]')
      }

      getSubmitReviewButton() {
        return cy.get('#submitButton')
      }

      getReviewsDropDown() {
        return cy.get('.mat-expansion-panel-header-title')
      }
  }
  
  export default ProductDetailsModal;