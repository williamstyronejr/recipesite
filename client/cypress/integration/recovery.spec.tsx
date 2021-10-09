describe('Recovery Page', () => {
  it('Invalid email should display error for input', () => {
    cy.visit('/');

    cy.get('[data-cy=signin]').click();
    cy.get('[data-cy=forgot]').click();

    cy.get('input[name="email"]').type('email');
    cy.get('form').submit();

    cy.get('[data-cy="field-error"]');
  });

  it('Valid email should display a success notification', () => {
    cy.visit('/');

    cy.get('[data-cy=signin]').click();
    cy.get('[data-cy=forgot]').click();

    cy.get('input[name="email"]').type('email@email.com');
    cy.get('form').submit();

    cy.get('[data-cy="success"]');
  });
});
