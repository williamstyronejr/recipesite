import { createRandomString } from '../../utils';

describe('Creating a new account through local signup', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Signup').click();
  });

  it('Empty fields should display field errors', () => {
    cy.get('form').submit();
    cy.get('[data-cy="field-error"]').should('have.length', 3);
  });

  it('Invalid fields should display field errors', () => {
    cy.get('input[name="username"]').type('    ');
    cy.get('input[name="email"]').type('email');
    cy.get('input[name="password"]').type('   ');
    cy.get('input[name="confirm"]').type('test');

    cy.get('form').submit();
    cy.get('[data-cy="field-error"]').should('have.length', 4);
  });

  it('Valid signup should redirect to home page', () => {
    const username = createRandomString(8);
    const email = createRandomString(8, '@email.com');
    const password = 'test';

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirm"]').type(password);

    cy.get('form').submit();

    cy.location('pathname').should('eq', '/');
  });
});
