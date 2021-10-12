import logging


def log(caller: str, log_level=logging.DEBUG):
    print("called get logger with name {0}".format(caller))
    log_level = log_level or logging.DEBUG
    logger = logging.getLogger("test")

    # file_handler = logging.FileHandler("{0}.log".format(caller), mode='a')
    file_handler = logging.FileHandler("automation.log", mode='a')
    file_handler.setLevel(logging.INFO)

    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s: %(message)s',  datefmt='%m/%d/%Y %I:%M:%S %p')
    file_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(ch)

    # assert 0
    logger.info("Logged {0} initialized".format(caller))
    print("logger.handlers")
    print(logger.handlers)

    return logger
