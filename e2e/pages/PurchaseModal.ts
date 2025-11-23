import { Page, Locator } from '@playwright/test';

export class PurchaseModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly courseTitle: Locator;
  readonly priceDisplay: Locator;
  readonly creditCardOption: Locator;
  readonly atmOption: Locator;
  readonly mobilePayOption: Locator;
  readonly agreementCheckbox: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Modal container
    this.modal = page.locator('[role="dialog"]');

    // Course information
    this.courseTitle = this.modal.locator('h2, h3').first();
    this.priceDisplay = this.modal.locator('text=/NT\\$|\\$|價格/i');

    // Payment method options
    this.creditCardOption = this.modal.locator('text=信用卡');
    this.atmOption = this.modal.locator('text=ATM 轉帳');
    this.mobilePayOption = this.modal.locator('text=行動支付');

    // Agreement checkbox
    this.agreementCheckbox = this.modal.locator('input[type="checkbox"]');

    // Action buttons
    this.confirmButton = this.modal.locator('button:has-text("確認購買")');
    this.cancelButton = this.modal.locator('button:has-text("取消")');
  }

  async isVisible(): Promise<boolean> {
    return await this.modal.isVisible().catch(() => false);
  }

  async waitForModal() {
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getCourseTitle(): Promise<string> {
    return (await this.courseTitle.textContent()) || '';
  }

  async getPrice(): Promise<string> {
    return (await this.priceDisplay.textContent()) || '';
  }

  async selectCreditCard() {
    await this.creditCardOption.click();
  }

  async selectATM() {
    await this.atmOption.click();
  }

  async selectMobilePay() {
    await this.mobilePayOption.click();
  }

  async checkAgreement() {
    await this.agreementCheckbox.check();
  }

  async uncheckAgreement() {
    await this.agreementCheckbox.uncheck();
  }

  async isAgreementChecked(): Promise<boolean> {
    return await this.agreementCheckbox.isChecked();
  }

  async isConfirmButtonEnabled(): Promise<boolean> {
    return await this.confirmButton.isEnabled();
  }

  async clickConfirm() {
    await this.confirmButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async completePurchase(paymentMethod: 'credit' | 'atm' | 'mobile' = 'credit') {
    await this.waitForModal();

    // Select payment method
    switch (paymentMethod) {
      case 'credit':
        await this.selectCreditCard();
        break;
      case 'atm':
        await this.selectATM();
        break;
      case 'mobile':
        await this.selectMobilePay();
        break;
    }

    // Check agreement
    await this.checkAgreement();

    // Click confirm and wait for purchase API
    const purchasePromise = this.page.waitForResponse(
      response => response.url().includes('/api/purchases/courses/') &&
                 response.request().method() === 'POST'
    );

    await this.clickConfirm();
    await purchasePromise;

    // Wait for modal to close
    await this.modal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async close() {
    await this.clickCancel();
    await this.modal.waitFor({ state: 'hidden', timeout: 5000 });
  }
}
