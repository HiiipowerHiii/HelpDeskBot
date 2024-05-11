import os
from flask import Flask, request, jsonify
from functools import wraps
import jwt
import logging
from datetime import datetime

app = Flask(__name__)

def setup_logging():
    logging.basicConfig(level=logging.INFO, filename='app.log', filemode='a',
                        format='%(name)s - %(levelname)s - %(message)s')
    return logging.getLogger(__name__)

logger = setup_logging()

SECRET_KEY = os.getenv("JWT_SECRET", "your_default_secret")

def authenticate(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            logger.warning("Token is missing!")
            unauthorized_access_record("Missing Token")
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            logger.info("Token has been successfully verified.")
        except Exception as e:
            logger.warning("Token is invalid! Detail: {}".format(str(e)))
            unauthorized_access_record("Invalid Token")
            return jsonify({'message': 'Token is invalid!'}), 403
            
        return func(*args, **kwargs)

    return decorated

def unauthorized_access_record(issue):
    with open('unauthorized_access.log', 'a') as file:
        file.write(f"{datetime.now()} - Unauthorized access attempt detected: {issue}\n")

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
    generated_token = generate_token()
    # Convert token to string if it's a bytes object, else return as-is
    token_str = generated_token.decode('utf-8') if isinstance(generated_token, bytes) else generated_token
    return jsonify({'token': token_str})

if __name__ == '__main__':
    app.run(debug=True)