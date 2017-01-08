
function getAndRenderPumpkins() {
  if (event) event.preventDefault();
  return $.ajax({
    method: "GET",
    url: "https://pumpkr.herokuapp.com/pumpkins"
  })
  .done(onSuccess)
  .fail(onError);
}

function postPumpkin() {
  if (event) event.preventDefault();

  var pumpkin = pumpkinCarver.exportComplete();
  pumpkin.title = $('#pumpkinTitle').val();

  return $.ajax({
    method: "POST",
    url: "https://pumpkr.herokuapp.com/pumpkins",
    data: pumpkin
  }).done(function () {
    window.location = '/';
  });
}

function deletePumpkin(id) {
  return $.ajax({
    method: "DELETE",
    url: "https://pumpkr.herokuapp.com/pumpkins/" + id
  }).done(function () {
    return function() {
      $('#' + id).slideUp();
    }(id);
  });

}

function onSuccess(json) {
  let $container = $("#main");

  json.forEach((pumpkin,i) => {
    $container.append(`<div class="pumpkin" id="${pumpkin._id}"><img src="${pumpkin.previewSrc}"><h3>${pumpkin.title}</h3><a href="#" class="delete">Delete</a></div>`);
  });

  $('a.delete').click(function() {
    deletePumpkin($(this).parent().attr('id'));
    return false;
  });
}

function onError(xhr, status, errorThrown) {
  alert("Sorry, there was a problem!");
  console.log("Error: " + errorThrown);
  console.log("Status: " + status);
  console.dir(xhr);
}
