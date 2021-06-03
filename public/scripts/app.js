// Floating Buttons
$("#new").on("click", function() {
    $(".side").toggleClass("side-out");
    $(".gallery").toggleClass("gallery-compact");
    $("#new").css("display", "none");
    $("#accept").css("display", "initial");
    $("#cancel").css("display", "initial");
});

$("#accept").on("click", function() {
    $(".side").toggleClass("side-out");
    $(".gallery").toggleClass("gallery-compact");
    $("#new").css("display", "initial");
    $("#accept").css("display", "none");
    $("#cancel").css("display", "none");
});

$("#cancel").on("click", function() {
    $(".side").toggleClass("side-out");
    $(".gallery").toggleClass("gallery-compact");
    $("#new").css("display", "initial");
    $("#accept").css("display", "none");
    $("#cancel").css("display", "none");
});