Array.prototype.findFirst = (f) ->
    ret = this.filter (i) -> f i
    return ret[0] if ret.length > 0
    null

Array.prototype.remove = (i) ->
    this[i] = this[this.length - 1]
    this.length -= 1

