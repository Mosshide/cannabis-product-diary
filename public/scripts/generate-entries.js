class EntryGrid {
    constructor() {
        this.$grid = $(".entry-grid");
        this.$cardTemplate = $("#entry-card-template").clone();
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
                    let date = new Date(this.entries[i].createdAt);
                    let day = date.getDate();
                    let month = date.getMonth();
                    let year = date.getFullYear();
                    
                    let $newEntry = this.$cardTemplate.clone();
                    $newEntry.on("click", function() {
                        app.openView(i);
                    });
                    $newEntry.children().eq(0).text(`${month}/${day}/${year}`);
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
                    const nameRes = await fetch(`/user/name/${this.entries[i].author}`);
                    const nameData = await nameRes.json();
                    $newEntry.children().eq(5).text(`Author: ${nameData.name}`);
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