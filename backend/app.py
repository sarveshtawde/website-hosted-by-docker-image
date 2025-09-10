from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/submit', methods=['POST'])
def submit():
    # Accept JSON body
    payload = request.get_json(silent=True) or {}
    # Basic "processing" — echo back values and pretend we stored them
    name = payload.get('name')
    email = payload.get('email')
    role = payload.get('role')
    message = payload.get('message')

    # Example server-side validation
    if not name or not email:
        return jsonify({'status': 'error', 'message': 'name and email required'}), 400

    details = {
        'name': name,
        'email': email,
        'role': role,
        'message': message
    }

    # (Replace with real DB/logic as needed)
    print('Received submission:', details)

    return jsonify({'status': 'success', 'message': 'Form received', 'data': details}), 200

if __name__ == '__main__':
    # listen on 0.0.0.0 so container accepts external connections
    app.run(host='0.0.0.0', port=5000)
