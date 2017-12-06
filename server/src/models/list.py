from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship

from models.basemodel import Base


class List (Base):
    __tablename__ = 'list'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    user_id = Column(String)
    user_name = Column(String)
    image = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow())

    listItems = relationship("ListItem", backref="list")


    def __init__(self, name, user_id, user_name, image):
        self.name = name
        self.user_id = user_id
        self.user_name = user_name
        self.image = image

    @hybrid_property
    def list_items(self):
        return [i.json for i in self.listItems]

class ListItem(Base):
    __tablename__ = 'listitem'
    id = Column(Integer, primary_key=True)
    list_id = Column(Integer, ForeignKey(List.id))
    rank = Column(Integer)
    name = Column(String)
    body = Column(String)
    image = Column(String)
    yt_video = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow())


    def __init__(self, list_id, rank, name, body, image, yt_video):
        self.name = name
        self.list_id = list_id
        self.name = name
        self.rank = rank
        self.body = body
        self.image = image
        self.yt_video = yt_video
