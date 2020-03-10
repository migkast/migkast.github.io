var app = {

    start: function () {


        //desaparecer com a div de start
        $("#startscreen").hide();


        var x = 0;
        var y = 1;
        var k = 0;

        $(document).keydown(function (key) {

            switch (parseInt(key.which, 10)) {


            case 38:
                if (x == 0) {
                    $("#bola").animate({
                            top: "-=200px"
                        },
                        300);

                    x = 1;
                    y = 0;


                };
                break;

            case 40:

                if (y == 0) {
                    $("#bola").animate({
                            top: "+=200px"
                        },
                        400);

                    x = 0;
                    y = 1;


                };
                break;
            }

        });


        // -------------- Mover OBJECTOS CONTRA A BOLA: ---------------

        function moverpostes() {
            window.setTimeout(function () {
                $("#poste").animate({
                        left: "-=550px"
                    },
                    3000,
                    function () { //METER RANDOM NO 3000 para dificultar
                        $(this).css({
                            "left": "600px"
                        }); //funcao para voltar dps d animar
                    }); // 1º e o tempo q demora animacao
            }, 0); // este e o tempo pa animacao comecar
        }



        setInterval(function () {
            moverpostes()
        }, 3000);


        //mudar o poste e a trave de lugar para o ligar inicial dps de se moverem, depois chamar funcao para se moverem novamente.


        function movertraves() {
            window.setTimeout(function () {
                $("#trave").animate({
                        left: "-=550px"
                    },
                    3300,
                    function () {
                        $(this).css({
                            "left": "600px"
                        });
                    }); //1500 tempo q demora animacao
            }, 1400); // 1400 tempo pa animacao comecar
        }

        setInterval(function () {
            movertraves()
        }, 3000);


        // --------------- Mover FUNDO -------------------------

        function moverfundo() {
            window.setTimeout(function () {
                $("#fundo").animate({
                        left: "-=10000px"
                    },
                    90000, "linear",
                    function () {
                        $(this).css({
                            "left": "150px" //definir posicao inicial! nao o movimento
                        });
                    }); //20000 tempo q demora animacao
            }, 0); // 500 tempo pa animacao comecar
        }

        moverfundo(); //1a chamada da funcao

        setInterval(function () {
            moverfundo()
        }, 10000); //tempo em tempo que chama esta funcao




        // --------------------- COLISOES -----------------------




        function collision() {

            var bolcor = $("#bola").position();

            var postcor = $("#poste").position();

            var travecor = $("#trave").position();

            var rect1 = {
                x: bolcor.left,
                y: bolcor.top,
                width: 70,
                height: 51
            }
            var rect2 = {
                x: postcor.left,
                y: postcor.top,
                width: 70,
                height: 58
            }
            var rect3 = {
                x: travecor.left,
                y: travecor.top,
                width: 80,
                height: 48
            }


            if (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y)

            {


                alert("FOSTE! Nem para porco serves!");
            }

            if (rect1.x < rect3.x + rect3.width &&
                rect1.x + rect1.width > rect3.x &&
                rect1.y < rect3.y + rect3.height &&
                rect1.height + rect1.y > rect3.y) {


                alert("ADIOS AMIGO! Morreu de morcegura aguda!");
            }


            /*console.log("correu");
            console.log("porco" + bolcor.top + "left" + bolcor.left);
            console.log("bruxa" + postcor.top + "left" + postcor.left);*/
        }


        var sicollision = setInterval(function () {

            collision()
        }, 0.1);



        //------------------------- parentesis da app.start aseguir:

    },

    stop: function () {

        function stopFunction() {
            clearInterval();
        }


    }
}