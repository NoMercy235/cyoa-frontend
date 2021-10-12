import logging

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class SeleniumDriver:
    driver: webdriver.Chrome

    def __init__(self, driver: webdriver.Chrome, caller: str, log_level):
        self.driver = driver
        self.log = logging.getLogger(caller)
        self.log.setLevel(log_level or logging.INFO)
        # self.log = lambda: None
        # self.log.info = lambda _: None

    def get_element(self, locator, locator_type: By, should_log=True):
        if should_log:
            self.log.info("Find element({0}): {1}".format(locator_type, locator))
        return self.driver.find_element(locator_type, locator)

    def click_element(self, locator, locator_type: By):
        self.log.info("Click element({0}): {1}".format(locator_type, locator))
        self.get_element(locator, locator_type, should_log=False).click()

    def wait_for_element(self, locator, locator_type: By, timeout=10, poll_frequency=0.5) -> WebElement:
        self.log.info("Wait for element({0}): {1}".format(locator_type, locator))
        wait = WebDriverWait(
            self.driver,
            timeout,
            poll_frequency=poll_frequency,
        )
        element = None
        try:
            element = wait.until(EC.presence_of_element_located((locator_type, locator)))
        except:
            self.log.error("Element({0}) not found with locator: {1}".format(locator_type, locator))
        return element
