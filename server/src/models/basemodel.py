from flask import json
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import get_hybrid_properties


class BaseModel (object):
    @property
    def json(self):
        return to_json(self, self.__class__)

def to_json(inst, cls):
    """
    Jsonify the sql alchemy query result.
    """
    convert = dict()
    # add your coversions for things like datetime's
    # and what-not that aren't serializable.
    d = dict()
    for c in cls.__table__.columns:
        v = getattr(inst, c.name)
        if c.type in convert.keys() and v is not None:
            try:
                d[c.name] = convert[c.type](v)
            except:
                d[c.name] = "Error:  Failed to covert using ", str(convert[c.type])
        elif v is None:
            d[c.name] = str()
        else:
            d[c.name] = v

    for c in get_hybrid_properties(cls):
        v = getattr(inst, c)
        d[c] = v

    return d


Base = declarative_base(cls=BaseModel)


