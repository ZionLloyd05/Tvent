
$(document).ready(function(){
      
    let errorList = []
    let totalFaculty = 0
    let facultyContainerNum = 0
    let eventDay = {} //holds the amount of faculty for each day as an object
    let facultyContainerNums = []


    //==========serving forms based on category selection=========================
    $('.category-dropdown').on('change', () => {
        let category = $('.category-dropdown').val()
        let catInp = document.getElementById('category')
        catInp.value = category

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
    // lg(errorList)
    $('.dayGenerate').click( function() {
        eventDay = {}
        facultyContainerNums = []
        totalFaculty = 0
        facultyContainerNum = 0

        var sectionAllocation = document.getElementById('allocation-section')
        while(sectionAllocation.firstChild)
            sectionAllocation.removeChild(sectionAllocation.firstChild)
        
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
                // lg("1")
            }
        }else{
            if(errorList.includes(errorMsg)){
                let errIdx = errorList.indexOf(errorMsg)
                errorList.splice(errIdx, 1)
                // lg("2")
            }
        }

        //removing dates error message having not checked yet
        let errorMsgForDates = "End date cannot be less than start date."
        if(errorList.includes(errorMsgForDates)){
            let errIdx = errorList.indexOf(errorMsg)
            errorList.splice(errIdx, 1)
        }
        //and remove it from the DOM
        let errorList2 = document.getElementById('errList2')
        while(errorList2.firstChild)
            errorList2.removeChild(errorList2.firstChild)

        // if(errorList.length > 0 && errorList[0] != ""){
        if(errorList.length > 0){
            
            let errDiv = $('.errorlist2')
            errDiv.empty()
            let error = ""
            errDiv.append('<h6>Error List</h6>')
            for (let idx = 0; idx < errorList.length; idx++) {
                error = errorList[idx]
                errDiv.append('<p style="display:block" class="invalid-feedback">. '+error+'</p>')
            }
            errDiv.show('fadeIn')
        }
        else {
            // lg("4")
            // console.log("other side")
            //...validate day
            //...validate that start date is less or equal to end date
            
            //===Process to get date=====
            let startDateComp = startdate.split(' ')
            let endDateComp = enddate.split(' ')
            
            let stdate = startDateComp[0]
            let eddate = endDateComp[0]

            let sttime = startDateComp[1]
            let edtime = endDateComp[1]

            //assign date and time info to their input field
            document.getElementById('start').value = stdate
            document.getElementById('end').value = eddate
            document.getElementById('starttime').value = sttime
            document.getElementById('endtime').value = edtime
            
            //convert to real date
            let stdateComp = stdate.split('-')
            let eddateComp = eddate.split('-')

            let newstDate = new Date(stdateComp[0], stdateComp[1], stdateComp[2])
            let newedDate = new Date(eddateComp[0], eddateComp[1], eddateComp[2])

            if( newstDate > newedDate){
                let errorMsg = "End date cannot be less than start date."
                if(!errorList.includes(errorMsg)){
                    errorList.push(errorMsg)
                }
            }  

            if(newstDate < Date.now()){
                let errorMsg = "Start date cannot be less than today."
                if(!errorList.includes(errorMsg)){
                    errorList.push(errorMsg)
                }
            }
            
            amountOfDay = days_between(newstDate, newedDate)
            
            //fill days div only if error list is empty
            if(errorList.length > 0){
                let errDiv = $('.errorlist2')
                errDiv.empty()
                let error = ""
                errDiv.append('<h6>Error List</h6>')
                for (let idx = 0; idx < errorList.length; idx++) {
                    error = errorList[idx]
                    errDiv.append('<p style="display:block" class="invalid-feedback">. '+error+'</p>')
                }
                errDiv.show('fadeIn')
            }else{
                $('.day-allocation-section').empty()
                for (let index = 0; index < amountOfDay; index++) {

                    let dayDiv = '<div class="row day mt-3" id="day_'+(index+1)+'" style="width: 100%;">'
                    dayDiv += '<div class="col-9" style="text-align:left;">'
                    dayDiv += '<p class="lead"><a class="day-link" day='+(index+1)+' day-data="day_'+(index+1)+'" style="color:#007BFF;cursor:pointer;font-size:17px;text-decoration: none;border-bottom: 1px solid #ccc;"><i class="fas fa-plus"></i> Add Faculty</a> for Day '+(index + 1)+'</p>'
                    dayDiv += '</div></div>'

                    
                    eventDayLabel.push("day_"+(index+1))

                    $('.day-allocation-section').append(dayDiv)
                }
            }
        }
        //  
    })

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
        facultyConatiner += '<div class="input-group"><input type="text" day-what="'+linkAttr+'" class="form-control fac-name" num-data="'+facultyContainerNum+'" id="fac-name-'+facultyContainerNum+'" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-poll-h"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Faculty '+(facultyContainerNum)+' name for day '+(dayNum)+' cannot be empty.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-3"><label for="event">Total Student Capacity *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control std-cap" num-data="'+facultyContainerNum+'" id="std-capacity-'+facultyContainerNum+'" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-user-graduate"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Total student capacity '+(facultyContainerNum)+' cannot cannot be empty.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-3"><label for="event">Total Visitor Capacity *</label>'
        facultyConatiner += '<div class="input-group"><input type="text" class="form-control vis-cap" num-data="'+facultyContainerNum+'" id="vis-capacity-'+facultyContainerNum+'" placeholder="" value="" required="">'
        facultyConatiner += '<div class="input-group-append"><div class="input-group-text"><i class="fas fa-users"></i></div></div>'
        facultyConatiner += '<div class="invalid-feedback" style="width: 100%;">Total visitor capacity '+(facultyContainerNum)+' cannot cannot be empty.</div>'
        facultyConatiner += '</div></div>'
        facultyConatiner += '<div class="col-1" style="color: red;padding-top: 40px;"><i class="fas fa-trash-alt" facblock-data="'+(facultyContainerNum)+'" id="trash-container" style="cursor:pointer"></i></div>'
        facultyConatiner += '</div>'

        // console.log(facultyConatiner)
        $(linkId).append(facultyConatiner)
        console.log(eventDay)
        console.log(facultyContainerNums)
        //  
    })

    // =========Validating generated inputs====================== => For Convocation Category
    $(document).on('focusout', '.fac-name', function(){
        // lg("in hrere")
        let value = $(this).val()
        let errorBlock = $(this).parent().parent().find('.invalid-feedback')
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
                errorBlock.hide()
            }
        }
        // lg(errorList)
    })

    $(document).on('focusout', '.std-cap', function(){
        let value = $(this).val()
        let errorBlock = $(this).parent().parent().find('.invalid-feedback')
        let errorMsg = errorBlock.html().trim()
        let numData =  $(this).attr('num-data')
        if(value == ''){
            //check if num error is in array, then remove if //true
            let errorTxt = "Number is require for student capacity "+ numData
            if(errorList.includes(errorTxt)){
                let errIdx = errorList.indexOf(errorTxt)
                errorList.splice(errIdx, 1)
            }
            errorBlock.show()
            if(!errorList.includes(errorMsg)){
                errorList.push(errorMsg)
            }
        }else{
            if(errorList.includes(errorMsg)){
                let errIdx = errorList.indexOf(errorMsg)
                errorList.splice(errIdx, 1)
                errorBlock.hide()
            }
            let errorTxt = "Number is require for student capacity "+ numData
            if(isNaN(value)){
                if(!errorList.includes(errorTxt)){
                    errorList.push(errorTxt)
                }
            }else{
                if(errorList.includes(errorTxt)){
                    let errIdx = errorList.indexOf(errorTxt)
                    errorList.splice(errIdx, 1)
                }
            }
        }
        // console.log(errorList)
    })

    $(document).on('focusout', '.vis-cap', function(){
        let value = $(this).val()
        let errorBlock = $(this).parent().parent().find('.invalid-feedback')
        let errorMsg = errorBlock.html().trim()
        let numData =  $(this).attr('num-data')
        if(value == ''){
            //check if num error is in array, then remove if //true
            let errorTxt = "Number is require for visitor capacity "+ numData
            if(errorList.includes(errorTxt)){
                let errIdx = errorList.indexOf(errorTxt)
                errorList.splice(errIdx, 1)
            }
            //empty error message
            errorBlock.show()
            if(!errorList.includes(errorMsg)){
                errorList.push(errorMsg)
            }
        }else{
            if(errorList.includes(errorMsg)){
                let errIdx = errorList.indexOf(errorMsg)
                errorList.splice(errIdx, 1)
                errorBlock.hide()
            }
            let errorTxt = "Number is require for visitor capacity "+ numData
            let otherErrorBlock = $('.otherErrorlist')
            if(isNaN(value)){
                if(!errorList.includes(errorTxt)){
                    errorList.push(errorTxt)
                }
            }else{
                if(errorList.includes(errorTxt)){
                    let errIdx = errorList.indexOf(errorTxt)
                    errorList.splice(errIdx, 1)
                }
            }
        }
        // console.log(errorList)
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
        $(this).parent().parent().remove()
        
        console.log(eventDay)
        console.log(facultyContainerNums)
    })
    
    //=======event visibility setting================================
    $('input[name="customRadioInline1"]').change(function(){
        let elStatus = document.getElementById('evstatus')
        elStatus.value = $('input[name=customRadioInline1]:checked').val()
    })

    //========Validation Handling==================================
    $('input[type="text"]').focusout(function(){
        let value = $(this).val()
        let inputType = $(this).attr("id")
        if(inputType != 'tag'){
            let errorMsg =  ""
            //setting global errorMsg
            if(inputType === "startdate"){
                errorMsg = "Incorrect date pattern for start date, kindly follow this pattern YYYY-MM-DD HH:SS"
            }else if(inputType === "enddate"){
                errorMsg = "Incorrect date pattern for end date, kindly follow this pattern YYYY-MM-DD HH:SS"
            }
            let errorBlock = $(this).parent().parent().find('.invalid-feedback')
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
                
                    const re = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})\s(?<hour>\d{2}):(?<minute>\d{2})$/

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
        }
    
    })
        //validating textarea
    $('.description').focusout(function(){
        let value = $(this).val()
        let errorBlock = $(this).parent().parent().find('.invalid-feedback')
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
        let errDiv = $('#errlist3')
        if(errorList.length > 0){
            errDiv.empty()
            let error = ""
            errDiv.append('<h6>Error List</h6>')
            for (let idx = 0; idx < errorList.length; idx++) {
                error = errorList[idx]
                errDiv.append('<p style="display:block" class="invalid-feedback">. '+error+'</p>')
            }
            errDiv.show('fadeIn')
        }else{
                if(!$('.greatMessage')){
                    errDiv.append('<p class="display-4 greatMessage" style="font-size:30px;">Great! Go ahead and publish your event..</p>')
                }
         
            // $('#btnPublish').removeAttr("disabled")
        }
    })
    

// ====================== VANILLA JAVASCRIPT ==================================
 //new process
    // Create event first(event)
        // .then(create allocations, event._id)
        // .then(create tags, event._id)

//variable declarations
let eventTitle = document.getElementById('event')
let publishBtn = document.getElementById('btnPublish')
let tagInput = document.getElementById('tag')
let tagList = document.getElementById('taglist')

//event bindings
if(eventTitle)
    eventTitle.addEventListener('keyup', twoWayBinding)
if(publishBtn)
    publishBtn.addEventListener('click', createEvent)
if(tagInput)
    tagInput.addEventListener('keydown', addTag)



//event functions
function twoWayBinding(e) {
    let title = e.target.value
    let displayEventElement = document.getElementById('eventDisplay')

    if(title === ''){
        displayEventElement.textContent = "New Event"
    }else{
        displayEventElement.textContent = title
    }
    

}
async function createEvent() {

    if(errorList.length ==  0){

        clearInterval(intervalId)

        publishBtn.textContent = ''
        let spin = document.createElement('i')
        spin.className = 'fas fa-spinner fa-spin'
        
        let txt = document.createTextNode(' Publishing your event...')
        publishBtn.append(spin)
        publishBtn.append(txt)
        publishBtn.disabled = true
            
        let eventForm = document.getElementById('eventForm')
        formData = new FormData(eventForm)
        try {
           
            //saving event
            const response_event = await fetch('/events/create', {method: 'Post', body: formData})
            const newEvent = await response_event.json()
            console.log(newEvent)

            if(newEvent.error){
                toastr.options.timeOut = 0
                toastr.options.extendedTimeOut = 0
                toastr.options.positionClass = "toast-bottom-right"
                toastr.info(newEvent.error)
            }else{

                allocation = []
                let containerNum = 0
                Object.keys(eventDay).map(key => {
                    
                    for (let x = 0; x < eventDay[key]; x++) {
                        fac_input_id = "fac-name-"+facultyContainerNums[containerNum]
                        std_capacity_id = "std-capacity-"+facultyContainerNums[containerNum]
                        vis_capacity_id = "vis-capacity-"+facultyContainerNums[containerNum]

                        individual_allocation = []
                        individual_allocation.push(document.getElementById(fac_input_id).getAttribute('day-what'))
                        individual_allocation.push(document.getElementById(fac_input_id).value)
                        individual_allocation.push(document.getElementById(std_capacity_id).value)
                        individual_allocation.push(document.getElementById(vis_capacity_id).value)
                        allocation.push(individual_allocation)
                        containerNum = containerNum + 1
                    }
                })
                console.log(allocation)

                let obj = {}
                obj[0] = newEvent._id
                allocation.forEach((block, x) => {
                    let sobj = {}
                    block.forEach((item, y) => {
                        sobj[y] = item
                    })
                    obj[x+1] = sobj
                })
                console.log(obj)

                //save allocation
                const save_allocation_response = await fetch('/allocations/save', {method: 'POST', body: JSON.stringify(obj), headers : {"Content-Type": "application/json"}})
                const allocation_response = await save_allocation_response.json()
                console.log(allocation_response)
                console.log(allocation_response.status)

                toastr.options.timeOut = 1000
                // toastr.options.extendedTimeOut = 0
                toastr.options.positionClass = "toast-bottom-right"
                toastr.info(allocation_response.status)

                tags = []
                tags.push(newEvent._id)
                var badges = document.getElementsByClassName('badge')
                if(badges.length > 0){
                    Array.from(badges).forEach(badge => {
                        tags.push(badge.firstChild.textContent)
                    })
                }

                // tags = ["5c3ef4a01a3cce0b20bc2c45" ,"convocation", "ceremony", "graduation"]
                let tagObjs = {}

                tags.forEach((tag, idx) => {
                    tagObjs[idx] = tag
                })

                //save tag
                const save_tag_response = await fetch('/tags/save', {method: 'POST', body: JSON.stringify(tagObjs), headers : {"Content-Type": "application/json"}})
                const tag_response = await save_tag_response.json()
                console.log(tag_response)
                console.log(tag_response.status)

                toastr.options.timeOut = 1000
                // toastr.options.extendedTimeOut = 0
                toastr.options.positionClass = "toast-bottom-right"
                toastr.info(tag_response.status)
                
                
                swal("All Done", "Event saved successfully!", "success")
                    .then(val => {
                        window.location.reload()
                    })
            }
            
        }
        catch (error){
            console.log(error)
        }

    }

    publishBtn.textContent = ''
    let upload = document.createElement('i')
    upload.className = 'fas fa-upload'
    
    let txt = document.createTextNode(' Publish Event')
    publishBtn.append(upload)
    publishBtn.append(txt)
    publishBtn.disabled = false
}
function addTag(e){
    if(e.code == 'Enter'){
        let tagslen = tagList.children.length
        if(tagslen < 5){
            let text = e.target.value
            let a = document.createElement('a')
            a.className = 'badge badge-light'
            a.id = 'tagcreated'
            let atxt = document.createTextNode(text)
            a.appendChild(atxt)
            let btn = document.createElement('span')
            btn.className = 'btCancel'
            btn.id = 'tgCancel'
            btn.append(document.createTextNode('X'))
            a.appendChild(btn)
            a.addEventListener('click', removeTag)
            tagList.appendChild(a)
            tagInput.value = ''
        }else{
            alert("Tag limit reached!")
        }        
    }
}
function removeTag(e){
    if(e.target.classList.contains('btCancel')){
        tagList.removeChild(this)
    }
}

// custion functions
function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return (Math.floor(difference_ms/ONE_DAY) + 1)
}

function lg(message){
    console.log(message)
}

function checkError(){
    // lg("checking")
    let publishBtn = document.getElementById('btnPublish')
    if(errorList.length > 0){
        publishBtn.disabled = true
    }else{
        if(publishBtn.disabled)
            publishBtn.disabled = false
    }
}

let intervalId = setInterval(checkError, 3000);

})