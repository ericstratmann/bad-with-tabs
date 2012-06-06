$ ->
    policy = readLocal()
    if policy
        $("#max_tabs_per_window").val policy["maxTabsPerWindow"]


    $("#options_form").submit ->
        policy = {}
        maxTabsPerWindow = $ "#max_tabs_per_window"
        policy["maxTabsPerWindow"] = maxTabsPerWindow.val()
        saveLocal policy
        false

readLocal = ->
    if localStorage["policy"]
        return JSON.parse localStorage["policy"]

saveLocal = (policy) ->
    localStorage["policy"] = JSON.stringify policy
