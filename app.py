from flask import Flask, render_template, jsonify, request
import sqlite3
from pathlib import Path

app = Flask(__name__)
DB = Path(__file__).with_name("team_availability.db")
SAMPLE_TEAM = [
    ("Alex Morgan", "Senior Developer", 1),
    ("Mia Chen", "UX Designer", 0),
    ("Jordan Lee", "Project Manager", 1),
    ("Ava Patel", "Marketing Lead", 1),
    ("Noah Williams", "Backend Developer", 0),
    ("Sofia Garcia", "QA Engineer", 1),
]

def connect():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def initialize():
    with connect() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS team_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            is_available INTEGER NOT NULL DEFAULT 1
        )""")
        if conn.execute("SELECT COUNT(*) FROM team_members").fetchone()[0] == 0:
            conn.executemany(
                "INSERT INTO team_members(name, role, is_available) VALUES (?, ?, ?)",
                SAMPLE_TEAM
            )

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/api/team")
def team():
    with connect() as conn:
        rows = conn.execute("SELECT id, name, role, is_available FROM team_members ORDER BY id").fetchall()
    return jsonify([dict(row) for row in rows])

@app.patch("/api/team/<int:member_id>")
def update_team_member(member_id):
    data = request.get_json(silent=True) or {}
    status = data.get("is_available")
    if not isinstance(status, bool):
        return jsonify({"error": "is_available must be true or false."}), 400
    with connect() as conn:
        cursor = conn.execute("UPDATE team_members SET is_available = ? WHERE id = ?", (int(status), member_id))
        if cursor.rowcount == 0:
            return jsonify({"error": "Team member not found."}), 404
        row = conn.execute("SELECT id, name, role, is_available FROM team_members WHERE id = ?", (member_id,)).fetchone()
    return jsonify(dict(row))

if __name__ == "__main__":
    initialize()
    app.run(debug=True)
