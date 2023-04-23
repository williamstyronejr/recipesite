import { createRandomString } from '../../utils';

describe('Signing in', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="signin"]').click();
  });

  it('Invalid fields should produced', () => {
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

  it('Valid username and password should redirect to homepage', () => {
    const username = createRandomString(8);
    const email = createRandomString(8, '@email.com');
    const password = 'test';
    cy.register(email, username, password);
    cy.contains('Signout').click();
    cy.contains('Signin').click();

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('form').submit();

    cy.location('pathname').should('eq', '/');
  });
});
