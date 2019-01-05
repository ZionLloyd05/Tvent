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

    //todo ===> validation -> making sure date are in correct format

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
        
        //fill days div
        $('.day-allocation-section').empty();
        for (let index = 0; index < days_btween; index++) {
            
            let dayDiv = '<div class="row day mt-3" id="day-'+(index+1)+'" style="width: 100%;">'
            dayDiv += '<div class="col-9" style="text-align:left;">'
            dayDiv += '<p class="lead"><a class="day-link" day-data="day-'+(index+1)+'" style="color:#007BFF;cursor:pointer;font-size:17px;text-decoration: none;border-bottom: 1px solid #ccc;"><i class="fas fa-plus"></i> Add Faculty</a> for Day '+(index + 1)+'</p>'
            dayDiv += '</div></div>';

            $('.day-allocation-section').append(dayDiv)
        }
    })


    //add faculty handler
    $(document).on('click', '.day-link', function() {
        let link = $(this)
        let linkId = '#'+link.attr('day-data')
        
        let facultyConatiner = '<div class="row ml-2 faculty-input">'
        facultyConatiner += '<div class="col-5"><label for="event">Faculty Name *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control" id="event" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-poll-h"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Your username is required.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-3"><label for="event">Total Student Capacity *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control" id="event" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-user-graduate"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Your username is required.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-3"><label for="event">Total Visitor Capacity *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control" id="event" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-users"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Your username is required.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-1" style="color: red;padding-top: 40px;"><i class="fas fa-trash-alt" style="cursor:pointer"></i></div>'
        facultyConatiner += '</div>'

        // console.log("'"+linkId+"'")
        $(linkId).append(facultyConatiner);
    })

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