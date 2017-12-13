from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship

from models.basemodel import Base
from utilities.utilities import get_youtube_id
import urllib.parse as urlparse


class List(Base):
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
        sorted_list_items = sorted(self.listItems, key=lambda x: x.rank, reverse=True)

        return [i.json for i in sorted_list_items]


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

    @hybrid_property
    def yt_id(self):
        if self.yt_video:
            return get_youtube_id(self.yt_video)
        return None

    @hybrid_property
    def yt_ts(self):
        if self.yt_video:
            parsed = urlparse.urlparse(self.yt_video)
            ts = urlparse.parse_qs(parsed.query).get('t')
            if ts:
                ts = int(ts[0].split('s')[0])
            return ts
        return None
