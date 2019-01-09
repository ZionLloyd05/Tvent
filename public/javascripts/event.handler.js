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
    lg(errorList)
    $('.dayGenerate').click( function() {
        let evTitle = $('#event').val()
        let evLoc = $('#loc').val()
        let evDesc = $('.description').val()
        let startdate = $('#startdate').val()
        let enddate = $('#enddate').val()

        //pushing error meesage for empty input
        let errorMsg = "Either of event title, location, description, dates cannot be empty"
        if(evTitle == "" || evLoc == "" || evDesc == "" || startdate == "" || enddate == ""){
            if(!errorList.includes(errorMsg)){
                errorList.push(errorMsg)
                lg("1")
            }
        }else{
            if(errorList.includes(errorMsg)){
                let errIdx = errorList.indexOf(errorMsg)
                errorList.splice(errIdx, 1)
                lg("2")
            }
        }

        //  
        
        // console.log(errorList)
        // if(errorList.length > 0 && errorList[0] != ""){
        if(errorList.length > 0){
            lg("3")
            let errDiv = $('.errorlist2')
            errDiv.empty()
            let error = ""
            errDiv.append('<h6>Error List</h6>')
            for (let idx = 0; idx < errorList.length; idx++) {
                error = errorList[idx];
                errDiv.append('<p style="display:block" class="invalid-feedback">. '+error+'</p>')
            }
            errDiv.show('fadeIn')
        }
        else {
            lg("4")
            // console.log("other side")
            //...validate day
            //...validate that start date is less or equal to end date
            
            //===Process to get date=====
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

                let dayDiv = '<div class="row day mt-3" id="day_'+(index+1)+'" style="width: 100%;">'
                dayDiv += '<div class="col-9" style="text-align:left;">'
                dayDiv += '<p class="lead"><a class="day-link" day='+(index+1)+' day-data="day_'+(index+1)+'" style="color:#007BFF;cursor:pointer;font-size:17px;text-decoration: none;border-bottom: 1px solid #ccc;"><i class="fas fa-plus"></i> Add Faculty</a> for Day '+(index + 1)+'</p>'
                dayDiv += '</div></div>';

                
                eventDayLabel.push("day_"+(index+1))

                $('.day-allocation-section').append(dayDiv)
            }
        }
        //  
    })

    let totalFaculty = 0
    let facultyContainerNum = 0
    let eventDay = {} //holds the amount of faculty for each day as an object
    let facultyContainerNums = []

    //===========add faculty handler=============================================================================================================================================

    $(document).on('click', '.day-link', function() {
        // console.log("hererer")
        let link = $(this)
        let linkAttr = link.attr('day-data')
        let linkId = '#'+link.attr('day-data')
        let dayNum = link.attr('day')
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

        let facultyConatiner = '<div fac-day-data="'+linkAttr+'" fac-container-num="'+facultyContainerNum+'" class="row ml-2 mb-2 faculty-input">'
        facultyConatiner += '<div class="col-5"><label for="event">Faculty Name *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control fac-name" id="fac-name-'+facultyContainerNum+'" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-poll-h"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Faculty '+(facultyContainerNum)+' name for day '+(dayNum)+' cannot be empty.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-3"><label for="event">Total Student Capacity *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control std-cap" id="std-capcity-'+facultyContainerNum+'" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-user-graduate"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Total student capacity '+(facultyContainerNum)+' cannot cannot be empty.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-3"><label for="event">Total Visitor Capacity *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control vis-cap" id="vis-capacity-'+facultyContainerNum+'" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-users"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Total visitor capacity '+(facultyContainerNum)+' cannot cannot be empty.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-1" style="color: red;padding-top: 40px;"><i class="fas fa-trash-alt" facblock-data="'+(facultyContainerNum)+'" id="trash-container" style="cursor:pointer"></i></div>'
        facultyConatiner += '</div>'

        // console.log(facultyConatiner)
        $(linkId).append(facultyConatiner);
        //  
    })

    // =========Validating generated inputs====================== => For Convocation Category
    $(document).on('focusout', '.fac-name', function(){
        // lg("in hrere")
        let value = $(this).val()
        let errorBlock = $(this).parent().parent().find('.invalid-feedback');
        let errorMsg = errorBlock.html().trim()
        if(value == ''){
            errorBlock.show()
            if(!errorList.includes(errorMsg)){
                errorList.push(errorMsg)
            }
        }else{
            if(errorList.includes(errorMsg)){
                let errIdx = errorList.indexOf(errorMsg)
                errorList.splice(errIdx, 1)
            }
        }
        lg(errorList)
    })

    $(document).on('focusout', '.std-cap', function(){
        let value = $(this).val()
        let errorBlock = $(this).parent().parent().find('.invalid-feedback');
        let errorMsg = errorBlock.html().trim()
        if(value == ''){
            errorBlock.show()
            if(!errorList.includes(errorMsg)){
                errorList.push(errorMsg)
            }
        }else{
            if(errorList.includes(errorMsg)){
                let errIdx = errorList.indexOf(errorMsg)
                errorList.splice(errIdx, 1)
            }
        }
        console.log(errorList)
    })

    $(document).on('focusout', '.vis-cap', function(){
        let value = $(this).val()
        let errorBlock = $(this).parent().parent().find('.invalid-feedback');
        let errorMsg = errorBlock.html().trim()
        if(value == ''){
            errorBlock.show()
            if(!errorList.includes(errorMsg)){
                errorList.push(errorMsg)
            }
        }else{
            if(errorList.includes(errorMsg)){
                let errIdx = errorList.indexOf(errorMsg)
                errorList.splice(errIdx, 1)
            }
        }
        console.log(errorList)
    })

    //=======trash faculty functionality===================================
    $(document).on('click', '#trash-container', function(){
        let facContNum = $(this).parent().parent().attr("fac-container-num")
        let idx = facultyContainerNums.indexOf(parseInt(facContNum))
        let facBlockNum = $(this).attr('facblock-data')

        errorList = errorList.filter(error => {
            return !error.includes(facBlockNum)
        })
        
        //removing fac-container-num from store
        facultyContainerNums.splice(idx, 1)
        //  

        totalFaculty = totalFaculty - 1

        //deduct from object in eventDay
        let containerId = $(this).parent().parent().attr("fac-day-data")
        let initialFacAmount = eventDay[containerId]
        eventDay[containerId] = initialFacAmount - 1
        //  
        $(this).parent().parent().remove();
        
        lg(errorList)
    })

    
    //=======event visibility setting================================
    let isVisible = false
    $('input[name="customRadioInline1"]').change(function(){
        isVisible = $('input[name=customRadioInline1]:checked').val()
    })

    //========Validation Handling==================================
    $('input[type="text"]').focusout(function(){
        let value = $(this).val()
        let inputType = $(this).attr("id")
        let errorMsg =  ""
        //setting global errorMsg
        if(inputType === "startdate"){
            errorMsg = "Incorrect date pattern for start date, kindly follow this pattern YYYY-MM-DD"
        }else if(inputType === "enddate"){
            errorMsg = "Incorrect date pattern for end date, kindly follow this pattern YYYY-MM-DD"
        }
        let errorBlock = $(this).parent().parent().find('.invalid-feedback');
        let errorText = errorBlock.html().trim()
        if(value == "" && !errorList.includes(errorText)){
             //check if match error exist
            
            if(errorList.includes(errorMsg)){
                 
                let errIdx = errorList.indexOf(errorMsg)
                errorList.splice(errIdx, 1)
            }
            errorBlock.show()
            errorList.push(errorText)
        }else{
            if(errorList.includes(errorText) && value != ""){
                let errIdx = errorList.indexOf(errorText)
                errorList.splice(errIdx, 1)
                errorBlock.hide()               
            }
            if(value && (inputType === "startdate" || inputType === "enddate")){
               
                const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})\s(?<hour>\d{2}):(?<minute>\d{2})/

                if(re.test(value)){
                     
                    //check if match error exist
                    
                    if(errorList.includes(errorMsg)){
                        let errIdx = errorList.indexOf(errorMsg)
                        errorList.splice(errIdx, 1)
                    }

                    const date_result = re.exec(value)

                    //...validate month -- 01 = 12
                    let startdate_month = date_result.groups.month
                    var monthErrorMsg = "Incorrect month, kindly follow this pattern YYYY-MM-DD"

                    if((startdate_month > 12 || startdate_month < 00 )){
                        errorBlock.append('<p>Incorrect month, kindly follow this pattern YYYY-MM-DD</p>')
                        if(!errorList.includes(monthErrorMsg)){
                            errorList.push(monthErrorMsg)
                        }
                    }else{
                        if(errorList.includes(monthErrorMsg)){
                            let errIdx = errorList.indexOf(monthErrorMsg)
                            errorList.splice(errIdx, 1)
                        }
                    }
                }else{
                    //errorBlock.empty()
                    if(!errorList.includes(errorMsg)){
                        errorList.push(errorMsg)
                    }
                
                }
            }
        }
    
    })
        //validating textarea
    $('.description').focusout(function(){
        let value = $(this).val()
        let errorBlock = $(this).parent().parent().find('.invalid-feedback');
        let errorText = errorBlock.html().trim()
        if(value == "" && !errorList.includes(errorText)){
            errorBlock.show()
            errorList.push(errorText)
        }else{
            if(errorList.includes(errorText) && value != ""){
                let errIdx = errorList.indexOf(errorText)
                errorList.splice(errIdx, 1)
                errorBlock.hide()
            }
        }
         
    })

    //=======Wrapping event up = Clicking additional Settings=======
    $('#v-pills-additional-tab').click(function(){

        let evTitle = $('#event').val()
        let evLoc = $('#loc').val()
        let evDesc = $('.description').val()
        let startdate = $('#startdate').val()
        let enddate = $('#enddate').val()

          //pushing error meesage for empty input
          let errorMsg = "Either of event title, location, description, dates cannot be empty"
          if(evTitle == "" || evLoc == "" || evDesc == "" || startdate == "" || enddate == ""){
              if(!errorList.includes(errorMsg)){
                  errorList.push(errorMsg)
              }
          }else{
              if(errorList.includes(errorMsg)){
                  let errIdx = errorList.indexOf(errorMsg)
                  errorList.splice(errIdx, 1)
              }
          }


        //  
        let errDiv = $('.errorlist3')
        if(errorList.length > 0){
            errDiv.empty()
            let error = ""
            errDiv.append('<h6>Error List</h6>')
            for (let idx = 0; idx < errorList.length; idx++) {
                error = errorList[idx];
                errDiv.append('<p style="display:block" class="invalid-feedback">. '+error+'</p>')
            }
            errDiv.show('fadeIn')
        }else{
            errDiv.append('<p class="display-4" style="font-size:30px;">Great! Go ahead and publish your event..</p>')
            $('#btnPublish').removeAttr("disabled")
        }
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

function lg(message){
    console.log(message)
}