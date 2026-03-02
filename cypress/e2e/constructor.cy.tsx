/// <reference types="cypress" />

const INGREDIENT_BUN = 'Тестовая булка';
const INGREDIENT_MAIN = 'Тестовая начинка';
const ORDER_NUMBER = '12345';

function setAuthCookies() {
  cy.setCookie('accessToken', 'Bearer test-access-token');
  cy.setCookie('refreshToken', 'test-refresh-token');
}

function interceptOnAppLoad() {
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
}

function interceptCreateOrder() {
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
    'createOrder'
  );
}

function addIngredientByName(name: string) {
  cy.contains(name)
    .should('exist')
    .then(($el) => {
      const $card =
        $el.closest('li').length
          ? $el.closest('li')
          : $el.closest('article').length
            ? $el.closest('article')
            : $el.closest('div');

      cy.wrap($card).within(() => {
        cy.contains('button, [role="button"]', 'Добавить').click({ force: true });
      });
    });
}

function openIngredientModal(name: string) {
  cy.contains(name).should('exist').click();
}

function closeModalByX() {
  cy.get('#modals')
    .children()
    .first()
    .find('button[type="button"] svg')
    .first()
    .click({ force: true });
}

function closeModalByOverlay() {
  cy.get('#modals').children().last().click({ force: true });
}

function expectPortalClosed() {
  cy.get('#modals', { timeout: 15000 }).children().should('have.length', 0);
}

function expectIngredientRouteClosed() {
  cy.location('pathname', { timeout: 15000 }).should('eq', '/');
}

function clickPlaceOrder() {
  cy.contains('Оформить заказ').should('exist').click({ force: true });
}

function expectConstructorEmpty() {
    cy.contains('Оформить заказ')
      .closest('section, div')
      .should('exist')
      .within(() => {
        cy.contains(INGREDIENT_BUN).should('not.exist');
        cy.contains(INGREDIENT_MAIN).should('not.exist');
      });
}

describe('Конструктор бургера — Cypress', () => {
  beforeEach(() => {
    setAuthCookies();
    interceptOnAppLoad();
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('Добавление ингредиентов (булка + начинка) в конструктор', () => {
    addIngredientByName(INGREDIENT_BUN);
    addIngredientByName(INGREDIENT_MAIN);
    cy.contains(INGREDIENT_BUN).should('exist');
    cy.contains(INGREDIENT_MAIN).should('exist');
  });

  it('Модалка ингредиента: открытие и закрытие по крестику', () => {
    openIngredientModal(INGREDIENT_BUN);
    cy.location('pathname').should('contain', '/ingredients/');
    cy.contains(INGREDIENT_BUN).should('exist');
    closeModalByX();
    expectPortalClosed();
    expectIngredientRouteClosed();
  });

  it('Модалка ингредиента: закрытие по клику на оверлей (желательно)', () => {
    openIngredientModal(INGREDIENT_MAIN);
    cy.location('pathname').should('contain', '/ingredients/');
    cy.contains(INGREDIENT_MAIN).should('exist');
    closeModalByOverlay();
    expectPortalClosed();
    expectIngredientRouteClosed();
  });

  it('Создание заказа: мок user + мок order + токены + номер + конструктор очищен', () => {
    interceptCreateOrder();
    addIngredientByName(INGREDIENT_BUN);
    addIngredientByName(INGREDIENT_MAIN);
    clickPlaceOrder();
    cy.wait('@createOrder');
    cy.contains(ORDER_NUMBER).should('exist');
    closeModalByX();
    expectPortalClosed();
    expectConstructorEmpty();
  });
});