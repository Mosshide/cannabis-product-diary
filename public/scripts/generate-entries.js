class EntryGrid {
    constructor() {
        this.$grid = $(".entry-grid");
        this.$cardTemplate = $("#entry-card-template").clone();
        this.$cardTemplate.removeClass("invisible");
        this.entries = null;

        this.generateEntries();
    }

    generateEntries() {
        this.$grid.empty();
        
        $.get(`/entry`, (res) => {
            this.entries = res.entries;
            
            for (let i = 0; i < this.entries.length; i++) {
                let date = new Date(this.entries[i].createdAt);
                let day = date.getDate();
                let month = date.getMonth();
                let year = date.getFullYear();
                
                let $newEntry = this.$cardTemplate.clone();
                $newEntry.on("click", function() {
                    openView(i);
                });
                $newEntry.children().eq(0).text(`${month}/${day}/${year}`);
                $newEntry.children().eq(1).text(this.entries[i].product);
                $newEntry.children().eq(2).text(this.entries[i].content);
                this.$grid.append($newEntry);
            };
        });
    }
}

const entryGrid = new EntryGrid();