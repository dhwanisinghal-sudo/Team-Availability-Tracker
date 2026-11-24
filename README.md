# Team Availability Tracker

A small full-stack dashboard built with Python Flask, SQLite, HTML, CSS and JavaScript.

## Features
- Displays sample team members and job roles.
- Switches each member between Available and Busy.
- Updates the boolean `is_available` value in SQLite.
- Updates status badges and availability summary counts on the frontend.
- Saves changes, so they remain after a browser refresh or app restart.

## Run in VS Code (Windows PowerShell)
```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```
Open http://127.0.0.1:5000

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/team` | Return all team members |
| PATCH | `/api/team/<id>` | Update one member's availability |

The `team_availability.db` SQLite file is created automatically when the application starts. Sample members are inserted only when the table is empty.
