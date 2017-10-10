(function() {

    if (!('webkitSpeechRecognition' in window)) {
        console.log('EEEEEEEEEEEEEEE');
    } else {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        var final_transcript;

        recognition.onstart = function() {
        }
        recognition.onresult = function(event) {

            var interim_transcript = '';

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            console.log('**', interim_transcript);
            console.log('--', final_transcript);
        }
        recognition.onerror = function(event) {
        }
        recognition.onend = function() {
        }
    }

    var start = function() {
        final_transcript = '';
        recognition.lang = 'cs';
        recognition.start();
    }

    // start();

    const files = [
        {
            id: 'wetFart',
            name: 'wet fart',
            path: 'assets/wetFart.mp3'
        },
        {
            id: 'girlFart',
            name: 'girl fart',
            path: 'assets/girlFart.mp3'
        },
        {
            id: 'fart',
            name: 'fart',
            path: 'assets/fart.mp3'
        },
        {
            id: 'scary',
            name: 'scary',
            path: 'assets/scary.mp3'
        },
        {
            id: 'laugh',
            name: 'laugh',
            path: 'assets/laugh.mp3'
        },
        {
            id: 'laughAndApplause',
            name: 'laugh and applause',
            path: 'assets/laughAndApplause.mp3'
        },
        {
            id: 'bomb',
            name: 'bomb',
            path: 'assets/bomb.mp3'
        },
        {
            id: 'fail',
            name: 'fail',
            path: 'assets/fail.mp3'
        },
        {
            id: 'thunder',
            name: 'thunder',
            path: 'assets/thunder.mp3'
        },
        {
            id: 'burp',
            name: 'burp',
            path: 'assets/burp.mp3'
        },
        {
            id: 'smallApplause',
            name: 'small applause',
            path: 'assets/smallApplause.mp3'
        },
        {
            id: 'bigApplause',
            name: 'big applause',
            path: 'assets/bigApplause.mp3'
        },
    ]

    var Sound = Backbone.Model.extend({});

    const SoundCollection = Backbone.Collection.extend({
        model: Sound,
        initialize() {

            createjs.Sound.on('fileload', this.fileLoaded.bind(this));

            setTimeout(() => {
                this.models.forEach((item) => {
                    createjs.Sound.alternateExtensions = ['mp3'];
                    createjs.Sound.registerSound({ src: item.get('path'), id: item.get('id') });
                })
            }, 50)
        },

        fileLoaded(evt) {
            let model = this.get(evt.id);
            model.set('loaded', true);
        },

    });

    var SoundView = Backbone.View.extend({

        events: {
            'click': 'soundClicked'
        },
        className: 'sound-item',
        initialize() {
            const model = this.model;
            this.listenTo(model, 'change:loaded', this.loaded);
        },

        render() {

            if (this.model.get('loaded')) {
                this.loaded();
            }

            this.$el.text(this.model.get('name'));
            return this;
        },

        loaded() {
            this.$el.addClass('active');
        },

        soundClicked() {
            if (this.model.get('loaded')) {
                createjs.Sound.play(this.model.get('id'));
            }
        }
    });

    var SoundListView = Backbone.View.extend({

        className: 'container',
        initialize() {

            this._views = {};
            this.collection.forEach((item) => {
                this._views[item.get('id')] = new SoundView({ model: item });
            })
        },

        render() {
            Object.keys(this._views).forEach((key) => {
                this.$el.append(this._views[key].render().el);
            });

            return this;
        }
    });


    var collection = new SoundCollection(files);
    var collectionView = new SoundListView({ collection });

    collectionView.render().$el.appendTo($('body'));

    // collection.on('all', console.log)
    window.colleciton = collection;
}())
