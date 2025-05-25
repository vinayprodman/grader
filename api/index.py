from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Basic health check endpoint
@app.route('/api')
def hello():
    return jsonify({
        "message": "Hello from Flask backend!",
        "status": "running",
        "version": "1.0.0"
    })

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "service": "grader-api"})

# Example API endpoints for your grader app
@app.route('/api/assignments', methods=['GET'])
def get_assignments():
    # Replace with your actual data logic
    assignments = [
        {"id": 1, "title": "Math Assignment 1", "due_date": "2025-06-01"},
        {"id": 2, "title": "Science Project", "due_date": "2025-06-15"},
    ]
    return jsonify({"assignments": assignments})

@app.route('/api/assignments', methods=['POST'])
def create_assignment():
    data = request.get_json()
    # Add your assignment creation logic here
    return jsonify({
        "message": "Assignment created successfully",
        "assignment": data
    }), 201

@app.route('/api/grades/<int:assignment_id>', methods=['GET'])
def get_grades(assignment_id):
    # Replace with your actual grading logic
    grades = [
        {"student_id": 1, "grade": "A", "score": 95},
        {"student_id": 2, "grade": "B+", "score": 87},
    ]
    return jsonify({
        "assignment_id": assignment_id,
        "grades": grades
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# This is important for Vercel deployment
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)