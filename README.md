# seriesPomodoro

KNOWN ISSUES LIST:
* Poblar la bbdd por primera vez al menos con los roles (web explota al registro si no lo tiene)

* La libreria de shortid no funciona, se ha buscado sustituta (nanoid), finalmente descartada porque añadia una capa extra de complejidad innecesaria, se usan los hash UUID que proporciona mongo como identificador unico de cada objeto

