class Rating {
    constructor(div, rating = 0) {
        this.$div = div;
        this.$children = [];
        for (let i = 0; i < 5; i++) {
            this.$children.push(this.$div.children().eq(i));
            this.$children[i].addClass("editable");
            this.$children[i].on("click", () => {
                this.setRating(i + 1);
            });
        }
        this.setRating(rating);
    }

    setRating(newRating) {
        this.rating = newRating;

        for (let i = 0; i < 5; i++) {
            if (i < this.rating) this.$children[i].addClass("selected");
            else this.$children[i].removeClass("selected");
        }
    }
}

class App {
    constructor() {
        //state
        this.currentEntry = 0;
        this.editing = "none";
        this.rating = null;
        //dom elements
        this.$side = $(".side");
        this.$gallery = $(".gallery");

        //templates
        this.$createForm = $(".create-form").clone();
        $(".create-form").remove();
        this.$createForm.removeClass("invisible");

        this.$entryView = $(".entry-view").clone();
        $(".entry-view").remove();
        this.$entryView.removeClass("invisible");

        // Floating Buttons
        $("#new").on("click", this.openNew);
        $("#accept").on("click", this.sendNew);
        $("#cancel").on("click", this.close);
    }

    openNew = () => {
        this.$side.empty();
    
        let $newForm = this.$createForm.clone();
        this.rating = new Rating($newForm.find(".rating"), 3);
        this.$side.append($newForm);
    
        this.$side.addClass("side-out");
        this.$gallery.addClass("gallery-compact");
        $("#new").css("display", "none");
        $("#accept").css("display", "initial");
        $("#cancel").css("display", "initial");
    }

    sendNew = async () => {
        try {
            console.log("Creating new entry.");
            
            const res = await $.post("/entry", 
            {
                author: $(".create-form #author").val(),
                isDraft: false,
                isPublic: false,
                product: $(".create-form #product").val(),
                rating: this.rating.rating,
                content: $(".create-form #content").val()
            });

            if (res === "OK") {
                console.log("Created new entry.");
                entryGrid.generateEntries();

                this.close();
            }
            else {
                $("#create-form-info").text("Error: Unable to post your new entry!");
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    updateBasicInfo = ($parent) => {
        $parent.find(".product").text(`${entryGrid.entries[this.currentEntry].product}`);

        let $rating = $parent.find(".rating");
        $rating.empty();

        for (let i = 0; i < 5; i++) {
            if (i < entryGrid.entries[this.currentEntry].rating) {
                $rating.append(`<i class="fas fa-cannabis selected"></i>`);
            }
            else {
                $rating.append(`<i class="fas fa-cannabis"></i>`);
            }
        }

        $parent.find(".content").text(`Content: ${entryGrid.entries[this.currentEntry].content}`);
    }
    
    openView = (entryNumber) => {
        this.$side.empty();

        this.currentEntry = entryNumber;
    
        let $newView = this.$entryView.clone();

        this.updateBasicInfo($newView);
        $newView.find("#basic-edit").on("click", this.editBasicInfo);
        $newView.find("#basic-accept").on("click", this.saveBasicInfo);
        $newView.find("#basic-cancel").on("click", this.cancelBasicInfo);
        $newView.find("#delete-entry").on("click", async () => {
            try {
                console.log(entryGrid.entries);
                
                const res = await $.post(`/entry/${entryGrid.entries[this.currentEntry]._id}?_method=DELETE`);
        
                if (res === "OK") {
                    console.log("Deleted entry.");
                    entryGrid.generateEntries();
        
                    this.close();
                }
                else {
                    $("#entry-view-info").text("Error: Unable to delete your entry!");
                }
            }
            catch(err) {
                console.log(err);
            }
        });
        this.$side.append($newView);
    
        this.$side.addClass("side-out");
        this.$gallery.addClass("gallery-compact");
        $("#new").css("display", "none");
        $("#cancel").css("display", "initial");
    }
    
    close = () => {
        this.editing = "none";
        this.$side.removeClass("side-out");
        this.$gallery.removeClass("gallery-compact");
        $("#new").css("display", "initial");
        $("#accept").css("display", "none");
        $("#cancel").css("display", "none");
    }

    alreadyEditing() {
        if (this.editing !== "none") {
            $("#entry-view-info").text(`Please finish editing this entry's ${this.editing} first!`);
        }
        else return false;
    }

    editBasicInfo = () => {
        if (!this.alreadyEditing()){
            this.editing = "basic info";

            let $line = $(".entry-view").children().eq(0);

            $line.find(".read").addClass("invisible");
            $line.find(".edit").removeClass("invisible");

            $line.find(".edit").children().eq(0).attr("value", entryGrid.entries[this.currentEntry].product);
            this.rating = new Rating($line.find(".edit .rating"), entryGrid.entries[this.currentEntry].rating);
            $line.find(".edit").children().eq(3).attr("value", entryGrid.entries[this.currentEntry].content);

            $line.find(".fa-check").removeClass("invisible");
            $line.find(".fa-times").removeClass("invisible");
            $line.find(".fa-edit").addClass("invisible");
        }
    }

    saveBasicInfo = async () => {
        try {
            if (this.editing === "basic info") {
                let $line = $(".entry-view").children().eq(0);

                let entryData = entryGrid.entries[this.currentEntry];
                entryData.product = $line.find(".edit").children().eq(0).val();
                entryData.rating = this.rating.rating;
                entryData.content = $line.find(".edit").children().eq(3).val();
                
                const res = await $.post(`/entry/${entryGrid.entries[this.currentEntry]._id}?_method=PUT`, 
                {
                    product: entryData.product,
                    rating: entryData.rating,
                    content: entryData.content
                });

                if (res === "OK") {
                    console.log("Edited entry.");
                    entryGrid.generateEntries();

                    this.updateBasicInfo($line);
                    this.cancelBasicInfo();
                }
                else {
                    $("#entry-view-info").text("Error: Unable to edit your entry!");
                }
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    cancelBasicInfo = () => {
        if (this.editing === "basic info") {
            this.editing = "none";

            let $line = $(".entry-view").children().eq(0);

            $line.find(".read").removeClass("invisible");
            $line.find(".edit").addClass("invisible");

            $line.find(".fa-check").addClass("invisible");
            $line.find(".fa-times").addClass("invisible");
            $line.find(".fa-edit").removeClass("invisible");
        }
    }
}

const app = new App();