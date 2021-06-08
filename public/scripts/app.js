const openNew = function openNew() {
    $(".side").empty();

    $(".side").append($("#create-form-template").removeClass("invisible").clone());

    $(".side").addClass("side-out");
    $(".gallery").addClass("gallery-compact");
    $("#new").css("display", "none");
    $("#accept").css("display", "initial");
    $("#cancel").css("display", "initial");
}

const openView = function openView(postNumber) {
    $(".side").empty();

    let $newView = $("#entry-view-template").clone();
    $newView.removeClass("invisible");
    $newView.children().eq(0).text(`${entryGrid.entries[postNumber].product}`);
    $newView.children().eq(2).text(`${entryGrid.entries[postNumber].content}`);
    $(".side").append($newView);

    $(".side").addClass("side-out");
    $(".gallery").addClass("gallery-compact");
    $("#new").css("display", "none");
    $("#cancel").css("display", "initial");
}

const close = function close() {
    $(".side").removeClass("side-out");
    $(".gallery").removeClass("gallery-compact");
    $("#new").css("display", "initial");
    $("#accept").css("display", "none");
    $("#cancel").css("display", "none");
}

// Floating Buttons
$("#new").on("click", openNew);

$("#accept").on("click", async function() {
    try {
        console.log("Creating new entry.");
        
        const res = await $.post("/entry", 
        {
            author: $("#author").val(),
            isDraft: false,
            isPublic: false,
            product: $("#product").val(),
            rating: $("#rating").val(),
            content: $("#content").val()
        });

        console.log(res);
            if (res === "OK") {
                console.log("Created new entry.");
                entryGrid.generateEntries();
    
                close();
            }
            else {
                $("#create-form-info").text("Error: Unable to post your new entry!");
            }
    }
    catch(err) {
        console.log(err);
    }
});

$("#cancel").on("click", close);