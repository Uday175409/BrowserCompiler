# App/DB/db.py

from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://udaychauhan0408:ZanF5IVCJNwYKMar@cluster1.4p9tezw.mongodb.net/NewsApp?retryWrites=true&w=majority&appName=Cluster1"
)
mongo_db = client["codingPlatform"]
submissions_collection = mongo_db["submissions"]
