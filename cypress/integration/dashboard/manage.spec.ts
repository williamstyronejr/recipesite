import { createRandomString } from '../../utils';

describe('Managing recipes', () => {
  const username = createRandomString(8);
  const email = createRandomString(8, '@email.com');
  const password = 'test';
  const recipeTitle = 'fnasdkgnjgkfns';

  before(() => {
    cy.register(email, username, password);
    cy.createRecipe(
      recipeTitle,
      't',
      12,
      12,
      true,
      'ingredients',
      'directions',
    );
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token');
    Cypress.Cookies.preserveOnce('_csrf');
    Cypress.Cookies.preserveOnce('csrf_token');
  });

  it('Editting recipe from manage should link to edit page', () => {
    cy.visit('/');
    cy.contains('Dashboard').click();
    cy.contains('Manage Recipes').click();
    cy.get('[data-cy="edit"]').click();

    cy.location('pathname').should('match', /\/edit$/);
  });

  it('Deleting a recipe should remove it from the recipes list', () => {
    cy.visit('/');
    cy.contains('Dashboard').click();
    cy.contains('Manage Recipes').click();

    cy.contains(recipeTitle);

    cy.get('[data-cy="delete"]').click();
    // cy.get('[data-cy="confirm"]').click();

    cy.contains(recipeTitle).should('not.exist');
  });
});
