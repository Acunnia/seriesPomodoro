import requests
import config

URL = 'https://api.twitch.tv/helix/streams?broadcaster_id='
URLUsers = 'https://api.twitch.tv/helix/users?login='
authURL = 'https://id.twitch.tv/oauth2/token'
gamesURL = 'https://api.twitch.tv/helix/games'
streamsURL = 'https://api.twitch.tv/helix/streams'
Client_ID = config.Client_ID
Secret = config.Secret

AutParams = {'client_id': Client_ID,
             'client_secret': Secret,
             'grant_type': 'client_credentials'
             }

AutCall = requests.post(url=authURL, params=AutParams)
access_token = AutCall.json()['access_token']

head = {
    'Client-ID': Client_ID,
    'Authorization': "Bearer " + access_token
}


def getGameID(name):
    return requests.get(gamesURL + '?name=' + name, headers=head).json()['data'][0]['id']


def getUserID(nick):
    try:
        r = requests.get(URLUsers + nick, headers=head).json()

        if r['data']:
            temp = r['data'][0]
            return str(temp['id'])
        else:
            return 'error'
    except Exception as ex:
        print(ex)



def getTopStreams(pag, cat):
    query = ''
    if cat is not []:
        for id in set(cat):
            query += '&game_id=' + id
        print(query)
    if pag == '': # Games: 509658 / JustChatting
        return requests.get(streamsURL + '?first=100&language=es' + query, headers=head).json()
    else:
        return requests.get(streamsURL + '?first=100&language=es&after=' + pag + query, headers=head).json()