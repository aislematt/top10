from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

import os

if 'RDS_HOSTNAME' in os.environ:
    db = {
        'NAME': os.environ['RDS_DB_NAME'],
        'USER': os.environ['RDS_USERNAME'],
        'PASSWORD': os.environ['RDS_PASSWORD'],
        'HOST': os.environ['RDS_HOSTNAME'],
        'PORT': os.environ['RDS_PORT'],
    }
else:
    db = {
        'NAME': 'toplists',
        'USER': 'mwagner',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '5432',
    }

engine = create_engine('postgresql://{0}:{1}@{2}:{3}/{4}'.format(db['USER'], db['PASSWORD'], db['HOST'], db['PORT'], db["NAME"]))
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


def get_session():
    return db_session
