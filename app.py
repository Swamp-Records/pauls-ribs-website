# Run this file with: python app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
from datetime import datetime

app = Flask(__name__)
# Enable CORS for all origins (including file://)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database helper functions
def get_db_connection():
    conn = sqlite3.connect('shows.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with shows table"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS shows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            ticket_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Add ticket_url column if it doesn't exist (migration for existing databases)
    try:
        cursor.execute('ALTER TABLE shows ADD COLUMN ticket_url TEXT')
    except sqlite3.OperationalError:
        # Column already exists, skip
        pass
    
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Routes
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'Backend is running'}), 200

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        hashed_password = hash_password(password)
        try:
            cursor.execute(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                (username, hashed_password)
            )
            conn.commit()
            user_id = cursor.lastrowid
            conn.close()
            
            return jsonify({
                'message': 'User registered successfully',
                'user_id': user_id,
                'username': username
            }), 201
        except sqlite3.IntegrityError:
            conn.close()
            return jsonify({'error': 'Username already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        hashed_password = hash_password(password)
        user = cursor.execute(
            'SELECT id, username FROM users WHERE username = ? AND password = ?',
            (username, hashed_password)
        ).fetchone()
        conn.close()
        
        if user:
            return jsonify({
                'message': 'Login successful',
                'user_id': user['id'],
                'username': user['username']
            }), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shows/add', methods=['POST'])
def add_show():
    """Add a new show (requires login)"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        title = data.get('title')
        date = data.get('date')
        location = data.get('location')
        description = data.get('description', '')
        image_url = data.get('image_url', '')
        ticket_url = data.get('ticket_url', '')
        
        if not user_id or not title or not date or not location:
            return jsonify({'error': 'user_id, title, date, and location are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verify user exists
        user = cursor.execute('SELECT id FROM users WHERE id = ?', (user_id,)).fetchone()
        if not user:
            conn.close()
            return jsonify({'error': 'User not found'}), 404
        
        # Add show
        cursor.execute(
            '''INSERT INTO shows (user_id, title, date, location, description, image_url, ticket_url)
               VALUES (?, ?, ?, ?, ?, ?, ?)''',
            (user_id, title, date, location, description, image_url, ticket_url)
        )
        conn.commit()
        show_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'message': 'Show added successfully',
            'show_id': show_id,
            'title': title,
            'date': date,
            'location': location,
            'ticket_url': ticket_url
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shows/user/<int:user_id>', methods=['GET'])
def get_user_shows(user_id):
    """Get all shows added by a user"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        shows = cursor.execute(
            '''SELECT id, title, date, location, description, image_url, ticket_url, created_at 
               FROM shows WHERE user_id = ? ORDER BY date DESC''',
            (user_id,)
        ).fetchall()
        conn.close()
        
        shows_list = [
            {
                'id': show['id'],
                'title': show['title'],
                'date': show['date'],
                'location': show['location'],
                'description': show['description'],
                'image_url': show['image_url'],
                'ticket_url': show['ticket_url'],
                'created_at': show['created_at']
            } for show in shows
        ]
        
        return jsonify({'shows': shows_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shows/all', methods=['GET'])
def get_all_shows():
    """Get all shows"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        shows = cursor.execute(
            '''SELECT s.id, s.title, s.date, s.location, s.description, s.image_url, 
                      s.ticket_url, s.created_at, u.username FROM shows s 
               JOIN users u ON s.user_id = u.id 
               ORDER BY s.date DESC'''
        ).fetchall()
        conn.close()
        
        shows_list = [
            {
                'id': show['id'],
                'title': show['title'],
                'date': show['date'],
                'location': show['location'],
                'description': show['description'],
                'image_url': show['image_url'],
                'ticket_url': show['ticket_url'],
                'created_at': show['created_at'],
                'added_by': show['username']
            } for show in shows
        ]
        
        return jsonify({'shows': shows_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shows/<int:show_id>', methods=['GET'])
def get_show(show_id):
    """Get a specific show by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        show = cursor.execute(
            '''SELECT s.id, s.title, s.date, s.location, s.description, s.image_url, 
                      s.ticket_url, s.created_at, u.username FROM shows s 
               JOIN users u ON s.user_id = u.id 
               WHERE s.id = ?''',
            (show_id,)
        ).fetchone()
        conn.close()
        
        if show:
            return jsonify({
                'show': {
                    'id': show['id'],
                    'title': show['title'],
                    'date': show['date'],
                    'location': show['location'],
                    'description': show['description'],
                    'image_url': show['image_url'],
                    'ticket_url': show['ticket_url'],
                    'created_at': show['created_at'],
                    'added_by': show['username']
                }
            }), 200
        else:
            return jsonify({'error': 'Show not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shows/<int:show_id>', methods=['DELETE'])
def delete_show(show_id):
    """Delete a show"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verify the show belongs to the user
        show = cursor.execute(
            'SELECT user_id FROM shows WHERE id = ?',
            (show_id,)
        ).fetchone()
        
        if not show:
            conn.close()
            return jsonify({'error': 'Show not found'}), 404
        
        if show['user_id'] != user_id:
            conn.close()
            return jsonify({'error': 'Unauthorized'}), 403
        
        cursor.execute('DELETE FROM shows WHERE id = ?', (show_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Show deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shows/<int:show_id>', methods=['PUT'])
def update_show(show_id):
    """Update a show"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verify the show belongs to the user
        show = cursor.execute(
            'SELECT user_id FROM shows WHERE id = ?',
            (show_id,)
        ).fetchone()
        
        if not show:
            conn.close()
            return jsonify({'error': 'Show not found'}), 404
        
        if show['user_id'] != user_id:
            conn.close()
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update show with provided fields
        title = data.get('title')
        date = data.get('date')
        location = data.get('location')
        description = data.get('description', '')
        image_url = data.get('image_url', '')
        ticket_url = data.get('ticket_url', '')
        
        cursor.execute(
            '''UPDATE shows SET title = ?, date = ?, location = ?, description = ?, image_url = ?, ticket_url = ?
               WHERE id = ?''',
            (title, date, location, description, image_url, ticket_url, show_id)
        )
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Show updated successfully',
            'show_id': show_id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    # Define admin credentials (can be moved to config/env in production)
    ADMIN_USERNAME = 'admin'
    ADMIN_PASSWORD = 'admin123'  # In production, use environment variables and proper hashing
    
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify({
            'message': 'Admin login successful',
            'is_admin': True
        }), 200
    else:
        return jsonify({'error': 'Invalid admin credentials'}), 401

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    """Get all users with their shows"""
    try:
        conn = sqlite3.connect('shows.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get all users
        users = cursor.execute('SELECT id, username FROM users ORDER BY id').fetchall()
        
        users_data = []
        for user in users:
            user_id = user['id']
            user_username = user['username']
            
            # Get all shows for this user
            shows = cursor.execute(
                'SELECT id, title, date, location, description FROM shows WHERE user_id = ? ORDER BY date DESC',
                (user_id,)
            ).fetchall()
            
            shows_data = [
                {
                    'show_id': show['id'],
                    'title': show['title'],
                    'date': show['date'],
                    'location': show['location'],
                    'description': show['description']
                } for show in shows
            ]
            
            users_data.append({
                'user_id': user_id,
                'username': user_username,
                'shows': shows_data,
                'show_count': len(shows_data)
            })
        
        conn.close()
        return jsonify({'users': users_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    init_db()  # Initialize database
    app.run(host='0.0.0.0', port=5001, debug=True)