import json
import pathlib
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("grader-a2085-firebase-adminsdk-fbsvc-de97d30327.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

DATA_DIR = pathlib.Path("data")

def iter_json_files():
    """Yield (grade, subjectId, chapterId | None, path obj)."""
    for grade_dir in DATA_DIR.iterdir():
        if not grade_dir.is_dir():
            continue
        for subject_dir in grade_dir.iterdir():
            if not subject_dir.is_dir():
                continue
            # subject.json
            yield (grade_dir.name, subject_dir.name, None, subject_dir / "subject.json")
            for chapter_dir in subject_dir.iterdir():
                if not chapter_dir.is_dir():
                    continue
                yield (grade_dir.name, subject_dir.name, chapter_dir.name, chapter_dir / "chapter.json")
                yield (grade_dir.name, subject_dir.name, chapter_dir.name, chapter_dir / "quizzes.json")

def seed():
    for grade, subject, chapter, path in iter_json_files():
        with open(path, encoding="utf-8") as f:
            data = json.load(f)

        grade_ref = db.collection("grades").document(grade)
        subjects_col = grade_ref.collection("subjects")

        if path.name == "subject.json":
            # Store subject under grade's subjects
            subjects_col.document(data["id"]).set(data)

        elif path.name == "chapter.json":
            # Store chapter under subject's chapters
            chapters_col = subjects_col.document(subject).collection("chapters")
            chapters_col.document(data["id"]).set(data)

        elif path.name == "quizzes.json":
            # Store quizzes under chapter's quizzes
            quizzes_col = subjects_col.document(subject).collection("chapters").document(chapter).collection("quizzes")
            for quiz in data:
                quizzes_col.document(quiz["id"]).set(quiz)

    print("✅ Firestore seeding finished.")

if __name__ == "__main__":
    seed()
