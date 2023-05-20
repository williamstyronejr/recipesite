declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.register('email', 'username', 'password')
     */
    register(
      email: string,
      username: string,
      password: string
    ): Chainable<Element>;

    /**
     * Custom command to create a new recipe assuming a user is already logged
     *  in.
     * @example cy.createRecipe(title, summary, prepTime, cookTime,
     *  published, ingredients, directions,)
     */
    createRecipe(
      title: string,
      summary: string,
      prepTime: number,
      cookTime: number,
      published: boolean,
      ingredients: string,
      directions: string
    ): Chainable<Element>;
  }
}

Cypress.Commands.add('register', (email, username, password) => {
  cy.session(username, () => {
    cy.visit('/');
    cy.contains('Signup').click();

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirm"]').type(password);

    cy.get('form').submit();

    cy.location('pathname').should('eq', '/');
  });
});

Cypress.Commands.add(
  'createRecipe',
  (
    title: string,
    summary: string,
    prepTime: number,
    cookTime: number,
    published: boolean,
    ingredients: string,
    directions: string
  ) => {
    cy.visit('/');
    cy.contains('Dashboard').click();
    cy.contains('Create Recipe').click();

    cy.get('input[name="prep"]').type(prepTime.toString());
    cy.get('input[name="cook"]').type(cookTime.toString());
    cy.get('input[name="title"]').type(title);
    cy.get('textarea[name="summary"]').type(summary);
    cy.get('textarea[name="ingredients"]').type(ingredients);
    cy.get('textarea[name="directions"]').type(directions);

    cy.get('form').submit();

    cy.location('pathname').should('match', /^\/recipe/);
  }
);
