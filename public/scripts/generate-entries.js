class EntryGrid {
    constructor() {
        this.$grid = $(".entry-grid");
        this.$cardTemplate = $("#entry-card-template").clone();
        this.entries = null;

        this.generateEntries();
    }

    generateEntries(filters) {
        this.$grid.empty();

        let urlString = "/entry";
        if (filters) {
            if (filters.showPublic) urlString += `?showPublic=true`;
        }
        
        $.get(urlString, (res) => {
            this.entries = res.entries;
            
            for (let i = 0; i < this.entries.length; i++) {
                let date = new Date(this.entries[i].createdAt);
                let day = date.getDate();
                let month = date.getMonth();
                let year = date.getFullYear();
                
                let $newEntry = this.$cardTemplate.clone();
                $newEntry.on("click", function() {
                    app.openView(i);
                });
                $newEntry.children().eq(0).text(`${month}/${day}/${year}`);
                $newEntry.children().eq(1).text(this.entries[i].product);
                for (let j = 0; j < 5; j++) {
                    if (j < this.entries[i].rating) {
                        $newEntry.children().eq(3).append(`<i class="fas fa-cannabis selected"></i>`);
                    }
                    else {
                        $newEntry.children().eq(3).append(`<i class="fas fa-cannabis"></i>`);
                    }
                }
                this.$grid.append($newEntry);
            };
        });
    }
}

const entryGrid = new EntryGrid();