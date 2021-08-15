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

        $(".foldable-header").on("click", this.toggleFoldable);
    
        this.openSide(true);
    }

    sendNew = async () => {
        try {
            if ($("#product-new").val()) {
                const res = await $.post("/entry", 
                {
                    author: $("#author-new").val(),
                    isDraft: false,
                    isPublic: false,
                    product: $("#product-new").val(),
                    rating: this.rating.rating,
                    content: $("#content-new").val(),
                    title: $("#title-new").val(),
                    dateOfExperience: $("#date-new").val(),
                    timeOfDay: $("#time-of-day-new").val(),
                    productType: $("#type-new").val(),
                    duration: $("#duration-new").val(),
                    quantity: $("#quantity-new").val(),
                    portionSize: $("#portion-new").val(),
                    price: $("#price-new").val(),
                    company: $("#company-new").val(),
                    store: $("#store-new").val(),
                    city: $("#city-new").val(),
                    state: $("#state-new").val(),
                    country: $("#country-new").val(),
                    strainType: $("#strain-type-new").val(),
                    strains: $("#strains-new").val(),
                    thc: $("#thc-new").val(),
                    thca: $("#thca-new").val(),
                    d8thc: $("#d8thc-new").val(),
                    d9thc: $("#d9thc-new").val(),
                    cbd: $("#cbd-new").val(),
                    cbg: $("#cbg-new").val(),
                });
    
                if (res === "OK") {
                    console.log("Created new entry.");
                    entryGrid.generateEntries(this.filters);
    
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

    updateEntryView = ($parent) => {
        $parent.find("#author-read").text(`Author: ${entryGrid.entries[this.currentEntry].author.name}`);

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

        if (entryGrid.entries[this.currentEntry].isPublic) $parent.find("#public-read").text("Yes, Anyone Can View this Entry");
        else $parent.find("#public-read").text("No, Only You Can View this Entry");

        $parent.find("#time-of-day-read").text(entryGrid.entries[this.currentEntry].timeOfDay);

        $parent.find("#type-read").text(entryGrid.entries[this.currentEntry].productType);
        $parent.find("#duration-read").text(entryGrid.entries[this.currentEntry].duration);
        $parent.find("#quantity-read").text(entryGrid.entries[this.currentEntry].quantity);
        $parent.find("#portion-read").text(entryGrid.entries[this.currentEntry].portionSize);
        $parent.find("#price-read").text(entryGrid.entries[this.currentEntry].price);
        $parent.find("#company-read").text(entryGrid.entries[this.currentEntry].company);
        $parent.find("#store-read").text(entryGrid.entries[this.currentEntry].store);
        $parent.find("#city-read").text(entryGrid.entries[this.currentEntry].city);
        $parent.find("#state-read").text(entryGrid.entries[this.currentEntry].state);
        $parent.find("#country-read").text(entryGrid.entries[this.currentEntry].country);
        $parent.find("#strain-type-read").text(entryGrid.entries[this.currentEntry].strainType);
        $parent.find("#strains-read").text(entryGrid.entries[this.currentEntry].strains);
        $parent.find("#thc-read").text(entryGrid.entries[this.currentEntry].thc);
        $parent.find("#thca-read").text(entryGrid.entries[this.currentEntry].thca);
        $parent.find("#d8thc-read").text(entryGrid.entries[this.currentEntry].d8thc);
        $parent.find("#d9thc-read").text(entryGrid.entries[this.currentEntry].d9thc);
        $parent.find("#cbd-read").text(entryGrid.entries[this.currentEntry].cbd);
        $parent.find("#cbg-read").text(entryGrid.entries[this.currentEntry].cbg);
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
                    const res = await $.post(`/entry/${entryGrid.entries[this.currentEntry]._id}?_method=DELETE`);
            
                    if (res === "OK") {
                        console.log("Deleted entry.");
                        entryGrid.generateEntries(this.filters);
            
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

            $(".foldable-header").on("click", this.toggleFoldable);
        
            this.openSide(false, true);
    
            if (entryGrid.entries[this.currentEntry].author._id !== entryGrid.user) {
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
            $line.find("#content-edit").text(entryGrid.entries[this.currentEntry].content);
            if (entryGrid.entries[this.currentEntry].isPublic) $line.find("#public-edit").prop("checked", true);

            $line.find("#time-of-day-edit").attr("value", entryGrid.entries[this.currentEntry].timeOfDay);
            $line.find("#type-edit").attr("value", entryGrid.entries[this.currentEntry].productType);
            $line.find("#duration-edit").attr("value", entryGrid.entries[this.currentEntry].duration);
            $line.find("#quantity-edit").attr("value", entryGrid.entries[this.currentEntry].quantity);
            $line.find("#portion-edit").attr("value", entryGrid.entries[this.currentEntry].portionSize);
            $line.find("#price-edit").attr("value", entryGrid.entries[this.currentEntry].price);
            $line.find("#company-edit").attr("value", entryGrid.entries[this.currentEntry].company);
            $line.find("#store-edit").attr("value", entryGrid.entries[this.currentEntry].store);
            $line.find("#city-edit").attr("value", entryGrid.entries[this.currentEntry].city);
            $line.find("#state-edit").attr("value", entryGrid.entries[this.currentEntry].state);
            $line.find("#country-edit").attr("value", entryGrid.entries[this.currentEntry].country);
            $line.find("#strain-type-edit").attr("value", entryGrid.entries[this.currentEntry].strainType);
            $line.find("#strains-edit").attr("value", entryGrid.entries[this.currentEntry].strains);
            $line.find("#thc-edit").attr("value", entryGrid.entries[this.currentEntry].thc);
            $line.find("#thca-edit").attr("value", entryGrid.entries[this.currentEntry].thca);
            $line.find("#d8thc-edit").attr("value", entryGrid.entries[this.currentEntry].d8thc);
            $line.find("#d9thc-edit").attr("value", entryGrid.entries[this.currentEntry].d9thc);
            $line.find("#cbd-edit").attr("value", entryGrid.entries[this.currentEntry].cbd);
            $line.find("#cbg-edit").attr("value", entryGrid.entries[this.currentEntry].cbg);

            $("#new").addClass("invisible");
            $("#accept").removeClass("invisible");
            $("#cancel").removeClass("invisible");
            $("#edit").addClass("invisible");
        }
    }

    saveEdit = async () => {
        try {
            if (this.state === "edit") {
                if ($("#product-edit").val()) {
                    let $line = $(".entry-view").children().eq(0);

                    let entryData = entryGrid.entries[this.currentEntry];
                    entryData.title = $line.find("#title-edit").val();
                    entryData.product = $line.find("#product-edit").val();
                    entryData.rating = this.rating.rating;
                    entryData.dateOfExperience = $line.find("#date-edit").val();
                    entryData.content = $line.find("#content-edit").val();
                    entryData.isPublic = $line.find("#public-edit").prop("checked");
                    entryData.timeOfDay = $line.find("#time-of-day-edit").val();
                    entryData.productType = $line.find("#type-edit").val();
                    entryData.duration = $line.find("#duration-edit").val();
                    entryData.quantity = $line.find("#quantity-edit").val();
                    entryData.portionSize = $line.find("#portion-edit").val();
                    entryData.price = $line.find("#price-edit").val();
                    entryData.company = $line.find("#company-edit").val();
                    entryData.store = $line.find("#store-edit").val();
                    entryData.city = $line.find("#city-edit").val();
                    entryData.state = $line.find("#state-edit").val();
                    entryData.country = $line.find("#country-edit").val();
                    entryData.strainType = $line.find("#strain-type-edit").val();
                    entryData.strains = $line.find("#strains-edit").val();
                    entryData.thc = $line.find("#thc-edit").val();
                    entryData.thca = $line.find("#thca-edit").val();
                    entryData.d8thc = $line.find("#d8thc-edit").val();
                    entryData.d9thc = $line.find("#d9thc-edit").val();
                    entryData.cbd = $line.find("#cbd-edit").val();
                    entryData.cbg = $line.find("#cbg-edit").val();
                    
                    const res = await $.post(`/entry/${entryGrid.entries[this.currentEntry]._id}?_method=PUT`, 
                    {
                        ...entryData
                    });

                    if (res === "OK") {
                        console.log("Edited entry.");
                        entryGrid.generateEntries(this.filters);

                        this.updateEntryView($line);
                        this.cancelEdit();
                    }
                    else {
                        $("#entry-view-info").text("Error: Unable to edit your entry!");
                    }
                }
                else {
                    $("#entry-view-info").text("Please provide a product name!");
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

            $("#entry-view-info").text("");

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

    toggleFoldable = (event) => {
        $(event.delegateTarget).next().toggleClass("closed");
        $(event.delegateTarget).children().eq(0).toggleClass("rotate");
    }
}

const app = new App();