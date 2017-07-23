function likeUpdate(item_id) {
    var likes = {
        "id_item": item_id,
        "like_status":"like"
    };
    $.ajax({
        type: "POST",
        url: "/mongoDB/like",
        data: likes,
        success: function () {
            console.log('Success AJAX');
        },
        error: function handleError(jqXHR, textStatus, error) {
            console.log(error);
        }
    });
    var ela_like = document.getElementById('liked_'+ item_id);
    ela_like.className = "item_liked";
    ela_like.onclick = null;
    var ela_dislike = document.getElementById('disliked_'+ item_id);
    ela_dislike.className = "like_deactivate";
    ela_dislike.onclick = null;
}
function dislikeUpdate(item_id) {
    var likes = {
        "id_item": item_id,
        "like_status":"dislike"
    };
    $.ajax({
        type: "POST",
        url: "/mongoDB/dislike",
        data: likes,
        success: function () {
            console.log('Success AJAX');
        },
        error: function handleError(jqXHR, textStatus, error) {
            console.log(error);
        }
    });
    var ela_like = document.getElementById('liked_'+ item_id);
    ela_like.className = "like_deactivate";
    ela_like.onclick = null;
    var ela_dislike = document.getElementById('disliked_'+ item_id);
    ela_dislike.className = "item_disliked";
    ela_dislike.onclick = null;
}
