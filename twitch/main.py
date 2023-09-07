import conexion
import argparse
import time
import consultaTwitch as twitch
from datetime import datetime


parser = argparse.ArgumentParser()
parser.add_argument('-m', "--modo", help='Selecciona el modo. 1 -> Series activas', default=3, type=int)
args = parser.parse_args()
modo = args.modo

conexion.startConn('localhost', 26016)


def consultaDatos():
    cats = conexion.getCategoriasActivas()

    run = True
    cursor = ''
    pag = 1
    time = str(datetime.now())
    doc = {'time': time}
    conexion.saveTrack(doc)

    while run:
        print('Vamos por la pag: ' + str(pag))
        temp = twitch.getTopStreams(cursor, cats)
        conexion.pushTrack(time, temp['data'])
        if temp['data'][-1]['viewer_count'] > 20:
            cursor = temp['pagination']['cursor']
            pag = pag+1
        else:
            run = False

    while True:
        consultaDatos()
        time.sleep(600)
    #quit()