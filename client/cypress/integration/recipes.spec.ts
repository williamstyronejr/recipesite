import { createRandomString } from '../utils';

describe('Creating a new recipe', () => {
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
    cy.visit('/');
    cy.contains('Dashboard').click();
    cy.contains('Create Recipe').click();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Empty fields should display field errors', () => {
    cy.get('form').submit();

    cy.get('[data-cy="field-error"]').should('have.length', 1);
  });

  it('Valid creation should redirect user to recipe page', () => {
    cy.get('input[name="prep"]').type('12');
    cy.get('input[name="cook"]').type('12');
    cy.get('input[name="title"]').type('title');
    cy.get('textarea[name="summary"]').type('summary');
    cy.get('textarea[name="ingredients"]').type('ingredients');
    cy.get('textarea[name="directions"]').type('directions');

    cy.get('form').submit();

    cy.location('pathname').should('match', /^\/recipe/);
  });
});
