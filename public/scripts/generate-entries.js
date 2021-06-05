const updateMessages = function() {
    $.get(`/entry`, function(data) {
        $(".entry-grid").empty();

        console.log(`Got ${json.entries.length} entries!`);

        for (let i = 0; i < json.entries.length; i++) {
            $(".entry-grid").append($("#entry-card-template").clone());
        };
    });
}

updateMessages();