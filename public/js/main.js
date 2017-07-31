$(document).ready(function(){
    $('.delete-recipe').on('click',function(){
        var id = $(this).data('id');
        var url = 'delete/' + id;
        if(confirm('Вы уверенны?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('RECIPE delete---->');
                    window.location.href = '/';
                },
                error: function(err){
                    console.log(err);
                }
            })
        }
    })
    $('.edit-recipe').on('click', function(){
        $("#edit-form-name").val($(this).data('name'));
        $("#edit-form-ingredients").val($(this).data('ingredients'));
        $("#edit-form-direction").val($(this).data('direction'));
        $("#edit-form-id").val($(this).data('id'));

    })
})
