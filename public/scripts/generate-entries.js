class EntryGrid {
    constructor() {
        this.$grid = $(".entry-grid");
        this.$cardTemplate = $("#entry-card-template").clone();
        this.$grid.empty();
        this.$cardTemplate.removeClass("invisible");
        this.entries = null;
        this.user = null;

        this.generateEntries();
    }

    generateEntries(filters) {
        this.$grid.empty();

        let urlString = "/entry";
        if (filters) {
            if (filters.showPublic) urlString += `?showPublic=true`;
        }
        
        $.get(urlString, async (res) => {
            try {
                this.user = res.user;
                this.entries = res.entries;
                
                for (let i = 0; i < this.entries.length; i++) {
                    let $newEntry = this.$cardTemplate.clone();
                    $newEntry.on("click", function() {
                        app.openView(i);
                    });
                    $newEntry.children().eq(0).text(this.entries[i].dateOfExperience);
                    $newEntry.children().eq(1).text(this.entries[i].title);
                    $newEntry.children().eq(3).text(this.entries[i].product);
                    for (let j = 0; j < 5; j++) {
                        if (j < this.entries[i].rating) {
                            $newEntry.children().eq(4).append(`<i class="fas fa-cannabis selected"></i>`);
                        }
                        else {
                            $newEntry.children().eq(4).append(`<i class="fas fa-cannabis"></i>`);
                        }
                    }
                    $newEntry.children().eq(5).text(`Author: ${this.entries[i].author.name}`);
                    this.$grid.append($newEntry);
                };
            }
            catch(err) {
                console.log(err);
            }
        });
    }
}

const entryGrid = new EntryGrid();