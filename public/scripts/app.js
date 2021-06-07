// Floating Buttons
$("#new").on("click", function() {
    $(".side").toggleClass("side-out");
    $(".gallery").toggleClass("gallery-compact");
    $("#new").css("display", "none");
    $("#accept").css("display", "initial");
    $("#cancel").css("display", "initial");
});

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
                generateEntries();
    
                $(".side").toggleClass("side-out");
                $(".gallery").toggleClass("gallery-compact");
                $("#new").css("display", "initial");
                $("#accept").css("display", "none");
                $("#cancel").css("display", "none");
            }
            else {
                $("#create-form-info").text("Error: Unable to post your new entry!");
            }
    }
    catch(err) {
        console.log(err);
    }
});

$("#cancel").on("click", function() {
    $(".side").toggleClass("side-out");
    $(".gallery").toggleClass("gallery-compact");
    $("#new").css("display", "initial");
    $("#accept").css("display", "none");
    $("#cancel").css("display", "none");
});

generateEntries();