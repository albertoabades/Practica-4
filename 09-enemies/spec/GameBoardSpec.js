/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colección de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se añaden como tableros independientes para que Game pueda
  ejecutar sus métodos step() y draw() periódicamente desde su método
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre sí. Aunque se añadiesen nuevos tableros para los
  misiles y para los enemigos, resulta difícil con esta arquitectura
  pensar en cómo podría por ejemplo detectarse la colisión de una nave
  enemiga con la nave del jugador, o cómo podría detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: diseñar e implementar un mecanismo que permita gestionar
  la interacción entre los elementos del juego. Para ello se diseñará
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego serán las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard será un board más, por lo que deberá ofrecer los
  métodos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos métodos.

  Este prototipo no añade funcionalidad nueva a la que ofrecía el
  prototipo 06.


  Especificación: GameBoard debe

  - mantener una colección a la que se pueden añadir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosión, etc.

  - interacción con Game: cuando Game llame a los métodos step() y
    draw() de un GameBoard que haya sido añadido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los métodos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisión entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deberán
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cuándo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qué tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto sólo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/
describe("Clase GameBoard", function(){
	var canvas, ctx;
	
	beforeEach(function(){
	loadFixtures('index.html');
	
	canvas=$('#game')[0];
	expect(canvas).toExist();
	
	ctx=canvas.getContext('2d');
	expect(ctx).toBeDefined();
	
	oldGame=Game
	Game = {width: 320, height:480};
	});

	afterEach(function(){
	Game=oldGame;
	});

	it("draw", function(){
		var gmbd = new GameBoard();
		spyOn(gmbd,"iterate");
		gmbd.draw(ctx);
		expect(gmbd.iterate).toHaveBeenCalledWith("draw",ctx);
	});

	it("step",function(){
		var gmbd = new GameBoard();
		gmbd.add("cero");
		gmbd.add("uno");
		spyOn(gmbd,"resetRemoved");
		spyOn(gmbd,"iterate");
		spyOn(gmbd,"finalizeRemoved");
		gmbd.step(1);
		expect(gmbd.resetRemoved).toHaveBeenCalled();
		expect(gmbd.iterate).toHaveBeenCalledWith('step',1);
		expect(gmbd.finalizeRemoved).toHaveBeenCalled();
	});

	it("add",function(){
		var gmbd = new GameBoard();
		var foo="foo";
		gmbd.add(foo);
		expect(gmbd.objects[0]).toEqual("foo");
	});

	it("resetRemoved",function(){
		var gmbd = new GameBoard();
		gmbd.resetRemoved();
		expect(gmbd.removed).toBeDefined();
	});

	it("remove",function(){
		var gmbd = new GameBoard();
		gmbd.resetRemoved();
		gmbd.remove("cero");
		expect(gmbd.removed).toBeDefined();
		expect(gmbd.removed[0]).toEqual("cero");
	});

	it("finalizeRemoved",function(){
		var gmbd = new GameBoard();
		gmbd.add("cero");
		gmbd.add("uno");
		gmbd.add("dos");
		gmbd.resetRemoved();
		gmbd.remove("cero");
		gmbd.remove("uno");
		gmbd.remove("dos");
		expect(gmbd.removed).toBeDefined();
		expect(gmbd.removed.length).toEqual(3);
		gmbd.finalizeRemoved();
		expect(gmbd.objects.length).toEqual(0);
	});

	it("iterate",function(){
		var gmbd = new GameBoard();
		var funvacia= new function(){
			this.func= function(){return true};
		};
		spyOn(funvacia,"func");
		gmbd.add(funvacia);
		gmbd.iterate('func');
		expect(funvacia.func).toHaveBeenCalled();
	});

	it("detect",function(){
		var gmbd = new GameBoard();
		gmbd.add("cero");
		gmbd.add("uno");
		var functrue=function(){
			return true;
		};
		expect(gmbd.detect(functrue)).toBe("cero");
	});

	it("overlap",function(){
		var gmbd = new GameBoard();
		var Rect = function(x,y,w,h){
			this.x=x|0;
			this.y=y|0;
			this.w=w|0;
			this.h=h|0;
		}
		var rect1 = new Rect(50,50,40,40);
		var rect2 = new Rect(50,100,40,40);
		var rect3 = new Rect(50,60,40,40);
		expect(gmbd.overlap(rect1,rect2)).toBe(false);
		expect(gmbd.overlap(rect1,rect3)).toBe(true);
	});

	it("collide",function(){
	});

});
