import os
from flask import Flask, render_template, jsonify, request, g, abort
from flask_jsontools import jsonapi
from flask_cors import CORS
from flask_httpauth import HTTPTokenAuth

from services.list_service import get_lists, add_new_list, add_new_list_item, get_list_by_id

# tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../frontend/templates')
# static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../static')


# app = Flask(__name__, template_folder=tmpl_dir, static_folder=static_dir)
from services.user_service import verify_user_token, signup, login
from utilities.config import Config

app = Flask(__name__)
CORS(app)

Config.load_config()

auth = HTTPTokenAuth(scheme='Token')

def get_json(sqlalchemy_list):
    return [i.json for i in sqlalchemy_list]


@app.route('/lists/<string:user_id>', methods=['GET'])
def get_lists_for_userid(user_id):
    lists = get_lists(user_id)
    return jsonify({"lists" : get_json(lists)})

@app.route('/list/<int:list_id>', methods=["GET"])
def get_list(list_id):
    list = get_list_by_id(list_id)
    return jsonify({"list" : list.json})



@app.route('/list', methods=["POST"])
@auth.login_required
def add_list():
    add_new_list(request.json, g.current_user.id)
    return jsonify({"success" : True})

@app.route('/listItem', methods=["POST"])
def add_list_item():
    add_new_list_item(request.json)
    return jsonify({"success" : True})

@app.route('/myLists', methods=["GET"])
@auth.login_required
def my_lists():
    lists = get_lists(g.current_user.id)
    return jsonify({"lists" : get_json(lists)})


@app.route("/signup", methods=["POST"])
def signup_handler():
    user, token = signup(request.json)
    if user:
        return jsonify({"user" : user.json, "token" : token})
    else:
        raise InvalidUsage("Conflict", status_code=409)

@app.route("/login", methods=["POST"])
def login_handler():
    data = request.json
    user, token, status = login(data["email"], data["password"])
    if user:
        return jsonify({"user" : user.json, "token" : token})
    else:
        raise InvalidUsage("Conflict", status_code=status)


@auth.verify_token
def verify_token(token):
    success, user = verify_user_token(token)
    if success:
        g.current_user = user
    return success


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

if __name__ == '__main__':
    app.run(debug=True)