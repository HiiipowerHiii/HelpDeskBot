import os
from flask import Flask, request, jsonify
from functools import wraps
import jwt

app = Flask(__name__)

SECRET_KEY = os.getenv("JWT_SECRET", "your_default_secret")

def authenticate(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except:
            return jsonify({'message': 'Token is invalid!'}), 403
            
        return func(*args, **kwargs)
    
    return decorated

@app.route('/secure-endpoint')
@authenticate
def secure_endpoint():
    return jsonify({'message': 'This is a secured endpoint accessible only with valid token.'})

def generate_token():
    token = jwt.encode({'user': 'admin'}, SECRET_KEY, algorithm="HS256")
    return token

@app.route('/')
def home():
    return jsonify({'token': generate_token()})

if __name__ == '__main__':
    app.run(debug=True)