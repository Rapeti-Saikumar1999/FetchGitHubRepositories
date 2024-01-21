const reposList = document.querySelector("#repos-list");

function DisplayNext(allRepos,count)
{
    let text = "";
    reposList.innerHTML = "";
    for (let i=count;i<count+10;i++) {
        let repo = allRepos[i];
        if(repo)
        {
        let span = "";
        const { name, description, topics} = repo;

        if (topics && topics.length > 0) {
            topics.forEach((e) => (span += `<span class="topics">${e}</span> `));
        }

        text += `<li>
                 <p class="title">${name}</p>
                 <p class="desc">${description? description:""}</p>
                 <p class="topicsEllipsis">${span}</p>
                 </li>`;

        reposList.innerHTML = text;
        }
    }
}
let page = 1;
let allRepos = [];
let count=0;
let pageNumber=1;

async function fetchRepositories() {
    let username = document.getElementById('github-username').value;
    const NextButton = document.querySelector("#nextButton");
    const PrevButton = document.querySelector("#prevButton");
    page = 1;
    allRepos = [];
    count=0;
    pageNumber=1;

    //show loading messages 
    document.querySelector(".loading").style.display="block";

    try {
        while (true) {
            const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=100`);   

            if (!response.ok) {
                throw new Error(`GitHub API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                break; 
            }

            allRepos = allRepos.concat(data);
            page++;
        }


        // disable loading message
        document.querySelector(".loading").style.display="none";


        //profile
        const {owner} = allRepos[0];
        document.querySelector(".imgContainer").innerHTML=`<img src=${owner.avatar_url} alt="image">`;
        document.querySelector(".info").innerHTML=`<h2>${owner.login}</h2>
                                                   <a href=${owner.html_url} class="githubLink" target="__blank">${owner.html_url}</a>`
        

        //displaing first 10 repo's by default after successfull data fetch
        DisplayNext(allRepos,count);
        document.querySelector("#pageCount").innerHTML=pageNumber;


        //display next 10 repositories
        NextButton.addEventListener('click',()=>
        {
            if(count<=allRepos.length-10)
            {
            count+=10;  
            ++pageNumber;
            DisplayNext(allRepos,count);
            document.querySelector("#pageCount").innerHTML=pageNumber;
            }  
        })

        //display prev 10 repositories
        PrevButton.addEventListener('click',()=>
        {
            if(count>0)
            {
            count-=10;
            --pageNumber;
            DisplayNext(allRepos,count);
            document.querySelector("#pageCount").innerHTML=pageNumber;
            }  
        })  
    } 
    
    catch (error) {
        console.error("Error fetching repositories:", error.message);
    }
}
