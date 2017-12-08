from db import db
from models.list import List, ListItem


def get_lists(user_id):
    lists = db.get_session().query(List).filter(List.user_id == user_id).all()
    return lists


def add_new_list(client_list, user):
    list = List(client_list["name"], user.id, user.name, client_list.get("image"))
    db.get_session().add(list)
    db.get_session().commit()
    return list


def add_new_list_item(list_item):
    list = get_list_by_id(list_item["list_id"])
    rank = list_item.get("rank")
    if not rank:
        rank = 1
        for item in list.list_items:
            rank += 1
    item = ListItem(list_item["list_id"], rank, list_item["name"], list_item["body"], list_item.get("image"),
                    list_item.get("yt_video"))
    db.get_session().add(item)
    db.get_session().commit()
    list = get_list_by_id(list_item["list_id"])
    return list


def edit_existing_list_item(list_item):
    existing_item = get_list_item_by_id(list_item["list_item_id"])
    existing_item.name = list_item["name"]
    existing_item.body = list_item["body"]
    db.get_session().commit()
    list = get_list_by_id(list_item["list_id"])
    return list


def get_list_item_by_id(list_item_id):
    list = db.get_session().query(ListItem).filter(ListItem.id == list_item_id).first()
    return list


def get_list_by_id(list_id):
    list = db.get_session().query(List).filter(List.id == list_id).first()
    return list
