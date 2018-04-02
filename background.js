chrome.runtime.onMessage.addListener(receiver);

function receiver(req, sender, sendResponse) {

    let word = req.text;

    let WordPartsURL = `http://api.wordnik.com:80/v4/word.json/${word}/hyphenation?useCanonical=false&limit=50&api_key=f0c54bfe816e1c9cb917306c542021034d976d6be0d159c3c`;
    let WordPartsCanonicalURL = `http://api.wordnik.com:80/v4/word.json/${word}/hyphenation?useCanonical=true&limit=50&api_key=f0c54bfe816e1c9cb917306c542021034d976d6be0d159c3c`
    let DefinitionsURL = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=f0c54bfe816e1c9cb917306c542021034d976d6be0d159c3c`;
    let DefinitionsCanonicalURL = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=f0c54bfe816e1c9cb917306c542021034d976d6be0d159c3c`;
    let PronounciationURL = `http://api.wordnik.com:80/v4/word.json/${word}/pronunciations?useCanonical=false&limit=50&api_key=f0c54bfe816e1c9cb917306c542021034d976d6be0d159c3c`;
    let PronounciationCanonicalURL = `http://api.wordnik.com:80/v4/word.json/${word}/pronunciations?useCanonical=true&limit=50&api_key=f0c54bfe816e1c9cb917306c542021034d976d6be0d159c3c`;
    let AudioURL = `http://api.wordnik.com:80/v4/word.json/${word}/audio?useCanonical=false&limit=50&api_key=f0c54bfe816e1c9cb917306c542021034d976d6be0d159c3c`;
    let AudioCanonicalURL = `http://api.wordnik.com:80/v4/word.json/${word}/audio?useCanonical=true&limit=50&api_key=f0c54bfe816e1c9cb917306c542021034d976d6be0d159c3c`;


    let data = {
        word: undefined,
        pronounciation: undefined,
        audio: undefined,
        definitions: {}
    };

    axios.get(WordPartsCanonicalURL).then(function (result) {

        if (result.data.length) {
            let text = '';
            for (elm of result.data) {
                if (text.length === 0) {
                    text += elm.text;
                } else {
                    text += "-" + elm.text;
                }
            }

            data.word = text;

            axios.get(PronounciationCanonicalURL).then(function (result) {
                if (result.data.length) {
                    data.pronounciation = result.data[0].raw;
                }

                axios.get(DefinitionsCanonicalURL).then(function (result) {
                    if (result.data.length) {
                        for (elm of result.data) {
                            if (elm.partOfSpeech) {
                                if (elm.partOfSpeech in data.definitions) {
                                    data.definitions[elm.partOfSpeech].push(elm.text);
                                } else {
                                    data.definitions[elm.partOfSpeech] = [elm.text];
                                }
                            }


                        }

                        if (!data.word.length) {
                            data.word = result.data[0].word;
                        }

                        axios.get(AudioCanonicalURL).then(function (result) {
                            data.audio = result.data[1].fileUrl;
                            sendResponse(data);
                        });


                    } else {
                        sendResponse({
                            error: "Definition not found."
                        });
                    }
                });

            });

        } else {
            axios.get(WordPartsURL).then(function (result) {

                let text = '';
                for (elm of result.data) {
                    if (text.length === 0) {
                        text += elm.text;
                    } else {
                        text += "-" + elm.text;
                    }
                }

                data.word = text;

                axios.get(PronounciationURL).then(function (result) {
                    if (result.data.length) {
                        data.pronounciation = result.data[0].raw;
                    }

                    axios.get(DefinitionsURL).then(function (result) {
                        if (result.data.length) {
                            for (elm of result.data) {
                                if (elm.partOfSpeech) {
                                    if (elm.partOfSpeech in data.definitions) {
                                        data.definitions[elm.partOfSpeech].push(elm.text);
                                    } else {
                                        data.definitions[elm.partOfSpeech] = [elm.text];
                                    }
                                }


                            }

                            if (!data.word.length) {
                                data.word = result.data[0].word;
                            }

                            axios.get(AudioURL).then(function (result) {
                                data.audio = result.data[1].fileUrl;
                                sendResponse(data);
                            });

                        } else {
                            sendResponse({
                                error: "Definition not found."
                            });
                        }
                    });

                });

            });
        }
    });

    return true;
};