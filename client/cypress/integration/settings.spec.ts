import { createRandomString } from '../utils';

describe('Account Settings', () => {
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'test';

  before(() => {
    cy.visit('/');
    cy.contains('Signup').click();

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirm"]').type(password);

    cy.get('form').submit();

    cy.location('pathname').should('eq', '/');
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Invalid field should display field errors', () => {
    cy.contains('Settings').click();

    cy.get('input[name="username"]').clear().type('    ');
    cy.get('input[name="email"]').clear().type('test');
    cy.get('form').submit();

    cy.get('[data-cy="field-error"]').should('have.length', 2);
  });

  it('Valid username change should update on presisent through refresh', () => {
    const newUsername = createRandomString(8);

    cy.contains('Settings').click();

    cy.get('input[name="username"]').clear().type(newUsername);
    cy.get('input[name="email"]').clear().type(email);
    cy.get('form').submit();

    cy.get('[data-cy="form-notification"]');
    cy.reload();

    cy.get('input[name="username"').should('have.value', newUsername);
  });
});

// Separate to avoid issues with test running
describe('Account settings deletion', () => {
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'test';

  before(() => {
    cy.visit('/');
    cy.contains('Signup').click();

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirm"]').type(password);

    cy.get('form').submit();

    cy.location('pathname').should('eq', '/');
  });

  it('Deleting account should redirect to signin page and user should be logged out', () => {
    cy.contains('Settings').click();

    cy.get('[data-cy="delete"]').click();
    cy.get('[data-cy="confirm"]').click();

    cy.location('pathname').should('eq', '/signin');

    // Check if nav changed to non-authenticated version
    cy.get('nav').contains('Signin');
  });
});

describe('Password settings', () => {
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'test';

  before(() => {
    cy.visit('/');
    cy.contains('Signup').click();

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirm"]').type(password);

    cy.get('form').submit();

    cy.location('pathname').should('eq', '/');
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Empty fields should display field errors', () => {
    cy.contains('Settings').click();
    cy.contains('Password').click();

    cy.get('form').submit();

    cy.get('[data-cy="field-error"]').should('have.length', 2);
  });

  it('Non-matching passwords should display field error for confirm', () => {
    cy.contains('Settings').click();
    cy.contains('Password').click();

    const newPassword = 'test';
    cy.get('input[name="oldPassword"]').clear().type('tes');
    cy.get('input[name="newPassword"]').clear().type(newPassword);
    cy.get('input[name="confirmPassword"]').clear().type(`${newPassword}1`);
    cy.get('form').submit();

    cy.get('[data-cy="field-error"]').should('have.length', 1);
  });

  it('Valid password change should display notification', () => {
    const newPassword = 'testf';

    cy.contains('Settings').click();
    cy.contains('Password').click();

    cy.get('input[name="oldPassword"]').clear().type(password);
    cy.get('input[name="newPassword"]').clear().type(newPassword);
    cy.get('input[name="confirmPassword"]').clear().type(newPassword);
    cy.get('form').submit();

    cy.get('[data-cy="form-notification"]');
  });
});
