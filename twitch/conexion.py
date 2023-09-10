import pymongo

import consultaTwitch as twitch


class Conexion(object):
    URI = 'mongodb://127.0.0.1:27017'
    conn = None
    colSeries = None
    colTracks = None


def startConn(host,port):
    if Conexion.conn is None:
        print('Estableciendo conexion con base de datos ')
        Conexion.conn = pymongo.MongoClient(Conexion.URI)
        Conexion.colSeries = Conexion.conn['seriePomodoro']['series']
        Conexion.colTracks = Conexion.conn['seriePomodoro']['tracks']
    return Conexion.conn

def saveSerie(doc):
    if not doc['categoriaID']:  # Check categoriaID
        print('Obteniendo el ID de la categoria')
        doc['categoriaID'] = twitch.getGameID(doc['categoria'])

    for index, streamer in enumerate(doc['streamers']):
        if not streamer['streamerID']:
            doc['streamers'][index]['streamerID'] = twitch.getUserID(streamer['nick'])

    if existeSerie(doc['nombre']):
        Conexion.colSeries.update_one({'nombre': doc['nombre']}, {'$set': doc})
    else:
        Conexion.colSeries.insert_one(doc)

def saveTrack(doc):
    Conexion.colTracks.insert_one(doc)

def pushTrack(time, lista):
    Conexion.colTracks.update_one({'time': time}, {'$push': {'track': {'$each': lista}}})

def getSeries():
    return Conexion.colSeries.find()

def getCategoriasActivas():
    series = Conexion.colSeries.find({'activa': True}, {'categoriaID': 1, '_id': 0})  # case sensitive
    res = []
    for serie in series:
        res.append(serie['categoriaID'])
    return res

def existeSerie(serie):
    return not len(list(Conexion.colSeries.find({'nombre': serie}))) == 0

def getSeriesActivas():
    return Conexion.colSeries.find({'activa': True})
