$(document).ready(function(){
    //serving forms based on category selection
    $('.category-dropdown').on('change', () => {
        let category = $('.category-dropdown').val()
        
        if (category === 'convocation'){
            $('.category-conv-section').show('fadeIn')
        }
        else if (category === 'wedding'){

        }
        else if (category === 'dinner'){

        }
    })


   
    
})

$('#enddate').blur( function() {
    let startdate = $('#startdate').val()
    let enddate = $('#enddate').val()
    
    let startDateComp = startdate.split(' ')
    let endDateComp = enddate.split(' ')
    
    let stdate = startDateComp[0]
    let eddate = endDateComp[0]
    
    //convert to real date
    let stdateComp = stdate.split('-')
    let eddateComp = eddate.split('-')

    let newstDate = new Date(stdateComp[0], stdateComp[1], stdateComp[2])
    let newedDate = new Date(eddateComp[0], eddateComp[1], eddateComp[2])

    let days_btween = days_between(newstDate, newedDate)
    
    
})

// custion functions
function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return (Math.floor(difference_ms/ONE_DAY) + 1);

}