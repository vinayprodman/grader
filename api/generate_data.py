# generate_data.py
"""
Creates synthetic educational content in ./data/...
Run once, then run seed_firestore.py to upload.
"""

import json, random, os, itertools, pathlib

DATA_DIR = pathlib.Path("data")
GRADES = ["5", "6"]
SUBJECTS = [
    ("math",     "Mathematics", "📐", "#FDE047"),
    ("science",  "Science",     "🔬", "#4ADE80"),
    ("english",  "English",     "📖", "#60A5FA"),
]
CHAPTERS_PER_SUBJECT = [
    ("basics",      "Basics"),
    ("advanced",    "Advanced Topics"),
]
QUIZZES_PER_CHAPTER = ["quiz1", "quiz2"]
QUESTION_TEMPL = [
    ("What is {a} + {b}?", lambda a,b: a+b),
    ("What is {a} × {b}?", lambda a,b: a*b),
    ("Is {a} > {b}?",      lambda a,b: "Yes" if a>b else "No"),
]

def four_options(correct):
    opts = {correct}
    while len(opts) < 4:
        opts.add(random.randint(1, 20))
    return list(map(str, opts))

def build_question(qid: int):
    a, b   = random.randint(1, 9), random.randint(1, 9)
    text, fn = random.choice(QUESTION_TEMPL)
    qtext = text.format(a=a, b=b)
    correct = fn(a, b)
    options = four_options(correct) if isinstance(correct, int) else ["Yes", "No", "Maybe", "Not sure"]
    correct_idx = options.index(str(correct)) if isinstance(correct, int) else options.index(correct)
    return {
        "id": f"q{qid}",
        "question": qtext,
        "options": options,
        "correctIndex": correct_idx,
        "explanation": f"Because the correct answer is {correct}."
    }

def main():
    if DATA_DIR.exists():
        print("❗ 'data/' already exists – remove it first if you want a fresh build.")
        return
    for grade in GRADES:
        for sid, sname, icon, color in SUBJECTS:
            subj_path = DATA_DIR / grade / sid
            os.makedirs(subj_path, exist_ok=True)
            # ---- subject.json
            subject_json = {
                "id": sid, "grade": grade,
                "name": sname, "description": f"{sname} for Grade {grade}",
                "color": color, "icon": icon
            }
            (subj_path / "subject.json").write_text(json.dumps(subject_json, indent=2))
            # ---- chapters
            for order, (cid, cname) in enumerate(CHAPTERS_PER_SUBJECT, 1):
                chap_path = subj_path / cid
                os.makedirs(chap_path, exist_ok=True)
                chapter_json = {
                    "id": cid, "grade": grade, "subjectId": sid,
                    "name": cname, "description": f"{cname} in {sname}",
                    "order": order, "locked": False, "tests": len(QUIZZES_PER_CHAPTER)
                }
                (chap_path / "chapter.json").write_text(json.dumps(chapter_json, indent=2))
                # ---- quizzes.json
                quizzes = []
                for qidx, qid in enumerate(QUIZZES_PER_CHAPTER, 1):
                    questions = [build_question(i) for i in range(1, 11)]
                    quizzes.append({
                        "id": qid,
                        "grade": grade, "subjectId": sid, "chapterId": cid,
                        "name": f"{cname} – Quiz {qidx}",
                        "description": f"Quiz {qidx} on {cname}",
                        "duration": 15, "totalQuestions": 10, "locked": False,
                        "questions": questions
                    })
                (chap_path / "quizzes.json").write_text(json.dumps(quizzes, indent=2))
    print("✅ Synthetic data written under ./data/")

if __name__ == "__main__":
    main()
