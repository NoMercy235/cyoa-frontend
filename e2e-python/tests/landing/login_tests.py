import unittest
import pytest

from os import path
from logging import Logger
from selenium import webdriver

from pages.landing.login_page import LoginPage

driver_path = path.dirname(__file__) + "\\" + path.join("..", "..", "drivers", "94-chromedriver.exe")
chrome_path = path.dirname(__file__) + "\\" + path.join("..", "..", "GoogleChromePortable", "App", "Chrome-bin", "chrome.exe")


@pytest.mark.usefixtures("oneTimeSetUp", "setUp")
class LoginTests(unittest.TestCase):
    driver: webdriver.Chrome
    log_level: int
    credentials: dict

    login_page: LoginPage

    @pytest.fixture(autouse=True)
    def classSetup(self, oneTimeSetUp):
        self.login_page = LoginPage(self.driver, self.log_level)

    def test_login(self):
        self.login_page.login(self.credentials.get("email"), self.credentials.get("password"))
        confirm_snackbar = self.login_page.get_confirm_snackbar()

        self.assertIsNotNone(confirm_snackbar, "Confirm message was not found")
        self.assertEqual(confirm_snackbar.text, "Welcome!", "Confirm message is different")

    def test_empty_login(self):
        self.login_page.open_login_form()
        self.login_page.get_login_btn().click()

        email_field_error = self.login_page.get_email_field_error()

        self.assertIsNotNone(email_field_error, "Error message was not found")
        self.assertEqual(email_field_error.text, "Email is invalid", "Error message is different")


# if __name__ == '__main__':
#     unittest.main(verbosity=2)
