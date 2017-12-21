from flask import Flask, jsonify, g
from flask_cors import CORS

from apis.baseapi import auth, InvalidUsage
from apis.listapi import list_api
from apis.userapi import user_api
import logging
from logging.handlers import RotatingFileHandler

# tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../frontend/templates')
# static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../static')


# app = Flask(__name__, template_folder=tmpl_dir, static_folder=static_dir)
from services.user_service import verify_user_token
from utilities.config import Config

application = Flask(__name__)
app = application
app.url_map.strict_slashes = False

CORS(app)

Config.load_config()

app = Flask(__name__)
app.register_blueprint(user_api)
app.register_blueprint(list_api)


@auth.verify_token
def verify_token(token):
    app.logger.info(token)
    success, user = verify_user_token(token)
    if success:
        g.current_user = user
    return success


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


if __name__ == '__main__':
    handler = RotatingFileHandler('foo.log', maxBytes=10000, backupCount=1)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    app.run(debug=True)
