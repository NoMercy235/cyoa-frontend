import pytest
import logging

from os import path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

driver_path = path.join(path.dirname(__file__), "drivers", "94-chromedriver.exe")
chrome_path = path.join(path.dirname(__file__), "GoogleChromePortable", "App", "Chrome-bin", "chrome.exe")

logging.basicConfig(
    filename="automation.log",
    filemode="w",
    format='%(asctime)s - %(name)s - %(levelname)s: %(message)s',
    datefmt='%d/%m/%Y %I:%M:%S %p',
    level=logging.INFO,
)


@pytest.fixture(scope="function")
def setUp(request, base_url):
    test_name = request.function.__name__

    logging.info("Running {0}".format(test_name))
    request.cls.driver.get(base_url)
    yield
    logging.info("Finished {0}".format(test_name))


@pytest.fixture(scope="class")
def oneTimeSetUp(request, base_url, log_level, email, password):
    log_level = log_level or logging.INFO

    logging.info("Running one time setUp")

    options = Options()
    options.binary_location = chrome_path
    options.add_argument('--incognito')
    # options.add_argument('--no-sandbox')
    options.add_argument('--no-default-browser-check')
    options.add_argument('--no-first-run')
    # options.add_argument('--disable-gpu')
    options.add_argument('--disable-extensions')
    options.add_argument('--disable-default-apps')

    driver = webdriver.Chrome(executable_path=driver_path, options=options)
    # cls.wait: WebDriverWait = WebDriverWait(cls.driver, 100)

    if request.cls is not None:
        request.cls.driver = driver
        request.cls.base_url = base_url
        request.cls.log_level = log_level
        request.cls.credentials = { "email": email, "password": password }

    yield driver
    driver.quit()
    logging.info("Running one time tearDown")


def pytest_addoption(parser):
    parser.addoption("--baseUrl")
    parser.addoption("--logLevel", help="One of...")
    parser.addoption("--email")
    parser.addoption("--password")


@pytest.fixture(scope="session")
def base_url(request):
    return request.config.getoption("--baseUrl") or "https://rigamo.xyz"


@pytest.fixture(scope="session")
def log_level(request):
    return request.config.getoption("--logLevel")


@pytest.fixture(scope="session")
def email(request):
    return request.config.getoption("--email")


@pytest.fixture(scope="session")
def password(request):
    return request.config.getoption("--password")
