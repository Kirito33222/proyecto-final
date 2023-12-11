var juego = new Phaser.Game(290, 540, Phaser.CANVAS, 'bloque_juego');

juego.state.add('Preload', PreloadState);
juego.state.add('Inicio', InicioState); // Asegúrate de tener este estado
juego.state.add('Juego', Juego);
juego.state.add('GameOver', GameOver);
juego.state.add('Win', Win);

juego.state.start('Preload');