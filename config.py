import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    NLTK_DATA_PATH = os.getenv('NLTK_DATA_PATH')
    SPA_CY_MODEL = os.getenv('SPA_CY_MODEL')

class DevelopmentConfig(Config):
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    DEBUG = False
    FLASK_ENV = 'production'

class TestingConfig(Config):
    TESTING = True
