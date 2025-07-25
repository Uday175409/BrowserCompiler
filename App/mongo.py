# App/services/mongo_crud.py

from App.DB.db import mongo_db
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
mongo_db = client["codingPlatform"]
submissions_collection = mongo_db["submissions"]
comments_collection = mongo_db["comments"]


# ✅ Log a single submission attempt under a grouped document (per user-problem pair)
def log_submission_attempt(
    user_id, problem_id, language, code, status, time_taken=None
):
    attempt = {
        "code": code,
        "language": language,
        "status": status,
        "submitted_at": datetime.utcnow(),
    }

    if status == "accepted" and time_taken:
        attempt["time_taken"] = time_taken

    mongo_db.submissions.update_one(
        {"user_id": user_id, "problem_id": problem_id},
        {
            "$push": {"submissions": attempt},
            "$setOnInsert": {"created_at": datetime.utcnow()},
        },
        upsert=True,
    )


# ✅ Get all attempts for a user-problem pair
def get_attempts_for_problem(user_id, problem_id):
    doc = mongo_db.submissions.find_one({"user_id": user_id, "problem_id": problem_id})
    return doc.get("submissions", []) if doc else []


# ✅ Get all submission docs for a user
def get_submissions_by_user(user_id):
    return list(mongo_db.submissions.find({"user_id": user_id}))


# ✅ Get a specific submission group by ID
def get_submission_by_id(submission_id):
    return mongo_db.submissions.find_one({"_id": ObjectId(submission_id)})


# ✅ Update fields inside the submission group document (e.g., to rename a field)
def update_submission(submission_id, updated_fields: dict):
    result = mongo_db.submissions.update_one(
        {"_id": ObjectId(submission_id)}, {"$set": updated_fields}
    )
    return result.modified_count


# ✅ Delete the entire submission group
def delete_submission(submission_id):
    result = mongo_db.submissions.delete_one({"_id": ObjectId(submission_id)})
    return result.deleted_count


# from pymongo import MongoClient
from types import SimpleNamespace

# client = MongoClient("mongodb://localhost:27017")
# db = client["codingPlatform"]  # Replace with actual DB name
# submissions_collection = db["submissions"]  # Replace with actual collection name


def dict_to_obj(d):
    return SimpleNamespace(**d)


def get_user_submissions(user_id):
    """
    Fetch all submissions for a given user ID (int).
    """
    print(f"🔍 Fetching submissions for user_id: {user_id} (type: {type(user_id)})")

    raw_cursor = submissions_collection.find({"user_id": user_id}).sort(
        "created_at", -1
    )

    submissions = []
    for doc in raw_cursor:
        print("✅ Found doc:", doc)  # DEBUG
        submissions.append(
            dict_to_obj(
                {
                    **doc,
                    "submissions": [dict_to_obj(s) for s in doc.get("submissions", [])],
                }
            )
        )

    return submissions


# comments_collection = mongo_db["comments"]


def save_comment(problem, user_id, username, comment_text):
    comment = {
        "user_id": str(user_id),
        "username": username,
        "comment": comment_text,
        "timestamp": datetime.utcnow(),
    }

    comments_collection.update_one(
        {"problem_slug": problem.slug},
        {
            "$setOnInsert": {
                "problem_slug": problem.slug,
                "title": problem.title,
                "statement": problem.statement,
                "created_at": datetime.utcnow(),
            },
            "$push": {"comments": comment},
        },
        upsert=True,
    )


def get_comments_for_problem(problem_slug):
    doc = comments_collection.find_one({"problem_slug": problem_slug})
    return doc.get("comments", []) if doc else []


# App/services/mongo.py or leaderboard.py

# from App.DB.db import mongo_db
from bson import ObjectId


def get_leaderboard_for_problem(problem_id):
    print(f"🔍 MongoDB: Getting leaderboard for problem_id: {problem_id}")

    try:
        # First, let's try a simpler approach to debug
        all_docs = list(mongo_db.submissions.find({"problem_id": str(problem_id)}))
        print(f"📊 Found {len(all_docs)} submission documents for problem {problem_id}")

        results = []
        for doc in all_docs:
            user_id = doc.get("user_id")
            submissions = doc.get("submissions", [])
            print(f"   User {user_id}: {len(submissions)} submissions")

            # Find accepted submissions with time_taken
            for submission in submissions:
                if submission.get("status") == "accepted" and submission.get(
                    "time_taken"
                ):
                    results.append(
                        {
                            "user_id": user_id,
                            "time_taken": submission.get("time_taken"),
                            "submitted_at": submission.get("submitted_at"),
                            "status": "accepted",
                        }
                    )
                    print(f"     ✅ Accepted: {submission.get('time_taken')}s")

        print(f"🎯 Final results: {len(results)} accepted submissions")
        return results

    except Exception as e:
        print(f"❌ MongoDB error in get_leaderboard_for_problem: {e}")
        return []


def get_leaderboard_for_problem_original(problem_id):
    """Original aggregation pipeline version"""
    pipeline = [
        {
            "$match": {
                "problem_id": str(problem_id),
                "submissions.status": "accepted",
                "submissions.time_taken": {"$exists": True},
            }
        },
        {"$unwind": "$submissions"},
        {
            "$match": {
                "submissions.status": "accepted",
                "submissions.time_taken": {"$exists": True},
            }
        },
        {"$sort": {"submissions.time_taken": 1}},
        {
            "$project": {
                "user_id": 1,
                "username": 1,  # If you store usernames too
                "time_taken": "$submissions.time_taken",
                "submitted_at": "$submissions.submitted_at",
            }
        },
    ]

    return list(mongo_db.submissions.aggregate(pipeline))
