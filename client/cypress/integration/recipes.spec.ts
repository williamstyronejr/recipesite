import { createRandomString } from '../utils';

const username = createRandomString(8);
const email = createRandomString(8, '@email.com');
const password = 'test';

before(() => {
  cy.clearCookies();
  cy.register(email, username, password);
});

beforeEach(() => {
  Cypress.Cookies.preserveOnce('token');
  Cypress.Cookies.preserveOnce('_csrf');
  Cypress.Cookies.preserveOnce('csrf_token');
});

describe('Creating a new recipe', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Dashboard').click();
    cy.contains('Create Recipe').click();
  });

  it('Empty fields should display field errors', () => {
    cy.get('form').submit();

    cy.get('[data-cy="field-error"]').should('have.length.greaterThan', 0);
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

describe('Recipe page', () => {
  const title = createRandomString(8);
  const summary = createRandomString(8);
  const prepTime = 12;
  const cookTime = 12;
  const ingredients = createRandomString(8);
  const directions = createRandomString(8);
  const published = true;

  const commentText1 = 'This comment should not be the one delete';

  before(() => {
    cy.createRecipe(
      title,
      summary,
      prepTime,
      cookTime,
      published,
      ingredients,
      directions,
    );
  });

  it('Empty input for comment should display a error message', () => {
    cy.get('[data-cy="comment-create-btn"]').click();
    cy.get('[data-cy="comment-error"]');
  });

  it('Creating a comment should add the comment to the page', () => {
    cy.get('[data-cy="comment-create"]').type(commentText1);
    cy.get('[data-cy="comment-create-btn"]').click();

    cy.get('[data-cy="comment"]').should('have.length.greaterThan', 0);
  });

  it('Deleting a commment should remove it from the list', () => {
    cy.get('[data-cy="comment-create"]').type('comment');
    cy.get('[data-cy="comment-create-btn"]').click();

    cy.get('[data-cy="comment-delete"]').last().click();
    cy.get('[data-cy="comment"]').should('have.length', 1);
  });

  it('Favoriting a recipe should add it to user favorites page', () => {
    cy.get('[data-cy="favorite"]').click();

    cy.contains('Dashboard').click();
    cy.contains('Favorites').click();

    cy.contains(title).click();
  });
});
