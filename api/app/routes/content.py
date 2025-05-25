from flask import Blueprint, jsonify, abort
from app.db.firebase import db

bp = Blueprint("content", __name__)

# ----- helpers -------------------------------------------------------------

def _docs_to_list(query):
    """Return list of {**doc.to_dict(), "id": doc.id} for a Firestore query."""
    return [{**d.to_dict(), "id": d.id} for d in query.stream()]

# --------------------------------------------------------------------------
#Show all available subjects for grade
@bp.route("/<int:grade>/subjects", methods=["GET"])
def get_subjects(grade):
    docs = db.collection("grades").document(str(grade)).collection("subjects")
    return jsonify(_docs_to_list(docs))
#show all available chapters for a subject
@bp.route("/<int:grade>/<subject_id>/chapters", methods=["GET"])
def get_chapters(grade, subject_id):
    docs = (
        db.collection("grades").document(str(grade))
          .collection("subjects").document(subject_id)
          .collection("chapters")
        #   .order_by("order")
    )
    return jsonify(_docs_to_list(docs))

#show all available quizzes for a chapter of a particular subject
@bp.route("/<int:grade>/<subject_id>/<chapter_id>/quizzes", methods=["GET"])
def get_quizzes(grade, subject_id, chapter_id):
    docs = (
        db.collection("grades").document(str(grade))
          .collection("subjects").document(subject_id)
          .collection("chapters").document(chapter_id)
          .collection("quizzes")
        #   .order_by("name")
    )
    return jsonify(_docs_to_list(docs))
#select a particular quiz and show all questions in it
@bp.route("/<int:grade>/<subject_id>/<chapter_id>/<quiz_id>", methods=["GET"])
def get_questions(grade, subject_id, chapter_id, quiz_id):
    doc = (
        db.collection("grades").document(str(grade))
          .collection("subjects").document(subject_id)
          .collection("chapters").document(chapter_id)
          .collection("quizzes").document(quiz_id)
          .get()
    )
    if not doc.exists:
        abort(404, description="Quiz not found")
    data = doc.to_dict()
    return jsonify({"id": doc.id, **data})
