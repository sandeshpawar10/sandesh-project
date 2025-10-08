
document.addEventListener("DOMContentLoaded",function(){
    let username = document.getElementById('username')
    let searchbtn = document.getElementById('search-btn')
    let easycircle = document.getElementById('easy')
    let mediumcircle = document.getElementById('medium')
    let hardcircle = document.getElementById('hard')
    let easyprogress = document.querySelector('.info-circle:nth-child(1)');
    let mediumprogress = document.querySelector('.info-circle:nth-child(2)');
    let hardprogress = document.querySelector('.info-circle:nth-child(3)');
    let card = document.querySelector('.stats-card')
    let easycard = document.querySelector('.ecard')
    let mediumcard = document.querySelector('.mcard')
    let hardcard = document.querySelector('.hcard')
    let tcard = document.querySelector('.tcard')
    // let username = document.getElementById('user')
    // let username = document.getElementById('user')
    // let username = document.getElementById('user')
    // let username = document.getElementById('user')

    

    function validateusername(usernameinput){
        if(usernameinput.trim()===""){
            alert("UserName cannot be empty.Please Enter valid username")
            return false
        }
        let validexpression = /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]{1,28}[a-zA-Z0-9])?$/;

        if(!validexpression.test(usernameinput)){
            alert("Invalid Username")
            return false;
        }
        else{
            return true;
        }
    }


    function displayuserdata(solved, total,label,circel,s,c){
        let percentage = (solved/total)*100
        circel.style.setProperty("--progress-degree", `${percentage}%`)
        
        
        if(label===easycircle){
            label.textContent = `${solved}/${total}`+" Easy"
        }
        else if(label===mediumcircle){
            label.textContent = `${solved}/${total}`+" Medium"
        }
        else{
            label.textContent = `${solved}/${total}`+" Hard"
        }
        
        let countElement = c.querySelector("p");
        countElement.textContent = s;
        
    }

    function gettinguserdata(mydata){
        let totalquestions = mydata.data.allQuestionsCount[0].count
        let totaleasyquestions = mydata.data.allQuestionsCount[1].count
        let totalmediumquestions = mydata.data.allQuestionsCount[2].count
        let totalhardquestions = mydata.data.allQuestionsCount[3].count

        let solvedeasyquestions = mydata.data.matchedUser.submitStats.acSubmissionNum[1].count
        let solvedmediumquestions = mydata.data.matchedUser.submitStats.acSubmissionNum[2].count
        let solvedhardquestions = mydata.data.matchedUser.submitStats.acSubmissionNum[3].count

        let totalSubmission = mydata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions
        let easySubmission = mydata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions
        let mediumSubmission = mydata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions
        let hardSubmission = mydata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions


        displayuserdata(solvedeasyquestions,totaleasyquestions,easycircle,easyprogress,easySubmission,easycard)
        displayuserdata(solvedmediumquestions,totalmediumquestions,mediumcircle,mediumprogress,mediumSubmission,mediumcard)
        displayuserdata(solvedhardquestions,totalhardquestions,hardcircle,hardprogress,hardSubmission,hardcard)
        document.querySelector(".tcard p").textContent = totalSubmission;
        // displayuserdata(solvedeasyquestions,totaleasyquestions,easycircle,easyprogress)


    }

    

    async function fetchdata(usernameinput){
        // const proxyurl = "https://cors-anywhere.herokuapp.com/"
        const url = 'http://localhost:3000/leetcode'

        let newheader = new Headers()
        newheader.append("content-type","application/json")


        let graphql = JSON.stringify({
            query:"\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
            variables:{"username": usernameinput}
        })

        let options = {
            method:"POST",
            headers:newheader,
            body:graphql,
            redirect:"follow"
        }


        try{
            searchbtn.textContent = "Searching..."
            searchbtn.disabled = true;
            
            let response = await fetch(url,options);
            if(!response.ok){
                throw new Error("Data is not available")
            }
            let mydata = await response.json()
            console.log(mydata)
            gettinguserdata(mydata)
        }
        catch(error){
            alert("Data not found")
        }
        finally{
            searchbtn.textContent = "Search"
            searchbtn.disabled = false
            
        }

        

    }

    function resetdata(){
        easyprogress.style.setProperty("--progress-degree", "0%");
        mediumprogress.style.setProperty("--progress-degree", "0%");
        hardprogress.style.setProperty("--progress-degree", "0%");

        easycircle.textContent = "Easy"
        mediumcircle.textContent = "Medium"
        hardcircle.textContent = "Hard"

        // easycard.textContent = "Easy Submissions"
        // mediumcard.textContent = "Medium Submissions"
        // hardcard.textContent = "Hard Submissions"
        // tcard.textContent = "Total Submissions"
        document.querySelector(".tcard p").textContent = "0";
        document.querySelector(".ecard p").textContent = "0";
        document.querySelector(".mcard p").textContent = "0";
        document.querySelector(".hcard p").textContent = "0";
    }


    username.addEventListener('input',function(){
        if(username.value.trim()===""){
            resetdata();
        }
        else{
            resetdata();
        }
    })

    // search button function starts here

    searchbtn.addEventListener('click', function(){
        let usernameinput = username.value;
        console.log(usernameinput)
        if(validateusername(usernameinput)){
            fetchdata(usernameinput)
        }
    })


})