$(function(){
    //while(true){
        $(".write").typed({
        strings: ["Spend your time on the things you love!", "Tvent can take on the rest for you.", 
        "Have you wished for a smooth event ?", "Try Tvent today."],
        typeSpeed: 100,
        backSpeed: 6,
        loop: true
    });
    //}
    
})

$(function () {
    $('#datetimepicker1').datetimepicker({
        icons: {
            time: "far fa-clock"
        }
    });
});

$(function () {
    $('#datetimepicker2').datetimepicker({
        icons: {
            time: "far fa-clock"
        }
    });
});

// 2019-01-13 09:00am