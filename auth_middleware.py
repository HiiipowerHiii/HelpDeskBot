import os
from flask import Flask, request, jsonify
from functools import wraps
import jwt
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("JWT_SECRET", "your_default_secret")

def authenticate(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            logger.warning("Token is missing!")
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            logger.info("Token has been successfully verified.")
        except:
            logger.warning("Token is invalid!")
            return jsonify({'message': 'Token is invalid!'}), 403
            
        return func(*args, **kwargs)
    
    return decorated

@app.route('/secure-endpoint')
@authenticate
def secure_endpoint():
    logger.info("Accessed secure endpoint.")
    return jsonify({'message': 'This is a secured endpoint accessible only with valid token.'})

def generate_token():
    token = jwt.encode({'user': 'admin'}, SECRET_KEY, algorithm="HS256")
    logger.info("Generated a new token.")
    return token

@app.route('/')
def home():
    return jsonify({'token': generate_token().decode('utf-8') if isinstance(generate_token(), bytes) else generate_token()})

if __name__ == '__main__':
    app.run(debug=True)