import uuid
from datetime import datetime, timedelta

import jwt as jwt
from sqlalchemy import Column, String, DateTime

from models.basemodel import Base
from passlib.hash import bcrypt_sha256

import logging
from utilities.config import Config


class User(Base):
    __tablename__ = 'user'
    id = Column(String, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow())
    updated_at = Column(DateTime, default=datetime.utcnow(), onupdate=datetime.utcnow())

    def __init__(self, first_name, last_name, email):
        self.id = str(uuid.uuid4())
        self.first_name = first_name
        self.last_name = last_name
        self.email = email

    @property
    def name(self):
        return self.first_name + " " + self.last_name

    def set_password(self, password):
        self.password = bcrypt_sha256.encrypt(password)

    def validate_password(self, password):
        return bcrypt_sha256.verify(password, self.password)

    def encode_auth_token(self):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(days=30, seconds=0),
                'iat': datetime.utcnow(),
                'sub': self.id
            }
            return jwt.encode(
                payload,
                Config.get_config()["SECRET_KEY"],
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Decodes the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            payload = jwt.decode(auth_token, Config.get_config()["SECRET_KEY"])
            return True, payload['sub']
        except jwt.ExpiredSignatureError:
            logging.info("SIGNATURE EXPIRED")
            return False, 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            logging.info("INVALID TOKEN")
            return False, 'Invalid token. Please log in again.'
