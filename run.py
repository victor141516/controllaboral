import datetime
import json
import os
import requests

GETTT_KEY = os.environ.get('GETTT_KEY')
TELEGRAM_TOKEN = os.environ.get('TELEGRAM_TOKEN') or exit('TELEGRAM_TOKEN')
TELEGRAM_USER = os.environ.get('TELEGRAM_USER') or exit('TELEGRAM_USER')
CTLAB_UID = os.environ.get('CTLAB_UID')

GETTT_KEY or CTLAB_UID or exit('GETTT_KEY or CTLAB_UID')


def validate(email_token, ctlab_uid, bot_token, user_id):
    r = '🚨🚨🚨🚨🚨🚨 AAAAH NO LABURIÓ'
    try:
        m = 'https://api.telegram.org/bot{}/sendMessage?chat_id={}&text={}'
        if CTLAB_UID:
            d = datetime.datetime.now().strftime('%d%m%Y')
            v = 'https://app.controllaboral.es/RegUser.aspx?c=1506&u={}&d={}&v=1'.format(ctlab_uid, d)
        else:
            t = json.loads(requests.get('https://gettt.viti.site/get?q=controllaboral&t={}'.format(email_token)).content)[0]['text/html']
            v = t.split('Validar jornada')[0].split('a href=\'')[1].split('\'>')[0]
        b = requests.get(v).text
        n = b.split('lblUsuario')[1].split('font')[1].split('>')[1].split('<')[0]
        if 'La jornada ha sido validada correctamente. Gracias por su colaboración' in b:
            r = '🤤🤤🤤🤤🤤🤤 LABURIÓÓÓÓ'
    except Exception as err:
        r += '\nError: {}: {}'.format(str(type(err)), str(err))

    requests.get(m.format(bot_token, user_id, r))


validate(GETTT_KEY, CTLAB_UID, TELEGRAM_TOKEN, TELEGRAM_USER)
