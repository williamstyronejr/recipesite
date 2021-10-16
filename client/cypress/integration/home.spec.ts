describe('News Letter', () => {
  const email = 'email@email.com';

  beforeEach(() => {
    cy.visit('/');
  });

  it('Invalid email should show field error', () => {
    cy.get('input[name="email"]').clear().type('  ');
    cy.get('[data-cy="submit"]').click();
  });
});

describe('Searching from header', () => {
  it('Search from header should redirect to search page', () => {
    cy.get('input[name="search-header"]').clear().type('tseing {enter}');

    cy.location('pathname').should('match', /^\/search/);
  });
});
