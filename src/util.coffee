Object.prototype.find = (f) ->
    for own k, v of this
        return v if f v
