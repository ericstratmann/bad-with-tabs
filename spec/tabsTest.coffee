describe "Tabs", ->
    it "set their id properly", ->
        tab1 = new Tab new ChromeTab 1
        tab2 = new Tab new ChromeTab 2
        expect(tab1.id).toBe 1
        expect(tab2.id).toBe 2

    it "can have their window set", ->
        tab = new Tab new ChromeTab 3
        tab.setWindow new ChromeWindow 4
        expect(tab.window.id).toBe 4

    it "can update their last access time", ->
        Date.setTime(5)
        tab = new Tab new ChromeTab 4
        expect(tab.lastAccess).toBe 5

        Date.setTime(6)
        tab.updateLastAccess()
        expect(tab.lastAccess).toBe 6
