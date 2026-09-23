"""
db.py — thin SQLite helper for the Decorna backend.

We use the plain `sqlite3` module (no ORM) so the project stays dependency-light
and the SQL is easy to read end-to-end. Connections are opened per-request and
stashed on Flask's `g` object, then closed automatically at teardown.
"""
import sqlite3
from pathlib import Path

import click
from flask import current_app, g

BASE_DIR = Path(__file__).resolve().parent
SCHEMA_PATH = BASE_DIR / "schema.sql"


def get_db():
    """Return a SQLite connection for the current request, creating it if needed."""
    if "db" not in g:
        g.db = sqlite3.connect(
            current_app.config["DATABASE"],
            detect_types=sqlite3.PARSE_DECLTYPES,
        )
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """(Re)create all tables from schema.sql. Destroys existing data."""
    db = get_db()
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        db.executescript(f.read())
    db.commit()


@click.command("init-db")
def init_db_command():
    """CLI: `flask --app app init-db` — wipes and recreates the schema."""
    init_db()
    click.echo("Database initialized.")


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
