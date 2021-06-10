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
        this.state = "none";
        this.currentEntry = 0;
        this.rating = null;
        this.filters = {
            sort: "-createdAt",
            search: "",
            showPublic: false
        }
        this.user = null;

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

        this.$filters = $(".filters").clone();
        $(".filters").remove();
        this.$filters.removeClass("invisible");

        // Floating Buttons
        $("#new").on("click", this.openNew);
        $("#accept").on("click", this.accept);
        $("#cancel").on("click", this.cancel);
        $("#edit").on("click", this.entryEdit);
        $(".gallery button").on("click", this.openFilters);
    }

    openSide = (showAcceptButton = false, showEditButton = false) => {
        this.$side.addClass("side-out");
        this.$gallery.addClass("gallery-compact");
        $("#new").addClass("invisible");
        if (showAcceptButton) $("#accept").removeClass("invisible");
        if (showEditButton) $("#edit").removeClass("invisible");
        $("#cancel").removeClass("invisible");
    }

    closeSide = () => {
        this.state = "none";
        this.editing = "none";
        this.$side.removeClass("side-out");
        this.$gallery.removeClass("gallery-compact");
        $("#new").removeClass("invisible");
        $("#accept").addClass("invisible");
        $("#cancel").addClass("invisible");
        $("#edit").addClass("invisible");
    }

    openNew = () => {
        this.state = "create";
        this.$side.empty();
    
        let $newForm = this.$createForm.clone();
        this.rating = new Rating($newForm.find(".rating"), 3);

        // build date
        const now = new Date();
        let month = now.getMonth() + 1;
        if (month < 10) month = `0${month}`;
        let date = now.getDate();
        if (date < 10) date = `0${date}`;
        $newForm.find("#date-edit").val(`${now.getFullYear()}-${month}-${date}`);

        this.$side.append($newForm);
    
        this.openSide(true);
    }

    sendNew = async () => {
        try {
            if ($("#product-edit").val()) {
                const res = await $.post("/entry", 
                {
                    author: $("#author-edit").val(),
                    isDraft: false,
                    isPublic: false,
                    product: $("#product-edit").val(),
                    rating: this.rating.rating,
                    content: $("#content-edit").val(),
                    title: $("#title-edit").val(),
                    dateOfExperience: $("#date-edit").val()
                });
    
                if (res === "OK") {
                    console.log("Created new entry.");
                    entryGrid.generateEntries();
    
                    this.closeSide();
                }
                else {
                    $("#create-form-info").text("Error: Unable to post your new entry!");
                }
            }
            else {
                $("#create-form-info").text("Please provide a product name!");
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    updateEntryView = async ($parent) => {
        try {
            const nameRes = await fetch(`/user/name/${entryGrid.entries[this.currentEntry].author}`);
            const nameData = await nameRes.json();
            $("#author-read").text(`Author: ${nameData.name}`);

            $parent.find("#title-read").text(entryGrid.entries[this.currentEntry].title);
            $parent.find("#product-read").text(entryGrid.entries[this.currentEntry].product);
    
            let $rating = $parent.find("#rating-read");
            $rating.empty();
    
            for (let i = 0; i < 5; i++) {
                if (i < entryGrid.entries[this.currentEntry].rating) {
                    $rating.append(`<i class="fas fa-cannabis selected"></i>`);
                }
                else {
                    $rating.append(`<i class="fas fa-cannabis"></i>`);
                }
            }

            $parent.find("#date-read").text(entryGrid.entries[this.currentEntry].dateOfExperience);
    
            $parent.find("#content-read").text(entryGrid.entries[this.currentEntry].content);
            if (entryGrid.entries[this.currentEntry].isPublic) $parent.find("#public-read").text("Anyone Can View this Entry");
            else $parent.find("#public-read").text("Only You Can View this Entry");
        }
        catch(err) {
            console.log(err);
        }
    }
    
    openView = (entryNumber) => {
        if (this.state === "view" && entryNumber === this.currentEntry)
        {
            this.closeSide();
        }
        else {
            this.state = "view";
            this.$side.empty();
    
            this.currentEntry = entryNumber;
    
            let $newView = this.$entryView.clone();
    
            this.updateEntryView($newView);
            $newView.find("#delete-entry").on("click", async () => {
                try {
                    console.log(entryGrid.entries);
                    
                    const res = await $.post(`/entry/${entryGrid.entries[this.currentEntry]._id}?_method=DELETE`);
            
                    if (res === "OK") {
                        console.log("Deleted entry.");
                        entryGrid.generateEntries();
            
                        this.closeSide();
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
        
            this.openSide(false, true);
    
            if (entryGrid.entries[this.currentEntry].author !== entryGrid.user) {
                $("#edit").addClass("invisible");
                $("#delete-entry").addClass("invisible");
            }
        }
    }

    entryEdit = () => {
        if (this.state === "view"){
            this.state = "edit";

            let $line = $(".entry-view").children().eq(0);

            $line.find(".read").addClass("invisible");
            $line.find(".edit").removeClass("invisible");

            $line.find("#title-edit").attr("value", entryGrid.entries[this.currentEntry].title);
            $line.find("#product-edit").attr("value", entryGrid.entries[this.currentEntry].product);
            this.rating = new Rating($line.find("#rating-edit"), entryGrid.entries[this.currentEntry].rating);
            $line.find("#date-edit").attr("value", entryGrid.entries[this.currentEntry].dateOfExperience);
            $line.find("#content-edit").attr("value", entryGrid.entries[this.currentEntry].content);
            if (entryGrid.entries[this.currentEntry].isPublic) $line.find("#public-edit").prop("checked", true);

            $("#new").addClass("invisible");
            $("#accept").removeClass("invisible");
            $("#cancel").removeClass("invisible");
            $("#edit").addClass("invisible");
        }
    }

    saveEdit = async () => {
        try {
            if (this.state === "edit") {
                let $line = $(".entry-view").children().eq(0);

                let entryData = entryGrid.entries[this.currentEntry];
                entryData.title = $line.find("#title-edit").val();
                entryData.product = $line.find("#product-edit").val();
                entryData.rating = this.rating.rating;
                entryData.dateOfExperience = $line.find("#date-edit").val();
                entryData.content = $line.find("#content-edit").val();
                entryData.isPublic = $line.find("#public-edit").prop("checked");
                console.log($line.find("#public-edit").prop("checked"));
                
                const res = await $.post(`/entry/${entryGrid.entries[this.currentEntry]._id}?_method=PUT`, 
                {
                    ...entryData
                });

                if (res === "OK") {
                    console.log("Edited entry.");
                    entryGrid.generateEntries();

                    this.updateEntryView($line);
                    this.cancelEdit();
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

    cancelEdit = () => {
        if (this.state === "edit") {
            this.state = "view";

            let $line = $(".entry-view").children().eq(0);

            $line.find(".read").removeClass("invisible");
            $line.find(".edit").addClass("invisible");

            $("#new").addClass("invisible");
            $("#accept").addClass("invisible");
            $("#cancel").removeClass("invisible");
            $("#edit").removeClass("invisible");
        }
    }

    openFilters = () => {
        this.state = "filters";
        this.$side.empty();

        let $newFilters = this.$filters.clone();

        if (this.filters.showPublic) $newFilters.find("#show-public").prop("checked", true);
        $newFilters.find("#show-public").on("change", () => {
            if ($newFilters.find("#show-public").prop("checked")) this.filters.showPublic = true;
            else this.filters.showPublic = false;
        })

        this.$side.append($newFilters);
    
        this.openSide(true);
    }

    saveFilters = () => {
        entryGrid.generateEntries(this.filters);

        this.closeSide();
    }

    accept = () => {
        if (this.state === "create") this.sendNew();
        else if (this.state === "filters") this.saveFilters();
        else if (this.state === "edit") this.saveEdit();
    }

    cancel = () => {
        if (this.state === "edit") this.cancelEdit();
        else this.closeSide();
    }
}

const app = new App();