describe('Signing in', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="signin"]').click();
  });

  it('Invalid fields should produced ', () => {
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.get('form').submit();

    cy.get('[data-cy="field-error"]').should('have.length', 2);
  });

  it('Incorrect username/password should display error message', () => {
    cy.get('input[name="username"]').type('test');
    cy.get('input[name="password"]').type('f');
    cy.get('form').submit();

    cy.get('[data-cy="form-error"]');
  });
});
