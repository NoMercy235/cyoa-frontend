from selenium import webdriver
from selenium.webdriver.common.by import By

from base.selenium_driver import SeleniumDriver


class LoginPage(SeleniumDriver):
    def __init__(self, driver: webdriver.Chrome, log_level: int):
        super().__init__(driver, type(self).__name__, log_level)

    # Locators
    _login_btn = "//button[@type='submit']/span[text()='Login']"
    _email_field = "email"
    _email_field_error = "//p[contains(@class, 'Mui-error')][text()='Email is invalid']"
    _password_field = "password"
    _confirm_snackbar = "//div[contains(@class, 'MuiSnackbarContent-message')]"

    # Element getters
    def get_email_field(self):
        return self.get_element(self._email_field, By.NAME)

    def get_email_field_error(self):
        return self.get_element(self._email_field_error, By.XPATH)

    def get_password_field(self):
        return self.get_element(self._password_field, By.NAME)

    def get_confirm_snackbar(self):
        return self.get_element(self._confirm_snackbar, By.XPATH)

    def get_login_btn(self):
        return self.get_element(self._login_btn, By.XPATH)

    # Actions
    def enter_email(self, email):
        self.get_email_field().send_keys(email)

    def enter_password(self, password):
        self.get_password_field().send_keys(password)

    def login(self, email, password):
        self.enter_email(email)
        self.enter_password(password)
        self.get_login_btn().click()

        self.wait_for_element(self._confirm_snackbar, By.XPATH)
