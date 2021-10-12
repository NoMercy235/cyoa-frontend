from selenium import webdriver
from selenium.webdriver.common.by import By

from base.selenium_driver import SeleniumDriver


class BasePage(SeleniumDriver):
    def __init__(self, driver: webdriver.Chrome, log_level: int):
        super().__init__(driver, type(self).__name__, log_level)

    # Locators
    _settings_btn = "settingsBtn"
    _login_menu_item = "//li/span[text() = 'Login']"
    _email_field = "email"

    # Element getters
    def get_settings_btn(self):
        return self.get_element(self._settings_btn, By.ID)

    def get_login_menu_item(self):
        return self.get_element(self._login_menu_item, By.XPATH)

    # Actions
    def open_settings(self):
        self.get_settings_btn().click()

    def open_login_form(self):
        self.get_settings_btn().click()
        self.get_login_menu_item().click()
        self.wait_for_element(self._email_field, By.NAME)
