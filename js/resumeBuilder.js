var resumeData =
"https://raw.githubusercontent.com/bcolborn/frontend-nanodegree-resume/master/js/resumeBuilder.json";

var publicationData = "https://raw.githubusercontent.com/bcolborn/frontend-nanodegree-resume/master/data/Publications.csv";

$.getJSON(resumeData, {
    format: "json"
}).done(function (data) {
    console.log(data);
    
    function bioDisplay() {
        var fmtName = HTMLheaderName.replace("%data%", data.bio.name);
        $("#header").append(fmtName);
        
        var fmtRole = HTMLheaderRole.replace("%data%", data.bio.role);
        $("#header").append(fmtRole);
        
        var fmtImage = HTMLbioPic.replace("%data%", data.bio.photo);
        $("#header").append(fmtImage);
        
        $("#header").append(HTMLskillsStart);
        for (var item in data.bio.skills) {
            var fmtSkill = HTMLskills.replace("%data%", data.bio.skills[item]);
            $("#skills").append(fmtSkill);
        }
    }
    
    function workDisplay() {
        for (var item in data.jobs) {
            $("#workExperience").append(HTMLworkStart);
            
            var fmtEmployer = HTMLworkEmployer.replace("%data%", data.jobs[item].name);
            var fmtTitle = HTMLworkTitle.replace("%data%", data.jobs[item].position);
            $(".work-entry:last").append(fmtEmployer + fmtTitle);
            
            var fmtDates = HTMLworkDates.replace("%data%", data.jobs[item].dates)
            $(".work-entry:last").append(fmtDates);
            
            var fmtLocation = HTMLworkLocation.replace("%data%", data.jobs[item].location);
            $(".work-entry:last").append(fmtLocation);
            
            var fmtDescription = HTMLworkDescription.replace("%data%", data.jobs[item].desc);
            $(".work-entry:last").append(fmtDescription);
        }
    }
    
    function eduDisplay() {
        for (var item in data.schools) {
            $("#education").append(HTMLschoolStart);
            
            var fmtSchoolName = HTMLschoolName.replace("%data%", data.schools[item].name);
            var fmtSchoolDegree = HTMLschoolDegree.replace("%data%", data.schools[item].degree);
            $(".education-entry:last").append(fmtSchoolName + fmtSchoolDegree);
            
            var fmtSchoolMajor = HTMLschoolMajor.replace("%data%", data.schools[item].major);
            $(".education-entry:last").append(fmtSchoolMajor);
            
            var fmtSchoolLocation = HTMLschoolLocation.replace("%data%",
            data.schools[item].location);
            $(".education-entry:last").append(fmtSchoolLocation);
        }
    }
    
    function projectsDisplay() {
        for (var item in data.proj) {
            $("#projects").append(HTMLprojectStart);
            $(".project-entry:last").append(HTMLprojectTitle.replace("%data%", data.proj[item].name));
            $(".project-entry:last").append(HTMLprojectDates.replace("%data%", data.proj[item].dates));
            $(".project-entry:last").append(HTMLprojectDescription.replace("%data%",
            data.proj[item].description));
            if (data.proj[item].images.length > 0) {
                for (var image in data.proj[item].images) {
                    $(".project-entry:last").append(HTMLprojectImage.replace("%data%",
                    data.proj[item].images[image]));
                }
            }
        }
    };
    
    function contactDisplay(id) {
        for (var item in data.bio.contacts) {
            var fmtContact = HTMLcontactGeneric.replace("%data%", data.bio.contacts[item]);
            fmtContact = fmtContact.replace("%contact%", item);
            $(id).append(fmtContact);
        }
    }
    
    contactDisplay("#topContacts");
    bioDisplay();
    workDisplay();
    projectsDisplay();
    eduDisplay();
    contactDisplay("#footerContacts");
    
    if (document.getElementsByClassName('flex-item').length === 0) {
        document.getElementById('topContacts').style.display = 'none';
    }
    if (document.getElementsByTagName('h1').length === 0) {
        document.getElementById('header').style.display = 'none';
    }
    if (document.getElementsByClassName('work-entry').length === 0) {
        document.getElementById('workExperience').style.display = 'none';
    }
    if (document.getElementsByClassName('project-entry').length === 0) {
        document.getElementById('projects').style.display = 'none';
    }
    if (document.getElementsByClassName('education-entry').length === 0) {
        document.getElementById('education').style.display = 'none';
    }
    if (document.getElementsByClassName('flex-item').length === 0) {
        document.getElementById('lets-connect').style.display = 'none';
    }
    if (document.getElementById('map') === null) {
        document.getElementById('mapDiv').style.display = 'none';
    }
});


$.get(publicationData, {
    format: "text"
}).done(function (data) {
    //console.log(data);
    var publications = csv2obj(data);
    console.log(publications);
    publicationsDisplay(publications);
});

function publicationsDisplay(data) {
    for (var item in data) {
        $("#publications").append(HTMLpublicationStart);
        $(".project-entry:last").append(HTMLpublicationTitle.replace("%data%",
        data[item].Name).replace("%url%", data[item].Url));
        $(".project-entry:last").append(HTMLpublicationDates.replace("%data%", data[item].Date));
        $(".project-entry:last").append(HTMLpublicationDescription.replace("%data%",
        data[item].Description));
    }
};

function parse(row) {
    var insideQuote = false,
    entries =[],
    entry =[];
    row.split('').forEach(function (character) {
        if (character === '"') {
            insideQuote = ! insideQuote;
        } else {
            if (character == "," && ! insideQuote) {
                entries.push(entry.join(''));
                entry =[];
            } else {
                entry.push(character);
            }
        }
    });
    entries.push(entry.join(''));
    return entries;
}

function csv2obj(csv) {
    
    // Split the input into lines
    lines = csv.split('\n'),
    
    // Extract column names from the first line
    columnNamesLine = lines[0],
    columnNames = parse(columnNamesLine),
    
    // Extract data from subsequent lines
    dataLines = lines.slice(1),
    data = dataLines.map(parse);
    
    var dataObjects = data.map(function (arr) {
        var dataObject = {
        };
        columnNames.forEach(function (columnName, i) {
            dataObject[columnName] = arr[i];
        });
        return dataObject;
    });
    
    //console.log(JSON.stringify(dataObjects));
    return dataObjects;
}