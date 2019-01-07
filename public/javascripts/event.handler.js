$(document).ready(function(){

    let errorList = [];

    //==========serving forms based on category selection=========================
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

    //=====Auto generating Day Handler===========================================

    //todo ===> validation -> making sure date are in correct format

    let amountOfDay = 0
    let eventDayLabel = [] //holds the label of day created

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

        amountOfDay = days_between(newstDate, newedDate)
        
        //fill days div
        $('.day-allocation-section').empty();
        for (let index = 0; index < amountOfDay; index++) {

            let dayDiv = '<div class="row day mt-3" id="day-'+(index+1)+'" style="width: 100%;">'
            dayDiv += '<div class="col-9" style="text-align:left;">'
            dayDiv += '<p class="lead"><a class="day-link" day-data="day_'+(index+1)+'" style="color:#007BFF;cursor:pointer;font-size:17px;text-decoration: none;border-bottom: 1px solid #ccc;"><i class="fas fa-plus"></i> Add Faculty</a> for Day '+(index + 1)+'</p>'
            dayDiv += '</div></div>';

            
            eventDayLabel.push("day_"+(index+1))

            $('.day-allocation-section').append(dayDiv)
        }
        // console.log(eventDayLabel)
    })

    let totalFaculty = 0
    let facultyContainerNum = 0
    let eventDay = {} //holds the amount of faculty for each day as an object
    let facultyContainerNums = []

    //===========add faculty handler=============================================================================================================================================

    $(document).on('click', '.day-link', function() {
        let link = $(this)
        let linkAttr = link.attr('day-data')
        let linkId = '#'+link.attr('day-data')

        totalFaculty = totalFaculty + 1

        //add day and added faculty value to eventDay object
        if(eventDay[linkAttr] === undefined){
            //day has no faculty
            eventDay[linkAttr] = 1
        }else{
            //day has existing faculty
            initialFacAmount = eventDay[linkAttr]
            eventDay[linkAttr] = initialFacAmount + 1
        }
        //populating facultyContainerNums
        facultyContainerNum = facultyContainerNum + 1
        facultyContainerNums.push(facultyContainerNum)

        console.log(eventDayLabel)

        let facultyConatiner = '<div fac-day-data="'+linkAttr+'" fac-container-num="'+facultyContainerNum+'" class="row ml-2 mb-2 faculty-input">'
        facultyConatiner += '<div class="col-5"><label for="event">Faculty Name *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control" id="fac-name-'+facultyContainerNum+'" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-poll-h"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Your username is required.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-3"><label for="event">Total Student Capacity *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control" id="std-capcity-'+facultyContainerNum+'" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-user-graduate"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Your username is required.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-3"><label for="event">Total Visitor Capacity *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control" id="vis-capacity-'+facultyContainerNum+'" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-users"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Your username is required.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-1" style="color: red;padding-top: 40px;"><i class="fas fa-trash-alt" id="trash-container" style="cursor:pointer"></i></div>'
        facultyConatiner += '</div>'

        // console.log("'"+linkId+"'")
        $(linkId).append(facultyConatiner);
        // console.log(totalFaculty)
    })

    //=======trash faculty functionality===================================
    $(document).on('click', '#trash-container', function(){
        
        //removing fac-container-num from store
        let facContNum = $(this).parent().parent().attr("fac-container-num")
        let idx = facultyContainerNums.indexOf(parseInt(facContNum))
        facultyContainerNums.splice(idx, 1)
        console.log(facultyContainerNums)

        totalFaculty = totalFaculty - 1

        //deduct from object in eventDay
        let containerId = $(this).parent().parent().attr("fac-day-data")
        let initialFacAmount = eventDay[containerId]
        eventDay[containerId] = initialFacAmount - 1
        console.log(eventDay)
        $(this).parent().parent().remove();
    })

    
    //=======event visibility setting================================
    let isVisible = false
    $('input[name="customRadioInline1"]').change(function(){
        isVisible = $('input[name=customRadioInline1]:checked').val()
        console.log(isVisible)
    })

    
    //=======Submission Process======================================

    //Overall Payload Stack Structure
    // event = [
    //     allocation = [
    //         day_1 = [
    //             day_11 = ["faculty of science", 1250, 1000],
    //             day_12 = ["faculty of agric", 1050, 800],
    //         ],
    //         day_2 = [
    //             day_21 = ["faculty of technology", 1150, 850]
    //         ],
    //         day_3 = [
    //             day_31 = ["faculty of education", 2550, 1500]
    //         ]
    //     ],
    //     "UI Convocation Ceremony",
    //     "UI Conference Centre",
    //     "/image/poster.png",
    //     "Covocation ceremony"
    // ]


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