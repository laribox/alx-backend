#!/usr/bin/env python3
"""
2. Get locale from request
"""


from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    """ 
    config class
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


# configure the flask app
app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """
    get the local 
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """
    index route
    """
    return render_template('2-index.html')


if __name__ == '__main__':
    app.run(port="5000", host="0.0.0.0", debug=True)
