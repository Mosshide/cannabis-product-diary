const generateEntries = function() {
    $(".entry-grid").empty();
    console.log("Updating entries grid.");

    $.get(`/entry`, function(res) {
        console.log(`Got ${res.entries.length} entries!`);

        for (let i = 0; i < res.entries.length; i++) {
            let $newEntry = $("#entry-card-template").clone();
            $(".entry-grid").append($newEntry);
            $newEntry.toggleClass("invisible");
            console.log($newEntry);
        };
    });
}