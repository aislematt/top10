from db import db
from models.user import User


def get_user_by_email(email):
    user = db.get_session().query(User).filter(User.email == email).first()
    return user

def get_user_by_id(user_id):
    user = db.get_session().query(User).filter(User.id == user_id).first()
    return user


def signup(user_info):
    email = user_info["email"]
    existing_user = get_user_by_email(email)
    if existing_user is not None:
        return None, None
    user = User(user_info["first_name"], user_info["last_name"], user_info["email"])
    user.set_password(user_info["password"])
    db.get_session().add(user)
    db.get_session().commit()
    token = generate_auth_token(user)
    return user, token


def login(email, password):
    existing_user = get_user_by_email(email)
    if existing_user is None:
        return False, None, 404
    if not existing_user.validate_password(password):
        return False, None, 401
    token = generate_auth_token(existing_user)
    return existing_user, token, 200


def generate_auth_token(user):
    token = user.encode_auth_token()
    return token.decode()


def verify_user_token(token):
    success, user_id = User.decode_auth_token(token)
    if not success:
        return False, None
    user = get_user_by_id(user_id)
    return True, user
