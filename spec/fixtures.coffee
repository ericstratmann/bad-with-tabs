class Chrome
    tabs:
        onCreated:
            addListener: (f) =>
                @listener = f
        onAttached:
            addListener: (f) =>
                @listener = f
        onRemoved:
            addListener: (f) =>
                @listener = f
        onSelectionChanged:
            addListener: (f) =>
                @listener = f
        remove: ->
            null
    windows:
        onRemoved:
            addListener: (f) =>
                @listener = f
        getAll: (opts, f) ->

class ChromeWindow
    constructor: (id) ->
        @id = id

class ChromeTab
    constructor: (id) ->
        @id = id

class Date
    getTime: ->
        Date.time

    @setTime: (time) ->
        @time = time
