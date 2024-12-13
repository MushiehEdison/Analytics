from AnalyticsApp import app, db
from AnalyticsApp.models import User, Company
def create_tables():
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("Tables created successfully.")

if __name__ == "__main__":
    create_tables()