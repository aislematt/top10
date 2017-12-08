from flask import Blueprint, jsonify, request, g

from .baseapi import auth
from services.list_service import add_new_list_item, get_lists, add_new_list, get_list_by_id, edit_existing_list_item
from utilities.utilities import get_json

list_api = Blueprint('list_api', __name__)


@list_api.route('/lists/<string:user_id>', methods=['GET'])
def get_lists_for_userid(user_id):
    lists = get_lists(user_id)
    return jsonify({"lists" : get_json(lists)})

@list_api.route('/list/<int:list_id>', methods=["GET"])
def get_list(list_id):
    list = get_list_by_id(list_id)
    return jsonify({"list" : list.json})



@list_api.route('/list', methods=["POST"])
@auth.login_required
def add_list():
    list = add_new_list(request.json, g.current_user)
    return jsonify({"success" : True, "list" : list.json})

@list_api.route('/listItem', methods=["POST"])
@auth.login_required
def add_list_item():
    list = add_new_list_item(request.json)
    return jsonify({"success" : True, "list" : list.json})


@list_api.route('/listItem', methods=["PATCH"])
@auth.login_required
def edit_list_item():
    list = edit_existing_list_item(request.json)
    return jsonify({"success" : True, "list" : list.json})


@list_api.route('/myLists', methods=["GET"])
@auth.login_required
def my_lists():
    lists = get_lists(g.current_user.id)
    return jsonify({"lists" : get_json(lists)})
