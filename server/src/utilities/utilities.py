import re


def get_json(sqlalchemy_list):
    return [i.json for i in sqlalchemy_list]


def get_youtube_id(url):
    regex = re.compile(
        r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/(watch\?v=|embed/|v/|.+\?v=)?(?P<id>[A-Za-z0-9\-=_]{11})')
    match = regex.match(url)

    return match.group('id')
