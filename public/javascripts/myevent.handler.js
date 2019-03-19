'use strict'
let eventStore = []
let publicEventStore = []
let privateEventStore = []
let search = document.getElementById('search')
let evList = document.getElementById('evList')
let csrfToken = document.getElementById('_csrf').value


let btnEdit = document.getElementById('btn_edit')
let btnDelete = document.getElementById('btn_delete')
let btnPreview = document.getElementById('btn_preview')

window.addEventListener('load', prepareEventListContainer)
search.addEventListener('keyup', performSeach)
document.addEventListener('click', showEventPreview)

let eventId = ''

function prepareEventListContainer() {
    let event_count = document.getElementById('event_count')
    let public_count = document.getElementById('public_count')
    let private_count = document.getElementById('private_count')


    fetch('/events/u', {
            method: 'GET',
            headers: {
                "X-CSRF-TOKEN": csrfToken
            }
        }).then(res => res.json())
        .then(response => {
            eventStore = response
            publicEventStore = response.filter(obj => {
                return obj.status === 'public'
            })
            privateEventStore = response.filter(obj => {
                return obj.status === 'private'
            })

            //insert event counts
            event_count.textContent = response.length
            public_count.textContent = publicEventStore.length
            private_count.textContent = privateEventStore.length


            let evList = document.getElementById('evList')
            while (evList.firstChild)
                evList.removeChild(evList.firstChild)

            buildEvCards(response)
        })
        .catch(error => console.error('Error:', error))




    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('radio')) {

            while (evList.firstChild)
                evList.removeChild(evList.firstChild)
            switch (e.target.value) {

                case ('all'):
                    buildEvCards(eventStore)
                    break
                case ('public'):
                    buildEvCards(publicEventStore)
                    break
                case ('private'):
                    buildEvCards(privateEventStore)
                    break
                default:
                    break
            }
        }
    })

}

function buildEvCards(evStore = []) {
    evStore.forEach(event => {
        let evCard = document.createElement('div')
        evCard.className = 'event'
        evCard.id = 'event'
        evCard.setAttribute('ev-id', event._id)
        let title = document.createElement('h6')
        title.append(document.createTextNode(event.title))
        //console.log(event)
        let startdate = new Date(event.start.substring(0, 10))
        let enddate = new Date(event.end.substring(0, 10))

        let date = document.createElement('span')
        let dateTxt
        if (event.start === event.end) {
            dateTxt = document.createTextNode(startdate.toString().substring(0, 15))
        } else {
            dateTxt = document.createTextNode(startdate.toString().substring(0, 15) + ' - ' + enddate.toString().substring(0, 15))
        }
        date.append(dateTxt)

        let capacity = document.createElement('span')
        capacity.className = 'capacity'
        capacity.append(document.createTextNode('0/200'))

        evCard.append(title)
        evCard.append(date)
        evCard.append(capacity)

        evList.append(evCard)
    })
}

function performSeach(e) {
    let searchText = e.target.value
    var eventList = document.getElementsByClassName('event')

    Array.from(eventList).forEach(event => {
        var eventName = event.firstChild.textContent

        if (eventName.toLowerCase().indexOf(searchText) != -1) {
            event.style.display = 'block'
        } else {
            event.style.display = 'none'
        }
    })
}

function showEventPreview(e) {


    if (e.target.classList.contains('event')) {
        let evCardId
        let eventPayLoad
        let evAllocationPayLoad
        let evTagPayLoad
        let evTitle = document.getElementById('evTitle')
        let loader = document.getElementById('loaderDiv')
        let eventDiv = document.getElementById('eventDiv')

        btnEdit.removeAttribute('disabled')
        btnDelete.removeAttribute('disabled')
        btnPreview.removeAttribute('disabled')

        if (btnEdit.textContent == 'Save')
            btnEdit.textContent = 'Edit'

        if (loader)
            loader.style.display = 'block'
        if (eventDiv)
            eventDiv.style.display = 'none'

        while (evTitle.firstChild) {
            evTitle.removeChild(evTitle.firstChild)
        }

        let loadingSpan = document.createElement('span')
        //let icon = document.createElement('i')
        //icon.className = 'fa fa-spinner fa-spin'
        loadingSpan.append(document.createTextNode('Loading event details ...'))
        //loadingSpan.append(icon)
        evTitle.append(loadingSpan)

        //let evCard = e.target
        evCardId = e.target.getAttribute('ev-id')
        let rbtnVal = document.querySelector('input[name="radio"]:checked').value;

        switch (rbtnVal) {
            case ('all'):
                eventPayLoad = eventStore.find(event => event._id == evCardId)
                break
            case ('public'):
                eventPayLoad = publicEventStore.find(event => event._id == evCardId)
                break
            case ('private'):
                eventPayLoad = privateEventStore.find(event => event._id == evCardId)
                break
            default:
                break
        }
        //console.log(eventPayLoad)

        eventId = evCardId

        //get event's allocation && event's tag
        fetch('/allocations/' + evCardId, {
                method: 'GET'
            }).then(res => res.json())
            .then(response => {
                buildAllocation(response)
            })
            .catch(error => console.error('Error:', error))

        //======evAllocationPayLoad = await get_allocations.json()
        //console.log(evAllocationPayLoad)

        fetch('/tags/' + evCardId, {
                method: 'GET'
            }).then(res => res.json())
            .then(response => {
                buildTagMetaData(response)
            })
            .catch(error => console.error('Error:', error))

        //======evTagPayLoad = await get_tags.json()
        //console.log(evTagPayLoad)
        // Promise.all([get_allocations, get_tags])
        //     .then(response => {
        //         console.log(response)
        //     })
        buildEventView(eventPayLoad)

        if (loader)
            loader.style.display = 'none'
        if (eventDiv)
            eventDiv.style.display = 'inline-flex'

    }


}

function buildAllocation(allocationPayload) {
    //spaen allocation
    let tblAllocation = document.getElementById('allocationBody')
    //meta data
    while (tblAllocation.firstChild) {
        tblAllocation.removeChild(tblAllocation.firstChild)
    }

    allocationPayload.forEach(allocation => {
        let tblRow = document.createElement('tr')

        let day = document.createElement('th')
        let division = document.createElement('td')
        let registered = document.createElement('td')
        let capacity = document.createElement('td')

        day.textContent = allocation.day
        day.setAttribute('scope', 'col')
        division.textContent = allocation.division
        registered.textContent = allocation.fill
        capacity.textContent = (allocation.capacity + allocation.extra)

        tblRow.append(day)
        tblRow.append(division)
        tblRow.append(registered)
        tblRow.append(capacity)

        tblAllocation.append(tblRow)
    })

    //edit allocation table
    let editTable = document.getElementById('editTbl')
    let editAllocation = document.getElementById('editAllocationBody')
    while (editAllocation.firstChild) {
        editAllocation.removeChild(editAllocation.firstChild)
    }

    editTable.style.setProperty('display', 'none')

    allocationPayload.forEach(allocation => {
        let tblRow = document.createElement('tr')
        tblRow.setAttribute('id', allocation._id)

        let day = document.createElement('th')
        let division = document.createElement('td')
        let registered = document.createElement('td')
        let capacity = document.createElement('td')
        let action = document.createElement('td')
        action.style.setProperty('width', '20%')

        day.textContent = allocation.day
        day.setAttribute('scope', 'col')

        let divisionInp = document.createElement('input')
        divisionInp.className = 'form-control'
        divisionInp.setAttribute('value', allocation.division)

        division.append(divisionInp)

        registered.textContent = allocation.fill

        let capacityInp = document.createElement('input')
        capacityInp.className = 'form-control'
        capacityInp.style.setProperty('width', '50%')
        capacityInp.setAttribute('value', (allocation.capacity + allocation.extra))

        capacity.append(capacityInp)

        let editBtn = document.createElement('button')
        editBtn.className = 'btn btn-tbl btn-icn btn-primary'
        editBtn.setAttribute('op', 'save')
        editBtn.setAttribute('_id', allocation._id)

        let iedit = document.createElement('i')
        iedit.className = 'fa fa-save'
        iedit.setAttribute('_id', allocation._id)
        iedit.setAttribute('op', 'save')
        editBtn.append(iedit)

        let deleteBtn = document.createElement('button')
        deleteBtn.className = 'btn btn-tbl btn-danger btn-icn'
        deleteBtn.setAttribute('_id', allocation._id)
        deleteBtn.setAttribute('op', 'delete')

        let idelete = document.createElement('i')
        idelete.className = 'fa fa-trash'
        idelete.setAttribute('op', 'delete')
        idelete.setAttribute('_id', allocation._id)
        deleteBtn.append(idelete)

        action.append(editBtn)
        action.append(deleteBtn)

        tblRow.append(day)
        tblRow.append(division)
        tblRow.append(registered)
        tblRow.append(capacity)
        tblRow.append(action)

        editAllocation.append(tblRow)
    })

}

function buildTagMetaData(tagPayload) {

    //spawn tags
    tagPayload.forEach(tag => {
        let aTag = document.createElement('a')
        aTag.className = 'badge badge-light tag__live'
        aTag.textContent = tag.title
        aTag.setAttribute('id', 'tag__live')
        evMetadata.append(aTag)
    })

    tagPayload.forEach(tag => {
        addEditTag(tag)
    })
}

function buildEventView(eventPayload) {
    console.log(eventPayload)
    let evTitle = document.getElementById('evTitle')
    let evPoster = document.getElementById('evPoster')
    let evMetadata = document.getElementById('evMetadata')
    let evLink = document.getElementById('evLink')


    let livetbl = document.getElementById('livetbl')
    livetbl.style.setProperty('display', 'inline-table')


    evLink.textContent = ''
    evLink.textContent = eventPayload.link.substring(0, 45) + '...'
    evLink.href = eventPayload.link

    btnEdit.setAttribute('data-id', eventPayload._id)
    btnDelete.setAttribute('data-id', eventPayload._id)
    btnPreview.setAttribute('data-id', eventPayload._id)
    btnPreview.setAttribute('ref', eventPayload.reference)

    //title
    let title = document.createElement('h4')
    //title.style.fontSize = 20
    title.className = 'display-4 evTitle'
    title.setAttribute('id', 'title__live')
    title.textContent = eventPayload.title
    while (evTitle.firstChild) {
        evTitle.removeChild(evTitle.firstChild)
    }
    let inpTitle = document.createElement('input')
    inpTitle.className = 'form-control'
    inpTitle.setAttribute('value', eventPayload.title)
    inpTitle.setAttribute('id', 'title__edit')
    inpTitle.style.setProperty('display', 'none')
    evTitle.append(title)
    evTitle.append(inpTitle)

    //poster
    while (evPoster.firstChild) {
        evPoster.removeChild(evPoster.firstChild)
    }

    // ======== Hidden elements for the sake of update to event===========================
    let form = document.createElement('form')
    form.setAttribute('id', 'eventEditForm')
    form.setAttribute('enctype', 'multipart/form-data')

    let inpTitleEdit = document.createElement('input')
    inpTitleEdit.setAttribute('type', 'hidden')
    inpTitleEdit.setAttribute('id', 'inpTitleFrm')
    inpTitleEdit.setAttribute('name', 'title')
    inpTitleEdit.setAttribute('value', '')

    let inpDescEdit = document.createElement('input')
    inpDescEdit.setAttribute('type', 'hidden')
    inpDescEdit.setAttribute('id', 'inpDescFrm')
    inpDescEdit.setAttribute('name', 'description')
    inpDescEdit.setAttribute('value', '')

    let inpEvId = document.createElement('input')
    inpEvId.setAttribute('type', 'hidden')
    inpEvId.setAttribute('id', 'idFrm')
    inpEvId.setAttribute('name', 'id')
    inpEvId.setAttribute('value', '')

    let img = document.createElement('img')
    img.src = '/uploads/' + eventPayload.posterUrl
    img.alt = 'Event Poster'
    img.style.maxWidth = '100%'
    img.style.setProperty('font-size', '13px')
    img.setAttribute('id', 'poster__live')

    let imgLabel = document.createElement('label')
    imgLabel.setAttribute('id', 'label__edit')
    imgLabel.style.setProperty('display', 'none')
    imgLabel.textContent = 'Change event poster ?'

    let inpImg = document.createElement('input')
    inpImg.setAttribute('type', 'file')
    inpImg.setAttribute('id', 'poster__edit')
    inpImg.setAttribute('name', 'poster')
    inpImg.style.setProperty('display', 'none')

    form.append(inpTitleEdit)
    form.append(inpDescEdit)
    form.append(imgLabel)
    form.append(inpImg)
    form.append(inpEvId)

    //  ===========================================================


    evPoster.append(img)
    evPoster.append(form)

    //meta data
    while (evMetadata.firstChild) {
        evMetadata.removeChild(evMetadata.firstChild)
    }
    let startdate = new Date(eventPayload.start.substring(0, 10))
    let enddate = new Date(eventPayload.end.substring(0, 10))

    let dateTxt
    if (eventPayload.start === eventPayload.end) {
        dateTxt = document.createTextNode(startdate.toString().substring(0, 15))
    } else {
        dateTxt = document.createTextNode(startdate.toString().substring(0, 15) + ' - ' + enddate.toString().substring(0, 15))
    }
    let datetime = document.createElement('p')
    datetime.append(dateTxt)

    let desc = document.createElement('p')
    desc.setAttribute('id', 'desc__live')
    desc.textContent = eventPayload.description

    let inpDesc = document.createElement('textarea')
    inpDesc.setAttribute('id', 'desc__edit')
    inpDesc.setAttribute('row', '5')
    inpDesc.setAttribute('column', '30')
    inpDesc.className = 'form-control mb-2'
    inpDesc.setAttribute('placeholder', 'Enter description')
    inpDesc.textContent = eventPayload.description
    inpDesc.style.setProperty('display', 'none')

    let inpTag = document.createElement('input')
    inpTag.className = 'form-control inpTag'
    inpTag.setAttribute('placeholder', 'Enter tags')
    inpTag.style.setProperty('display', 'none')
    inpTag.setAttribute('id', 'inpTag')


    evMetadata.append(datetime)
    evMetadata.append(desc)
    evMetadata.append(inpDesc)
    evMetadata.append(inpTag)

}

btnPreview.addEventListener('click', function (e) {
    let ref = e.target.getAttribute('ref')
    let path = window.location.origin + '/events/r/' + ref

    window.location.replace(path)
})
// ============ adding tag in edit mode ==================
document.addEventListener('keydown', async function (e) {
    if (e.target.classList.contains('inpTag')) {
        if (e.code == 'Enter') {
            let title = e.target.value
            let event = eventId

            let tags = document.getElementsByClassName('tag__edit')
            if (tags.length < 5) {
                //api to create the tag
                let tag = {
                    event,
                    title
                }
                const save_tag_response = await fetch('/tags/single', {
                    method: 'POST',
                    body: JSON.stringify(tag),
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken
                    }
                })

                const tag_response = await save_tag_response.json()
                if (tag_response) {
                    let a = document.createElement('a')
                    a.className = 'badge badge-light tag__edit'
                    a.id = 'tagcreated'
                    let atxt = document.createTextNode(tag_response.title)
                    a.appendChild(atxt)
                    let btn = document.createElement('span')
                    btn.setAttribute('tag-id', tag_response._id)
                    btn.className = 'btCancel'
                    btn.id = 'tgCancel'
                    btn.append(document.createTextNode('X'))
                    a.appendChild(btn)
                    a.addEventListener('click', removeTag)
                    a.setAttribute('id', 'tag__edit')
                    a.style.setProperty('display', 'inline-block')
                    evMetadata.append(a)
                    swal("Tag created", '', 'success')
                }
                //use the returned object to addEditTag(tag)
            } else {
                swal("Tag limit reached", '', 'warning')
            }
        }
    }
})


// document.addEventListener('keydown', function (e) {
//     if (e.target.classList.contains('inpTag')) {
//         console.log(e.target.value)
//     }
// })

function addTag_EditMode(e, title) {
    let tags = document.getElementsByClassName('tag__edit')
    console.log(e)
    console.log(title)
    // if (e.code == 'Enter') 

    // 
}
// =======================================================

function addEditTag(tag) {
    let a = document.createElement('a')
    a.className = 'badge badge-light tag__edit'
    a.id = 'tagcreated'
    let atxt = document.createTextNode(tag.title)
    a.appendChild(atxt)
    let btn = document.createElement('span')
    btn.setAttribute('tag-id', tag._id)
    btn.className = 'btCancel'
    btn.id = 'tgCancel'
    btn.append(document.createTextNode('X'))
    a.appendChild(btn)
    a.addEventListener('click', removeTag)
    a.setAttribute('id', 'tag__edit')
    a.style.setProperty('display', 'none')
    evMetadata.append(a)
}

function removeTag(e) {
    if (e.target.classList.contains('btCancel')) {
        let btn = e.target
        let tagId = btn.getAttribute('tag-id')
        let evMetadata = document.getElementById('evMetadata')
        // console.log(tagId)
        //api call to remove tag
        swal({
                title: "Are you sure?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    //run deletion logic here

                    fetch('/tags/' + tagId, {
                            method: 'DELETE',
                            headers: {
                                "X-CSRF-TOKEN": csrfToken
                            }
                        }).then(res => res.json())
                        .then(response => {
                            if (response.status == true) {
                                evMetadata.removeChild(this)
                                swal('Tag deleted successfully.', '', 'success')
                            } else {
                                swal('Somthing went wrong!', '', 'warning')
                            }

                        })
                        .catch(error => console.error('Error:', error))


                } else {
                    swal("Deletion process cancelled");
                }
            })
        //remove tag object on client
        //tagList.removeChild(this)
    }
}

// =======================BTN DELETE==================================
btnDelete.addEventListener('click', function (e) {
    let event_id = btnDelete.getAttribute('data-id')
    let loader = document.createElement('div')
    loader.className = 'loader-btn'
    e.target.textContent = ''
    e.target.append(loader)

    swal({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async (willDelete) => {
            if (willDelete) {
                //run deletion logic here

                fetch('/events/delete/' + event_id, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": csrfToken
                        }
                    }).then(res => res.json())
                    .then(response => {
                        if (response) {
                            window.location.reload()
                        }
                    })
                    .catch(error => console.error('Error:', error))

            } else {
                swal('Deletion cancelled')
            }
        })
})
// ===================================================================


// =======================LIVE / EDIT TOGGLER =========================
let editAllocationBody = document.getElementById('editAllocationBody')

document.addEventListener('click', function (e) {
    let el = e.target.classList
    if (el.contains('btn-tbl') || el.contains('fa-save') || el.contains('fa-trash')) {
        let btn = e.target
        let allocationId = btn.getAttribute('_id')
        let operation = btn.getAttribute('op')
        let parent = document.getElementById(allocationId)
        let payLoad = {
            id: allocationId
        }
        if (operation == 'save') {
            if (parent.hasChildNodes()) {
                let children = parent.childNodes;

                for (let i = 0; i < children.length; i++) {
                    //console.log(children[i])
                    if (i == 1) {
                        let division = children[i].firstChild.value
                        payLoad['division'] = division
                    } else if (i == 3) {
                        let capacity = children[i].firstChild.value
                        payLoad['capacity'] = capacity
                    }
                }

                //saving event
                fetch('/allocations/update', {
                        method: 'Post',
                        body: JSON.stringify(payLoad),
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": csrfToken
                        }
                    }).then(res => res.json())
                    .then(response => {
                        if (response.status == true) {
                            swal('Allocation Saved', 'success')
                        }
                    })
                    .catch(error => console.error('Error:', error))

            }
        } else if (operation == 'delete') {
            swal({
                    title: "Are you sure?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        //run deletion logic here

                        fetch('/allocations/' + allocationId, {
                                method: 'DELETE',
                                headers: {
                                    "X-CSRF-TOKEN": csrfToken
                                }
                            }).then(res => res.json())
                            .then(response => {
                                if (response.status == true) {
                                    editAllocationBody.removeChild(parent)
                                    swal('Allocation deleted successfully.', '', 'success')
                                } else {
                                    swal('Somthing went wrong!', '', 'warning')
                                }
                            })
                            .catch(error => console.error('Error:', error))

                    } else {
                        swal("Deletion process cancelled");
                    }
                })
        }
    }
})

btnEdit.addEventListener('click', function () {

    let id = btnEdit.getAttribute('data-id')

    if (btnEdit.textContent == 'Edit') {
        toggleRenderer("Edit");
        btnEdit.textContent = 'Save'
    } else if (btnEdit.textContent == 'Save') {
        let live_desc = document.getElementById('desc__live').textContent
        let live_title = document.getElementById('title__live').textContent

        let new_desc = document.getElementById('desc__edit').value
        let new_title = document.getElementById('title__edit').value

        if (new_desc != live_desc || new_title != live_title) {
            //roll out updates
            document.getElementById('inpTitleFrm').value = new_title
            document.getElementById('inpDescFrm').value = new_desc
            document.getElementById('idFrm').value = id

            let form = document.getElementById('eventEditForm')
            let formData = new FormData(form)

            fetch('/events/update', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        "X-CSRF-TOKEN": csrfToken
                    }
                }).then(res => res.json())
                .then(response => {
                    if (response.status == 'Done') {
                        swal('Event updated', '', 'success')
                            .then(() => {
                                window.location.reload()
                            })
                    }
                })
                .catch(error => console.error('Error:', error))

            toggleRenderer("Live");
            btnEdit.textContent = 'Edit'
        } else {
            toggleRenderer("Live");
            btnEdit.textContent = 'Edit'
        }

    }
})

function toggleRenderer(toggleTo) {
    if (toggleTo == 'Live') {
        let title_live = document.getElementById('title__live')
        let poster_live = document.getElementById('poster__live')
        let desc_live = document.getElementById('desc__live')
        let live_tags = document.getElementsByClassName('tag__live')
        let livetbl = document.getElementById('livetbl')

        title_live.style.setProperty('display', 'block')
        poster_live.style.setProperty('display', 'block')
        desc_live.style.setProperty('display', 'block')
        livetbl.style.setProperty('display', 'inline-table')
        Array.from(live_tags).forEach(tag => {
            tag.style.setProperty('display', 'inline-block')
        })

        let title_edit = document.getElementById('title__edit')
        let poster_edit = document.getElementById('poster__edit')
        let desc_edit = document.getElementById('desc__edit')
        let edit_tags = document.getElementsByClassName('tag__edit')
        let inpTag = document.getElementById('inpTag')
        let editTable = document.getElementById('editTbl')
        let posterlabel = document.getElementById('label__edit')

        title_edit.style.setProperty('display', 'none')
        poster_edit.style.setProperty('display', 'none')
        desc_edit.style.setProperty('display', 'none')
        posterlabel.style.setProperty('display', 'none')
        editTable.style.setProperty('display', 'none')
        inpTag.style.setProperty('display', 'none')
        Array.from(edit_tags).forEach(tag => {
            tag.style.setProperty('display', 'none')
        })
    } else if (toggleTo == "Edit") {
        let title_live = document.getElementById('title__live')
        let poster_live = document.getElementById('poster__live')
        let desc_live = document.getElementById('desc__live')
        let live_tags = document.getElementsByClassName('tag__live')
        let livetbl = document.getElementById('livetbl')

        title_live.style.setProperty('display', 'none')
        poster_live.style.setProperty('display', 'none')
        desc_live.style.setProperty('display', 'none')
        livetbl.style.setProperty('display', 'none')
        Array.from(live_tags).forEach(tag => {
            tag.style.setProperty('display', 'none')
        })

        let title_edit = document.getElementById('title__edit')
        let poster_edit = document.getElementById('poster__edit')
        let desc_edit = document.getElementById('desc__edit')
        let posterlabel = document.getElementById('label__edit')
        let inpTag = document.getElementById('inpTag')
        let edit_tags = document.getElementsByClassName('tag__edit')
        let editTable = document.getElementById('editTbl')

        title_edit.style.setProperty('display', 'block')
        poster_edit.style.setProperty('display', 'block')
        posterlabel.style.setProperty('display', 'block')
        desc_edit.style.setProperty('display', 'block')
        inpTag.style.setProperty('display', 'block')
        editTable.style.setProperty('display', 'block')
        Array.from(edit_tags).forEach(tag => {
            tag.style.setProperty('display', 'inline-block')
        })
    }
}