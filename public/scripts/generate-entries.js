const generateEntries = function() {
    $(".entry-grid").empty();
    console.log("Updating entries grid.");

    $.get(`/entry`, function(res) {
        console.log(res.entries);

        for (let i = 0; i < res.entries.length; i++) {
            let date = new Date(res.entries[i].createdAt);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();

            let $newEntry = $("#entry-card-template").clone();
            $newEntry.children().eq(0).text(`${month}/${day}/${year}`);
            $newEntry.children().eq(1).text(res.entries[i].product);
            $newEntry.children().eq(2).text(res.entries[i].content);
            $newEntry.toggleClass("invisible");
            $(".entry-grid").append($newEntry);
        };
    });
}