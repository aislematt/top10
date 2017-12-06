from db import db
from models.list import List, ListItem


def get_lists(user_id):
    lists = db.get_session().query(List).filter(List.user_id==user_id).all()
    return lists

def add_new_list(client_list, user_id):
    list = List(client_list["name"], user_id, "", client_list["image"])
    db.get_session().add(list)
    db.get_session().commit()

def add_new_list_item(list_item):
    item = ListItem(list_item["list_id"], list_item["rank"], list_item["name"], list_item["body"], list_item.get("image"), list_item.get("yt_video"))
    db.get_session().add(item)
    db.get_session().commit()


def get_list_by_id(list_id):
    list = db.get_session().query(List).filter(List.id == list_id).first()
    return list
