# SnakeGame

Este es un juego clásico de la serpiente programado en Python con la biblioteca Pygame.

## Cómo jugar

El objetivo del juego es comer la mayor cantidad de frutas posibles sin chocar con las paredes ni con el cuerpo de la serpiente. Las frutas aparecen aleatoriamente en la pantalla y se pueden recoger al tocarlas con la cabeza de la serpiente.

Para mover la serpiente, usa las flechas del teclado: ↑ (arriba), ↓ (abajo), ← (izquierda) y → (derecha). Si la serpiente alcanza el borde de la pantalla, aparecerá en el borde opuesto.

Si la serpiente choca con una pared o con su propio cuerpo, el juego termina. En ese caso, aparecerá un mensaje indicando la puntuación obtenida y se reiniciará el juego.

## Cómo ejecutar el juego

1. Descarga o clona este repositorio en tu ordenador.
2. Abre una terminal y ve al directorio donde se encuentra el archivo `main.py`.
3. Asegúrate de tener Python y Pygame instalados en tu ordenador.
4. Ejecuta el comando `python main.py` para iniciar el juego.

## Personalización

Si quieres cambiar el aspecto o el comportamiento del juego, puedes modificar los siguientes parámetros en el archivo `config.py`:

- `WIDTH` y `HEIGHT`: tamaño de la pantalla en píxeles.
- `FPS`: velocidad de actualización de la pantalla en fotogramas por segundo.
- `SNAKE_SIZE`: tamaño de la serpiente en píxeles.
- `FRUIT_SIZE`: tamaño de la fruta en píxeles.
- `SPEED_INCREMENT`: aumento de velocidad después de comer una fruta.
- `WALLS`: si es `True`, se mostrarán las paredes alrededor de la pantalla; si es `False`, la serpiente aparecerá en el borde opuesto al alcanzar el borde de la pantalla.

## Licencia

Este proyecto está bajo la Licencia MIT. Puedes hacer lo que quieras con él, siempre y cuando menciones al autor original. Consulta el archivo LICENSE para más detalles.
