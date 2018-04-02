$(document).dblclick(function (event) {
    if (!$("#definition-popup").has(event.target).length && event.target.id != "definition-popup") {
        let selection = window.getSelection();
        let text = selection.toString().trim();

        if (text !== '') {

            let message = {
                text: text
            }

            chrome.runtime.sendMessage(message, function (data) {


                $("body").append("<div id='definition-popup'></div>");
                $("#definition-popup").css("position", "absolute");

                let x = window.scrollX + selection.getRangeAt(0).getBoundingClientRect().x + 10;
                let y = window.scrollY + selection.getRangeAt(0).getBoundingClientRect().y + 20;

                $("#definition-popup").css("left", x);
                $("#definition-popup").css("top", y);

                if (data.error) {
                    $("#definition-popup").append(`<h1 id="word-title">${text}</h1>`);
                    $("#definition-popup").append(`<p id="error">${data.error}</p>`);
                } else {
                    $("#definition-popup").append(`<h1 id="word-title">${data.word}</h1>`);
                    $("#definition-popup").append('<div id="word-pronounciation-div"></div>')
                    $("#word-pronounciation-div").append(`<h3 id="word-pronounciation">${data.pronounciation}</h3>`);
                    $("#word-pronounciation-div").append(`<audio id="word-pronounciation-audio"><source src="${data.audio}" type="audio/mpeg"></audio>`);
                    $("#word-pronounciation-div").append("<button id='play-audio-button'>🔊</button>");
                    for (elm in data.definitions) {
                        let container = $('<div></div>');
                        container.append(`<p class="part-of-speech">${elm}</p>`);

                        let definitions = $('<ul></ul>');
                        for (definition of data.definitions[elm]) {
                            definitions.append(`<li class="definition">${definition}</li>`);
                        }

                        container.append(definitions);

                        $("#definition-popup").append(container);
                    }

                    let audio = document.getElementById('word-pronounciation-audio');

                    $('#play-audio-button').click(function () {
                        audio.play();
                    });

                    audio.onplay = function () {
                        $('#play-audio-button').css('background-color', '#ddd');
                    };

                    audio.onpause = function () {
                        $('#play-audio-button').css('background-color', 'transparent');
                    };
                }


            });
        }
    }
});

$(document).click(function (event) {

    if (!$("#definition-popup").has(event.target).length && event.target.id != "definition-popup") {
        $("#definition-popup").remove();
    }

});

$(window).resize(function () {
    $("#definition-popup").remove();
});