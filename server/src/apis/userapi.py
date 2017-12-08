from flask import Blueprint, jsonify, request

from apis.baseapi import InvalidUsage
from services.user_service import login, signup

user_api = Blueprint('user_api', __name__)

@user_api.route("/signup", methods=["POST"])
def signup_handler():
    user, token = signup(request.json)
    if user:
        return jsonify({"user" : user.json, "token" : token})
    else:
        raise InvalidUsage("Conflict", status_code=409)

@user_api.route("/login", methods=["POST"])
def login_handler():
    data = request.json
    user, token, status = login(data["email"], data["password"])
    if user:
        return jsonify({"user" : user.json, "token" : token})
    else:
        raise InvalidUsage("Conflict", status_code=status)