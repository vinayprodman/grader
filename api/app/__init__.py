from flask import Flask
from flask_cors import CORS
from app.config import *           
from app.routes.content import bp as content_bp

def create_app():
    app = Flask(__name__)
    CORS(app) 
    app.register_blueprint(content_bp)
    return app
