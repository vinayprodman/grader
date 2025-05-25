# api/app/db/firebase.py
import os
import firebase_admin
from firebase_admin import credentials, firestore

def init_firestore():
    """
    Initialise the Firebase Admin SDK and return a Firestore client.
    Set GOOGLE_APPLICATION_CREDENTIALS to the path of your service-account key.
    """
    if not firebase_admin._apps:                       # avoid double-init in gunicorn workers
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not cred_path:
            raise RuntimeError(
                "Missing GOOGLE_APPLICATION_CREDENTIALS env var pointing to the service-account JSON."
            )
        firebase_admin.initialize_app(credentials.Certificate(cred_path))
    return firestore.client()

db = init_firestore()
