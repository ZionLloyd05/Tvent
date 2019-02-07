let eventStore = []
let publicEventStore = []
let privateEventStore = []

let search = document.getElementById('search')
let evList = document.getElementById('evList')

window.addEventListener('load', prepareEventListContainer)
search.addEventListener('keyup', performSeach)
document.addEventListener('click', showEventPreview)


async function prepareEventListContainer() {
    let event_count = document.getElementById('event_count')
    let public_count = document.getElementById('public_count')
    let private_count = document.getElementById('private_count')

    let csrfToken = document.getElementById('_csrf').value

    const get_events = await fetch('/events/u', {
        method: 'GET',
        headers: {
            "X-CSRF-TOKEN": csrfToken
        }
    })

    eventStore = await get_events.json()
    publicEventStore = eventStore.filter(obj => {
        return obj.status === 'public'
    })
    privateEventStore = eventStore.filter(obj => {
        return obj.status === 'private'
    })

    //insert event counts
    event_count.textContent = eventStore.length
    public_count.textContent = publicEventStore.length
    private_count.textContent = privateEventStore.length


    let evList = document.getElementById('evList')
    while (evList.firstChild)
        evList.removeChild(evList.firstChild)

    buildEvCards(eventStore)


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

async function showEventPreview(e) {


    if (e.target.classList.contains('event')) {
        let evCardId
        let eventPayLoad
        let evAllocationPayLoad
        let evTagPayLoad
        let evTitle = document.getElementById('evTitle')
        let loader = document.getElementById('loaderDiv')
        let eventDiv = document.getElementById('eventDiv')

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

        let evCard = e.target
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

        //get event's allocation && event's tag
        const get_allocations = await fetch('/allocations/' + evCardId, {
            method: 'GET'
        })

        evAllocationPayLoad = await get_allocations.json()
        //console.log(evAllocationPayLoad)

        const get_tags = await fetch('/tags/' + evCardId, {
            method: 'GET'
        })

        evTagPayLoad = await get_tags.json()
        //console.log(evTagPayLoad)

        buildEventView(eventPayLoad, evAllocationPayLoad, evTagPayLoad)

        if (loader)
            loader.style.display = 'none'
        if (eventDiv)
            eventDiv.style.display = 'inline-flex'

    }


}

function buildEventView(eventPayload, allocationPayload, tagPayload) {
    let evTitle = document.getElementById('evTitle')
    let evPoster = document.getElementById('evPoster')
    let evMetadata = document.getElementById('evMetadata')
    let evLink = document.getElementById('evLink')

    let btnEdit = document.getElementById('btn_edit')
    let btnDelete = document.getElementById('btn_delete')
    let btnPreview = document.getElementById('btn_preview')

    evLink.textContent = ''
    evLink.textContent = eventPayload.link.substring(0, 45) + '...'
    evLink.href = eventPayload.link

    btnEdit.setAttribute('data-id', eventPayload._id)
    btnDelete.setAttribute('data-id', eventPayload._id)
    btnPreview.setAttribute('data-id', eventPayload._id)

    //title
    let title = document.createElement('h4')
    //title.style.fontSize = 20
    title.className = 'display-4 evTitle'
    title.textContent = eventPayload.title
    while (evTitle.firstChild) {
        evTitle.removeChild(evTitle.firstChild)
    }
    evTitle.append(title)

    //poster
    while (evPoster.firstChild) {
        evPoster.removeChild(evPoster.firstChild)
    }
    let img = document.createElement('img')
    img.src = '/uploads/' + eventPayload.posterUrl
    img.alt = 'Event Poster'
    img.style.maxWidth = '100%'

    evPoster.append(img)

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
    desc.textContent = eventPayload.description

    evMetadata.append(datetime)
    evMetadata.append(desc)

    //spawn tags
    tagPayload.forEach(tag => {
        let aTag = document.createElement('a')
        aTag.className = 'badge badge-light'
        aTag.textContent = tag.title
        evMetadata.append(aTag)
    })

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
}