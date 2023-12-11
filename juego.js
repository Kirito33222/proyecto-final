var fondo;
var carro;
var cursores;
var enemigos;
var enemigos2;
var timer;

var gasolinas;
var timerGasolina;
var vidaCarro = 3;
var contadorGasolina = 0; 
var nivel = 1;
var barraDeVida;
var textoNivel;
var textoCombustible;

var Juego = {
	preload: function(){
		
		juego.load.image('bg','img/bg.png');
		juego.load.image('carro','img/carro.png');
		juego.load.image('enemigo1','img/alpaca.png');
		juego.load.image('enemigo2', 'img/perro.png');
		juego.load.image('gasolina','img/gas.png');
		juego.load.image('pantallaInicio', 'img/banderadelperu.png');
	},

	create: function(){

		fondo = juego.add.tileSprite(0,0,290,540,'bg');

		carro=juego.add.sprite(juego.width/2,496,'carro');
		carro.anchor.setTo(0.5);

		enemigos = juego.add.group();
		juego.physics.arcade.enable(enemigos,true);
		enemigos.enableBody = true;
		enemigos.createMultiple(20,'enemigo1');
		enemigos.setAll('anchor.x',0.5);
		enemigos.setAll('anchor.y',0.5);
		enemigos.setAll('outOfBoundsKill', true);
		enemigos.setAll('checkWorlBounds',true);

		gasolinas = juego.add.group();
		juego.physics.arcade.enable(gasolinas,true);
		gasolinas.enableBody = true;
		gasolinas.createMultiple(20,'gasolina');
		gasolinas.setAll('anchor.x',0.5);
		gasolinas.setAll('anchor.y',0.5);
		gasolinas.setAll('outOfBoundsKill', true);
		gasolinas.setAll('checkWorlBounds',true);

		enemigos2 = juego.add.group();
    juego.physics.arcade.enable(enemigos2, true);
    enemigos2.enableBody = true;
    enemigos2.createMultiple(20, 'enemigo2'); 
    enemigos2.setAll('anchor.x', 0.5);
    enemigos2.setAll('anchor.y', 0.5);
    enemigos2.setAll('outOfBoundsKill', true);
    enemigos2.setAll('checkWorldBounds', true);

		timer = juego.time.events.loop(1500, this.crearCarroMalo, this);

		timerGasolina = juego.time.events.loop(2000, this.crearGasolina, this);

		cursores = juego.input.keyboard.createCursorKeys();

		barraDeVida = juego.add.graphics(0, 0);
    barraDeVida.lineStyle(2, 0x000000, 1);
    barraDeVida.beginFill(0xFF0000, 1);
    barraDeVida.drawRect(50, 10, 200, 20); 
    barraDeVida.endFill();

    var textoAutor = juego.add.text(juego.width / 2, juego.height - 20, "David Bravo Ambrocio", { font: "14px Arial", fill: "#ffffff" });
    textoAutor.anchor.setTo(0.5, 0);

    	juego.physics.arcade.enable(carro);

    	 textoNivel = juego.add.text(20, 40, "Nivel: 1", { font: "14px Arial", fill: "#ffffff" });
        textoCombustible = juego.add.text(20, 60, "Combustible: 0", { font: "14px Arial", fill: "#ffffff" });
	},
	update: function(){
		fondo.tilePosition.y +=3;
		if(cursores.right.isDown && carro.position.x<245){
			carro.position.x+=5;
		}else if (cursores.left.isDown && carro.position.x>45){
			carro.position.x-=5;
		}
		enemigos.forEachAlive((enemigo) => {
        if(juego.physics.arcade.overlap(carro, enemigo)){
            this.colisionEnemigo(carro, enemigo);
        }
    }, this);

		enemigos2.forEachAlive((enemigo) => {
        if(juego.physics.arcade.overlap(carro, enemigo)){
            this.colisionEnemigo(carro, enemigo);
        }
    }, this);

    gasolinas.forEachAlive((gasolina) => {
        if(juego.physics.arcade.overlap(carro, gasolina)){
            this.recolectarGasolina(carro, gasolina);
        }
    }, this);


        if (vidaCarro <= 0) {
           
            juego.state.start('GameOver'); 
        }

        if (contadorGasolina >= [5, 10, 15][nivel - 1]) {
            nivel++;
            vidaCarro++;
            contadorGasolina = 0;
            
            enemigos.forEach(function(enemigo){
                enemigo.body.velocity.y *= 1.2;
            });

            textoNivel.text = "Nivel: " + nivel;
        }

        textoCombustible.text = "Combustible: " + contadorGasolina;

        if (nivel > 3) {
        
            juego.state.start('Win'); 
        }

        barraDeVida.scale.x = vidaCarro / 3;


	},

	crearCarroMalo: function(){
    	var posicion = Math.floor(Math.random()*3)+1;
    	var enemigo;

    	if (nivel === 2) {
	        enemigo = enemigos2.getFirstDead();
    	} else {
	        enemigo = enemigos.getFirstDead();
    	}

    	if (nivel === 3 && Math.random() > 0.5) {
        	enemigo = enemigos2.getFirstDead();
    	}

    	enemigo.physicsBodyType = Phaser.Physics.ARCADE;
    	enemigo.reset(posicion*73,0);
    	enemigo.body.velocity.y=200;
    	enemigo.anchor.setTo(0.5);
	},

	crearGasolina: function(){
		var posicion = Math.floor(Math.random()*3)+1;
		var gasolina = gasolinas.getFirstDead();
		gasolina.physicsBodyType = Phaser.Physics.ARCADE;
		gasolina.reset(posicion*73,0);
		gasolina.body.velocity.y=200;
		gasolina.anchor.setTo(0.5);
	},

	colisionEnemigo: function(carro, enemigo){
        enemigo.kill();
        vidaCarro--;
    },

    recolectarGasolina: function(carro, gasolina){
        gasolina.kill();
        contadorGasolina++;
    },
}

var GameOver = {
    create: function() {
        juego.stage.backgroundColor = "#000000";
        var textoGameOver = juego.add.text(juego.world.centerX, juego.world.centerY, "Game Over\nPresiona <- o ->", { font: "40px Arial", fill: "#ffffff", align: "center" });
        textoGameOver.anchor.setTo(0.5);
        var teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        var teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        teclaDerecha.onDown.add(this.reiniciarJuego, this);
        teclaIzquierda.onDown.add(this.reiniciarJuego, this);
    },

    reiniciarJuego: function() {
        vidaCarro = 3;
        contadorGasolina = 0;
        nivel = 1;
        juego.state.start('Juego');
    },

}

var Win = {
    create: function() {
        juego.stage.backgroundColor = "#000000";
        var textoWin = juego.add.text(juego.world.centerX, juego.world.centerY, "Felicitaciones\nGanaste", { font: "40px Arial", fill: "#ffffff", align: "center" });
        textoWin.anchor.setTo(0.5);

        // Añadir control de teclado
        var teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        var teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        teclaDerecha.onDown.add(this.reiniciarJuego, this);
        teclaIzquierda.onDown.add(this.reiniciarJuego, this);
    },

    reiniciarJuego: function() {
        vidaCarro = 3;
        contadorGasolina = 0;
        nivel = 1;
        juego.state.start('Juego');
   },
}

var PreloadState = {
    preload: function() {

        juego.load.image('banderadelperu', 'img/banderadelperu.png');

    },
     create: function() {

        juego.state.start('Inicio'); // Asumiendo que tienes un estado 'Inicio' para la pantalla de inicio
    },
}

var InicioState = {
    create: function() {

        var imagenInicio = juego.add.sprite(juego.world.centerX, juego.world.centerY, 'banderadelperu');
        imagenInicio.anchor.setTo(0.5, 0.5);


        var textoBienvenida = juego.add.text(juego.world.centerX, 50, "Bienvenido al Perú", { font: "24px Arial", fill: "#ffffff" });
        textoBienvenida.anchor.setTo(0.5, 0.5);

        var textoInstruccion = juego.add.text(juego.world.centerX, juego.world.height - 50, "Para iniciar el juego,\nApriete la flecha derecha o\n izquierda", { font: "24px Arial", fill: "#ffffff", align: "center" });
        textoInstruccion.anchor.setTo(0.5, 0.5);

       
        var teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        var teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        teclaDerecha.onDown.add(this.iniciarJuego, this);
        teclaIzquierda.onDown.add(this.iniciarJuego, this);
    },

    iniciarJuego: function() {
        juego.state.start('Juego');
    },
}